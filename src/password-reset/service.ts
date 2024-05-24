import {PgClient} from "@/db/db-client"
import {DateTime} from "luxon"
import {PasswordResetPgRepository} from "@/password-reset/repository"

export class DefaultPasswordResetService {
  private readonly passwordResetPgRepository: PasswordResetPgRepository

  constructor(pgClient: PgClient) {
    this.passwordResetPgRepository = new PasswordResetPgRepository(pgClient)
  }

  public create(userId: number, createdAt: DateTime<true>) {
    return this.passwordResetPgRepository.create(userId, createdAt)
  }

  public findByResetId(resetId: string) {
    return this.passwordResetPgRepository.findByResetId(resetId)
  }

  public deactivateResetById(resetId: number) {
    return this.passwordResetPgRepository.deactivateResetById(resetId)
  }
}
