import {PgClient} from "@/db/db-client"
import {ReportProfilePgRepository} from "@/Report-profile/repository"

export class DefaultReportProfileService {
  private readonly reportProfilePgRepository: ReportProfilePgRepository
  private readonly pgClient: PgClient

  constructor(pgClient: PgClient) {
    this.reportProfilePgRepository = new ReportProfilePgRepository(pgClient)
    this.pgClient = pgClient
  }

  public async create(reporterProfileId: number, reportedProfileId: number, reason: string) {
     return  await this.reportProfilePgRepository.create(reporterProfileId, reportedProfileId, reason)
  }
}
