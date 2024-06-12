import {PgClient} from "@/db/db-client"
import {ReportCommentPgRepository} from "@/report-comment/repository"

export class DefaultReportCommentService {
  private readonly pgClient: PgClient
  private readonly reportsPageSize: number
  private readonly reportCommentPgRepository: ReportCommentPgRepository

  constructor(pgClient: PgClient, reportsPageSize: number) {
    this.reportCommentPgRepository = new ReportCommentPgRepository(pgClient)
    this.pgClient = pgClient
    this.reportsPageSize = reportsPageSize
  }

  public findAdminReportCommentsPaginatedAndSorted(page: number) {
    return this.reportCommentPgRepository
      .findAdminReportCommentsPaginatedAndSorted(
        this.reportsPageSize * (page - 1),
        this.reportsPageSize
      )
  }
}
