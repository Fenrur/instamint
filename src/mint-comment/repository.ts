import {PgClient} from "@/db/db-client"
import {DateTime} from "luxon"
import {MintCommentTable} from "@/db/schema"
import {and, count, eq} from "drizzle-orm"

export class MintCommentPgRepository {
  private readonly pgClient: PgClient

  constructor(pgClient: PgClient) {
    this.pgClient = pgClient
  }

  public create(commentId: number, profileId: number, mintAt: DateTime<true>) {
    return this.pgClient
      .insert(MintCommentTable)
      .values({
        commentId,
        profileId,
        mintAt: mintAt.toSQL({includeZone: false, includeOffset: false})
      })
  }

  public delete(commentId: number, profileId: number) {
    return this.pgClient
      .delete(MintCommentTable)
      .where(and(
        eq(MintCommentTable.commentId, commentId),
        eq(MintCommentTable.profileId, profileId)
      ))
  }

  public async get(commentId: number, profileId: number) {
    const result = await this.pgClient
      .select()
      .from(MintCommentTable)
      .where(and(
        eq(MintCommentTable.commentId, commentId),
        eq(MintCommentTable.profileId, profileId)
      ))

    if (!result) {
      return null
    }

    if (result.length === 0) {
      return null
    }

    return result[0]
  }

  public async countMints(commentId: number) {
    const result = await this.pgClient
      .select({count: count()})
      .from(MintCommentTable)
      .where(eq(MintCommentTable.commentId, commentId))

    return result[0].count
  }
}
