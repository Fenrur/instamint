import {PgClient} from "@/db/db-client"
import {z} from "zod"
import {ReportProfileTable, UserTable, ProfileTable} from "@/db/schema"
import {eq} from "drizzle-orm"

export class ReportProfilePgRepository {
  private readonly pgClient: PgClient
  private readonly FindAdminReportProfilesPaginated = z.array(z.object({
    username: z.string(),
    reason: z.string(),
    user: z.string(),
  }))

  constructor(pqClient: PgClient) {
    this.pgClient = pqClient
  }

  public async findAdminReportProfilesPaginatedAndSorted(offset: number, limit: number) {
    const result = await this.pgClient.select({
      username: ProfileTable.username,
      user: UserTable.email,
      reason: ReportProfileTable.reason
    })
      .from(ReportProfileTable)
      .leftJoin(ProfileTable, eq(ReportProfileTable.reportedProfileId, ProfileTable.id))
      .rightJoin(UserTable, eq(UserTable.profileId, ProfileTable.id))
      .offset(offset)
      .limit(limit)

    return this.FindAdminReportProfilesPaginated.parse(result)
  }
}
