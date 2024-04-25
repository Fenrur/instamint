import {PgClient} from "@/db/db-client"
import {DateTime} from "luxon"
import {EmailVerificationPgRepository} from "@/email-verification/repository"

export class DefaultEmailVerificationService {
  private readonly emailVerificationRepository: EmailVerificationPgRepository

  constructor(pgClient: PgClient) {
    this.emailVerificationRepository = new EmailVerificationPgRepository(pgClient)
  }

  public findUnverifiedAndBeforeExpirationByEmail(email: string, dateTime: DateTime<true>) {
    return this.emailVerificationRepository.findUnverifiedAndBeforeExpirationByEmail(email, dateTime)
  }

  public create(email: string, createdAt: DateTime<true>) {
    return this.emailVerificationRepository.create(email, createdAt)
  }

  public findByVerificationId(verificationId: string) {
    return this.emailVerificationRepository.findByVerificationId(verificationId)
  }

  public verify(emailVerificationId: string) {
    return this.emailVerificationRepository.verify(emailVerificationId)
  }
}
