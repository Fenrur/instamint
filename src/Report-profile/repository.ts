import {PgClient} from "@/db/db-client"
import {ReportProfileTable} from "@/db/schema"
import {DateTime} from "luxon"

export class ReportProfilePgRepository {
  private readonly pgClient: PgClient

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
}
