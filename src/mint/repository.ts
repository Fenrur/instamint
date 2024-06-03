import {PgClient} from "@/db/db-client"
import {MintTable} from "@/db/schema"
import {and, count, eq} from "drizzle-orm"
import {DateTime} from "luxon"

export class MintPgRepository {
  private readonly pgClient: PgClient

  constructor(pgClient: PgClient) {
    this.pgClient = pgClient
  }

  public create(nftId: number, profileId: number, mintAt: DateTime<true>) {
    return this.pgClient
      .insert(MintTable)
      .values({
        nftId,
        profileId,
        mintAt: mintAt.toSQL({includeZone: false, includeOffset: false})
      })
  }

  public delete(nftId: number, profileId: number) {
    return this.pgClient
      .delete(MintTable)
      .where(and(
        eq(MintTable.nftId, nftId),
        eq(MintTable.profileId, profileId)
      ))
  }

  public async get(nftId: number, profileId: number) {
    const result = await this.pgClient
      .select()
      .from(MintTable)
      .where(and(
        eq(MintTable.nftId, nftId),
        eq(MintTable.profileId, profileId)
      ))

    if (!result) {
      return null
    }

    if (result.length === 0) {
      return null
    }

    return result[0]
  }

  public async countMints(nftId: number) {
    const result = await this.pgClient
      .select({count: count()})
      .from(MintTable)
      .where(eq(MintTable.nftId, nftId))

    return result[0].count
  }
}
