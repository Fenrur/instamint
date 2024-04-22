import {db} from "@/db/db-client"
import {hashPassword, isPasswordValid} from "@/utils/password"
import {EmailVerification, Profile, User} from "@/db/schema"
import {symmetricDecrypt, symmetricEncrypt} from "@/utils/crypto"
import {env} from "@/env"
import {authenticator} from "@/two-factor/otp"
import {DateTime, Duration} from "luxon"
import {generateUsername} from "@/utils/username"
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

  return !!result;
}

export function findUserByEmail(email: string) {
  return db.query.User.findFirst({
    where: (user, {eq}) => (eq(user.email, email)),
  })
}

export function findUserByUid(uid: string) {
  return db.query.User.findFirst({
    where: (user, {eq}) => (eq(user.uid, uid)),
  })
}

export function verifyEmailVerification(verificationId: string) {
  return db.update(EmailVerification).set({
    verificationId,
    isVerified: true
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
        eq(emailVerification.email, email),
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
    email,
    createdAt: createAtSql,
    expireAt: expireAtSql,
    isVerified: false
  }).returning({verificationId: EmailVerification.verificationId})

  return result[0].verificationId
}

export async function createUser(email: string, password: string, createdAt: DateTime<true>) {
  const createdAtSql = createdAt.toSQL({includeZone: false, includeOffset: false})
  const username = generateUsername()
  const hashedPassword = await hashPassword(password, env.PEPPER_PASSWORD_SECRET)
  const avatarUrl = `https://api.dicebear.com/8.x/pixel-art/svg?seed=${username}`

  return db.transaction(async (db) => {
    const resultProfile = await db.insert(Profile).values({
      username,
      createdAt: createdAtSql,
      avatarUrl,
      displayName: username,
      link: "https://www.google.com/"
    }).returning({id: Profile.id})
    const profileId = resultProfile[0].id
    const resultUser = await db.insert(User).values({
      email,
      hashedPassword,
      profileId
    }).returning({uid: User.uid})

    return resultUser[0].uid
  })
}

type VerifyUserPasswordResult = "valid" | "invalid" | "email_not_found";

export async function verifyUserPasswordByEmail(email: string, password: string): Promise<VerifyUserPasswordResult> {
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
