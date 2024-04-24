import {db} from "@/db/db-client"
import {hashPassword, isPasswordValid} from "@/utils/password"
import {EmailVerification, Profile, User} from "@/db/schema"
import {symmetricDecrypt, symmetricEncrypt} from "@/utils/crypto"
import {env} from "@/env"
import {authenticator} from "@/two-factor/otp"
import {DateTime, Duration} from "luxon"
import {eq} from "drizzle-orm"

export async function existUsernameIgnoreCase(username: string) {
  const result = await db.query.Profile.findFirst({
    where: (profile, {ilike}) => (ilike(profile.username, username)),
    columns: {
      id: false,
      createdAt: false,
      avatarUrl: false,
      link: false,
      displayName: false,
      bio: false,
      location: false,
      canBeSearched: false,
      visibilityType: false,
    }
  })

  return Boolean(result)
}

export function findUserByEmail(email: string) {
  return db.query.User.findFirst({
    where: (user, {eq}) => (eq(user.email, email.toLowerCase())),
  })
}

export function findUserByUid(uid: string) {
  return db.query.User.findFirst({
    where: (user, {eq}) => (eq(user.uid, uid)),
  })
}

export function findEmailVerificationByVerificationId(verificationId: string) {
  return db.query.EmailVerification.findFirst({
    where: (emailVerification, {eq}) => (eq(emailVerification.verificationId, verificationId))
  })
}

export function findUnverifiedEmailAndInIntervalEmailVerifications(email: string, now: DateTime<true>) {
  const nowSql = now.toSQL({includeZone: false, includeOffset: false})


return db.query.EmailVerification.findMany({
    where: (emailVerification, {eq, and, gt}) => (
      and(
        eq(emailVerification.email, email.toLowerCase()),
        eq(emailVerification.isVerified, false),
        gt(emailVerification.expireAt, nowSql)
      )
    )
  })
}

export async function createEmailVerification(email: string, createdAt: DateTime<true>) {
  const expireAt = createdAt.plus(Duration.fromObject({hours: 2}))
  const createAtSql = createdAt.toSQL({includeZone: false, includeOffset: false})
  const expireAtSql = expireAt.toSQL({includeZone: false, includeOffset: false})
  const result = await db.insert(EmailVerification).values({
    email: email.toLowerCase(),
    createdAt: createAtSql,
    expireAt: expireAtSql,
    isVerified: false
  }).returning({verificationId: EmailVerification.verificationId})

  return result[0].verificationId
}

type CreateUserResult =
  "email_verification_not_found"
  | "email_verification_already_verified"
  | "email_verification_expired"
  | "email_already_used"
  | "username_already_used"
  | {uid: string, email: string}

export async function createUser(password: string, username: string, emailVerificationId: string, createdAt: DateTime<true>): Promise<CreateUserResult> {
  const createdAtSql = createdAt.toSQL({includeZone: false, includeOffset: false})
  const hashedPassword = await hashPassword(password, env.PEPPER_PASSWORD_SECRET)
  const avatarUrl = encodeURI(`https://api.dicebear.com/8.x/pixel-art/svg?seed=${username}`)
  const emailVerification = await findEmailVerificationByVerificationId(emailVerificationId)

  if (!emailVerification) {
    return "email_verification_not_found"
  }

  const {email} = emailVerification

  if (emailVerification.isVerified) {
    return "email_verification_already_verified"
  }

  const verificationEmailExpireAt = DateTime.fromSQL(emailVerification.expireAt)

  if (verificationEmailExpireAt < createdAt) {
    return "email_verification_expired"
  }

  const user = await findUserByEmail(email)

  if (user) {
    return "email_already_used"
  }

  if (await existUsernameIgnoreCase(username)) {
    return "username_already_used"
  }

  const uid = await db.transaction(async (db) => {
    const verifyEmailVerification = () => {
      return db
        .update(EmailVerification)
        .set({
          isVerified: true
        })
        .where(eq(EmailVerification.verificationId, emailVerificationId))
    }
    const createProfile = async () => {
      const createdProfile = await db
        .insert(Profile)
        .values({
          username,
          createdAt: createdAtSql,
          avatarUrl,
          displayName: username,
        })
        .returning({id: Profile.id})

      return createdProfile[0]
    }
    const createUser = async () => {
      const createdUser = await db
        .insert(User)
        .values({
          email,
          hashedPassword,
          profileId
        })
        .returning({uid: User.uid})

      return createdUser[0]
    }

    await verifyEmailVerification()

    const createdProfile = await createProfile()
    const profileId = createdProfile.id
    const createdUser = await createUser()
    const {uid} = createdUser

    return uid
  })


return {uid, email}
}

