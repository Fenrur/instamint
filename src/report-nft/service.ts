import {PgClient} from "@/db/db-client"
import {ReportNftPgRepository} from "@/report-nft/repository"

export class DefaultReportNftService {
  private readonly pgClient: PgClient
  private readonly reportsPageSize: number
  private readonly reportNftPgRepository: ReportNftPgRepository

  constructor(pgClient: PgClient, reportsPageSize: number) {
    this.reportNftPgRepository = new ReportNftPgRepository(pgClient)
    this.pgClient = pgClient
    this.reportsPageSize = reportsPageSize
  }

  public findAdminReportNftsPaginatedAndSorted(page: number) {
    return this.reportNftPgRepository
      .findAdminReportNftsPaginatedAndSorted(
        this.reportsPageSize * (page - 1),
        this.reportsPageSize
      )
  }
}
