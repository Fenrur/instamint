import {PgClient} from "@/db/db-client"
import {ReportProfilePgRepository} from "@/report-profile/repository"

export class DefaultReportProfileService {
  private readonly pgClient: PgClient
  private readonly reportsPageSize: number
  private readonly reportProfilePgRepository: ReportProfilePgRepository

  constructor(pgClient: PgClient, reportsPageSize: number) {
    this.reportProfilePgRepository = new ReportProfilePgRepository(pgClient)
    this.pgClient = pgClient
    this.reportsPageSize = reportsPageSize
  }

  public findAdminReportProfilesPaginatedAndSorted(page: number) {
    return this.reportProfilePgRepository
      .findAdminReportProfilesPaginatedAndSorted(
        this.reportsPageSize * (page - 1),
        this.reportsPageSize
      )
  }
}
