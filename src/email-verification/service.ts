import {PgClient} from "@/db/db-client"
import {DateTime, DurationLike} from "luxon"
import {EmailVerificationPgRepository} from "@/email-verification/repository"
import {durationExpireOffset} from "@/services/constants"

export class DefaultEmailVerificationService {
  private readonly emailVerificationRepository: EmailVerificationPgRepository
  private readonly durationExpireOffset: DurationLike

  constructor(pgClient: PgClient, durationExpiredOffset: DurationLike) {
    this.emailVerificationRepository = new EmailVerificationPgRepository(pgClient)
    this.durationExpireOffset = durationExpiredOffset
  }

  public findUnverifiedAndBeforeExpirationByEmail(email: string, dateTime: DateTime<true>) {
    return this.emailVerificationRepository.findUnverifiedAndBeforeExpirationByEmail(email, dateTime)
  }

  public create(email: string, createdAt: DateTime<true>) {
    return this.emailVerificationRepository.create(email, createdAt, createdAt.plus(durationExpireOffset))
  }

  public findByVerificationId(verificationId: string) {
    return this.emailVerificationRepository.findByVerificationId(verificationId)
  }

  public verify(emailVerificationId: string) {
    return this.emailVerificationRepository.verify(emailVerificationId)
  }
}