export async function verifyUserPasswordByEmail(email: string, password: string) {
  const user = await findUserByEmail(email)

  if (!user) {
    return "email_not_found"
  }

  if (await isPasswordValid(password, user.hashedPassword, env.PEPPER_PASSWORD_SECRET)) {
    return "valid"
  }


  return "invalid"
}

export async function verifyUserPasswordByUid(uid: string, password: string) {
  const user = await findUserByUid(uid)

  if (!user) {
    return "uid_not_found"
  }

  if (await isPasswordValid(password, user.hashedPassword, env.PEPPER_PASSWORD_SECRET)) {
    return "valid"
  }

  return "invalid"
}

export function resetTwoFactorAuthentification(id: number) {
  return db
    .update(User)
    .set({
      twoFactorEnabled: false,
      twoFactorSecret: null
    })
    .where(eq(User.id, id))
}

export function enableTwoFactorAuthentification(uid: string) {
  return db
    .update(User)
    .set({
      twoFactorEnabled: true
    })
    .where(eq(User.uid, uid))
}

export function disableTwoFactorAuthentification(uid: string) {
  return db
    .update(User)
    .set({
      twoFactorEnabled: false
    })
    .where(eq(User.uid, uid))
}

export async function setTwoFactorSecret(uid: string, secret: string) {
  return db
    .update(User)
    .set({
      twoFactorSecret: symmetricEncrypt(secret, env.TOTP_ENCRYPTION_KEY)
    })
    .where(eq(User.uid, uid))
}

export async function setupTwoFactorAuthentification(uid: string, password: string, secret: string) {
  const user = await findUserByUid(uid)

  if (!user) {
    return "uid_not_found"
  }

  if (user.twoFactorSecret) {
    return "two_factor_already_enabled"
  }

  if (!await isPasswordValid(password, user.hashedPassword, env.PEPPER_PASSWORD_SECRET)) {
    return "invalid_password"
  }

  await setTwoFactorSecret(uid, secret)


  return "setup_complete"
}

export async function verifyUserPasswordAndTotpCode(uid: string, password: string, totpCode: string) {
  const user = await findUserByUid(uid)

  if (!user) {
    return "uid_not_found"
  }

  if (!await isPasswordValid(password, user.hashedPassword, env.PEPPER_PASSWORD_SECRET)) {
    return "invalid_password"
  }

  if (!user.twoFactorEnabled) {
    return "two_factor_not_enabled"
  }

  if (!user.twoFactorSecret) {
    return "two_factor_no_secret"
  }

  const secret = symmetricDecrypt(user.twoFactorSecret, env.TOTP_ENCRYPTION_KEY)
  const isValidToken = authenticator().check(totpCode, secret)

  return isValidToken ? "valid" : "invalid_totp_code"
}


export async function verifyUserTotpCode(email: string, password: string, totpCode: string) {
  const user = await findUserByEmail(email)

  if (!user) {
    return "email_not_found"
  }

  if (!await isPasswordValid(password, user.hashedPassword, env.PEPPER_PASSWORD_SECRET)) {
    return "invalid_password"
  }

  if (!user.twoFactorEnabled) {
    return "two_factor_not_enabled"
  }

  if (!user.twoFactorSecret) {
    return "two_factor_no_secret"
  }

  const secret = symmetricDecrypt(user.twoFactorSecret, env.TOTP_ENCRYPTION_KEY)
  const isValidToken = authenticator().check(totpCode, secret)

  return isValidToken ? "valid" : "invalid_totp_code"
}
