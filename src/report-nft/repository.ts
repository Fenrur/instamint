import {PgClient} from "@/db/db-client"
import {z} from "zod"
import {ReportNftTable, UserTable, NftTable} from "@/db/schema"
import {eq} from "drizzle-orm"

export class ReportNftPgRepository {
  private readonly pgClient: PgClient
  private readonly FindAdminReportNftsPaginated = z.array(z.object({
    title: z.string(),
    reason: z.string(),
    user: z.string(),
  }))

  constructor(pqClient: PgClient) {
    this.pgClient = pqClient
  }

  public async findAdminReportNftsPaginatedAndSorted(offset: number, limit: number) {
    const result = await this.pgClient.select({
      title: NftTable.title,
      user: UserTable.email,
      reason: ReportNftTable.reason
    })
      .from(ReportNftTable)
      .leftJoin(NftTable, eq(ReportNftTable.reportedNftId, NftTable.id))
      .leftJoin(UserTable, eq(NftTable.ownerUserId, UserTable.id))
      .offset(offset)
      .limit(limit)

    return this.FindAdminReportNftsPaginated.parse(result)
  }
}
