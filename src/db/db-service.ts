import {db} from "@/db/db-client"
import {hashPassword, isPasswordValid} from "@/utils/password"
import {user} from "@/db/schema"
import {UUID} from "crypto"
import {symmetricDecrypt, symmetricEncrypt} from "@/utils/crypto"
import {env} from "@/env"
import {authenticator} from "@/two-factor/otp"

export function findUserByEmail(email: string) {
  return db.query.user.findFirst({
    where: (user, { eq }) => (eq(user.email, email)),
  })
}

export function findUserByUid(uid: string) {
  return db.query.user.findFirst({
    where: (user, { eq }) => (eq(user.uid, uid)),
  })
}

export async function createUser(uid: UUID, email: string, password: string) {
  const hashedPassword = await hashPassword(password)
  return db.insert(user).values({email, hashedPassword, uid})
}

type VerifyUserPasswordResult = "valid" | "invalid" | "email_not_found";

export async function verifyUserPasswordByEmail(email: string, password: string): Promise<VerifyUserPasswordResult> {
  const user = await findUserByEmail(email)
  if (!user) {
    return "email_not_found"
  }

  if (await isPasswordValid(password, user.hashedPassword)) {
    return "valid"
  } else {
    return "invalid"
  }
}

export async function verifyUserPasswordByUid(uid: string, password: string) {
  const user = await findUserByUid(uid)
  if (!user) {
    return "uid_not_found"
  }

  if (await isPasswordValid(password, user.hashedPassword)) {
    return "valid"
  } else {
    return "invalid"
  }
}

export async function resetTwoFactorAuthentification(id: number) {
  return db.update(user).set({
    id,
    twoFactorEnabled: false,
    twoFactorSecret: null
  })
}

export async function enableTwoFactorAuthentification(uid: string) {
  return db.update(user).set({
    uid,
    twoFactorEnabled: true
  })
}

export async function disableTwoFactorAuthentification(uid: string) {
  return db.update(user).set({
    uid,
    twoFactorEnabled: false
  })
}

export async function setTwoFactorSecret(uid: string, secret: string) {
  return db.update(user).set({
    uid,
    twoFactorSecret: symmetricEncrypt(secret, env.TOTP_ENCRYPTION_KEY)
  })
}

export async function setupTwoFactorAuthentification(uid: string, password: string, secret: string) {
  const user = await findUserByUid(uid)
  if (!user) {
    return "uid_not_found"
  }

  if (user.twoFactorSecret) {
    return "two_factor_already_enabled"
  }

  if (!await isPasswordValid(password, user.hashedPassword)) {
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

  if (!await isPasswordValid(password, user.hashedPassword)) {
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

  if (!await isPasswordValid(password, user.hashedPassword)) {
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
