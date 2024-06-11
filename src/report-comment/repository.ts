import {PgClient} from "@/db/db-client"
import {z} from "zod"
import {CommentTable, ProfileTable, ReportCommentTable, UserTable} from "@/db/schema"
import {eq} from "drizzle-orm"

export class ReportCommentPgRepository {
  private readonly pgClient: PgClient
  private readonly FindAdminReportCommentsPaginated = z.array(z.object({
    commentary: z.string(),
    reason: z.string(),
    user: z.string(),
  }))

  constructor(pqClient: PgClient) {
    this.pgClient = pqClient
  }

  public async findAdminReportCommentsPaginatedAndSorted(offset: number, limit: number) {
    const result = await this.pgClient.select({
      commentary: CommentTable.commentary,
      user: UserTable.email,
      reason: ReportCommentTable.reason
    })
      .from(ReportCommentTable)
      .leftJoin(CommentTable, eq(ReportCommentTable.reportedCommentId, CommentTable.id))
      .leftJoin(ProfileTable, eq(CommentTable.profileId, ProfileTable.id))
      .rightJoin(UserTable, eq(UserTable.profileId, ProfileTable.id))
      .offset(offset)
      .limit(limit)

    return this.FindAdminReportCommentsPaginated.parse(result)
  }
}
