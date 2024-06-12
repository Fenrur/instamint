import {PgClient} from "@/db/db-client"
import {z} from "zod"
import {ReportProfileTable, UserTable, ProfileTable} from "@/db/schema"
import {eq} from "drizzle-orm"
import {DateTime} from "luxon"

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

  public async create(reporterProfileId: number, reportedProfileId: number, reason: string) {
    return await this.pgClient
      .insert(ReportProfileTable)
      .values({
        reporterProfileId,
        reportedProfileId,
        reason,
        reportAt: DateTime.now().toSQL({includeZone: false, includeOffset: false}),
      })
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
