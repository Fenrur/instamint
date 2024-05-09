import {PgClient} from "@/db/db-client"
import {DateTime} from "luxon"
import {PasswordResetPgRepository} from "@/password-reset/repository";

export class DefaultPasswordResetService {
  private readonly passwordResetPgRepository: PasswordResetPgRepository

  constructor(pgClient: PgClient) {
    this.passwordResetPgRepository = new PasswordResetPgRepository(pgClient)
  }

  public findUnverifiedAndBeforeExpirationByEmail(email: string, dateTime: DateTime<true>) {
    return this.passwordResetPgRepository.findUnverifiedAndBeforeExpirationByEmail(email, dateTime)
  }

  public create(email: string, createdAt: DateTime<true>) {
    return this.passwordResetPgRepository.create(email, createdAt)
  }

  public findByResetId(resetId: string) {
    return this.passwordResetPgRepository.findByResetId(resetId)
  }

  public verify(emailVerificationId: string) {
    return this.passwordResetPgRepository.verify(emailVerificationId)
  }
}
