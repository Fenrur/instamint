import {DateTime} from "luxon"
import {hashPassword, isPasswordValid} from "@/utils/password"
import {ProfilePgRepository} from "@/profile/repository"
import {UserPgRepository} from "@/user/repository"
import {EmailVerificationPgRepository} from "@/email-verification/repository"
import {PgClient} from "@/db/db-client"
import {symmetricDecrypt} from "@/utils/crypto"
import {authenticator} from "@/two-factor/otp"

type CreateUserResult =
  "email_verification_not_found"
  | "email_verification_already_verified"
  | "email_verification_expired"
  | "email_already_used"
  | "username_already_used"
  | {uid: string, email: string}

export class DefaultUserService {
  private readonly pgClient: PgClient
  private readonly pepperPasswordSecret: string
  private readonly totpEncryptionKey: string

  constructor(pgClient: PgClient, pepperPasswordSecret: string, totpEncryptionKey: string) {
    this.pgClient = pgClient
    this.pepperPasswordSecret = pepperPasswordSecret
    this.totpEncryptionKey = totpEncryptionKey
  }

  private userPgRepository() {
    return new UserPgRepository(this.pgClient)
  }

  public findByEmail(email: string) {
    return this.userPgRepository().findByEmail(email)
  }

  public findByUid(uid: string) {
    return this.userPgRepository().findByUid(uid)
  }

  public existUsername(username: string) {
    return this.userPgRepository().existUsername(username)
  }

  public resetTwoFactorAuthentification(id: number) {
    return this.userPgRepository().resetTwoFactorAuthentification(id)
  }

  public enableTwoFactorAuthentification(uid: string) {
    return this.userPgRepository().enableTwoFactorAuthentification(uid)
  }

  public disableTwoFactorAuthentification(uid: string) {
    return this.userPgRepository().disableTwoFactorAuthentification(uid)
  }

  public setTwoFactorSecret(uid: string, secret: string) {
    return this.userPgRepository().setTwoFactorSecret(uid, secret)
  }

  public async setupTwoFactorAuthentification(uid: string, password: string, secret: string) {
    const user = await this.findByUid(uid)

    if (!user) {
      return "uid_not_found"
    }

    if (user.twoFactorSecret) {
      return "two_factor_already_enabled"
    }

    if (!await isPasswordValid(password, user.hashedPassword, this.pepperPasswordSecret)) {
      return "invalid_password"
    }

    await this.setTwoFactorSecret(uid, secret)

    return "setup_complete"
  }

  public async verifyPasswordAndTotpCodeByUid(uid: string, password: string, totpCode: string) {
    const user = await this.findByUid(uid)

    if (!user) {
      return "uid_not_found"
    }

    if (!await isPasswordValid(password, user.hashedPassword, this.pepperPasswordSecret)) {
      return "invalid_password"
    }

    if (!user.twoFactorEnabled) {
      return "two_factor_not_enabled"
    }

    if (!user.twoFactorSecret) {
      return "two_factor_no_secret"
    }

    const secret = symmetricDecrypt(user.twoFactorSecret, this.totpEncryptionKey)
    const isValidToken = authenticator().check(totpCode, secret)

    return isValidToken ? "valid" : "invalid_totp_code"
  }

  public async verifyPasswordAndTotpCodeByEmail(email: string, password: string, totpCode: string) {
    const user = await this.findByEmail(email)

    if (!user) {
      return "email_not_found"
    }

    if (!await isPasswordValid(password, user.hashedPassword, this.pepperPasswordSecret)) {
      return "invalid_password"
    }

    if (!user.twoFactorEnabled) {
      return "two_factor_not_enabled"
    }

    if (!user.twoFactorSecret) {
      return "two_factor_no_secret"
    }

    const secret = symmetricDecrypt(user.twoFactorSecret, this.totpEncryptionKey)
    const isValidToken = authenticator().check(totpCode, secret)

    return isValidToken ? "valid" : "invalid_totp_code"
  }

  public async create(password: string, username: string, emailVerificationId: string, createdAt: DateTime<true>): Promise<CreateUserResult> {
    const hashedPassword = await hashPassword(password, this.pepperPasswordSecret)
    const avatarUrl = encodeURI(`https://api.dicebear.com/8.x/pixel-art/svg?seed=${username}`)
    const emailVerification = await new EmailVerificationPgRepository(this.pgClient).findByVerificationId(emailVerificationId)

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

    const user = await this.userPgRepository().findByEmail(email)

    if (user) {
      return "email_already_used"
    }

    if (await this.userPgRepository().existUsername(username)) {
      return "username_already_used"
    }

    const uid = await this.pgClient.transaction(async (tx) => {
      const emailVerificationRepository = new EmailVerificationPgRepository(tx)
      const profilePgRepository = new ProfilePgRepository(tx)
      const userPgRepository = new UserPgRepository(tx)

      await emailVerificationRepository.verify(emailVerificationId)

      const createdProfile = await profilePgRepository.create(username, createdAt, avatarUrl)
      const profileId = createdProfile.id
      const createdUser = await userPgRepository.create(email, hashedPassword, profileId)
      const {uid} = createdUser

      return uid
    })

    return {uid, email}
  }

  public async verifyPasswordByEmail(email: string, password: string) {
    const user = await this.findByEmail(email)

    if (!user) {
      return "email_not_found"
    }

    if (await isPasswordValid(password, user.hashedPassword, this.pepperPasswordSecret)) {
      return "valid"
    }

    return "invalid"
  }

  public async verifyUserPasswordByUid(uid: string, password: string) {
    const user = await this.findByUid(uid)

    if (!user) {
      return "uid_not_found"
    }

    if (await isPasswordValid(password, user.hashedPassword, this.pepperPasswordSecret)) {
      return "valid"
    }

    return "invalid"
  }
}