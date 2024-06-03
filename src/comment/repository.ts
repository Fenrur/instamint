import {PgClient} from "@/db/db-client"
import {DateTime} from "luxon"
import {CommentTable, NftTable} from "@/db/schema"
import {count, eq, sql} from "drizzle-orm"

export class CommentPgRepository {
  private readonly pgClient: PgClient

  constructor(pgClient: PgClient) {
    this.pgClient = pgClient
  }

  public async create(nftId: number, profileId: number, commentedAt: DateTime<true>, commentary: string, replyCommentId?: number) {
    return this.pgClient
      .insert(CommentTable)
      .values({
        nftId,
        profileId,
        commentedAt: commentedAt.toSQL({includeZone: false, includeOffset: false}),
        commentary,
        replyCommentId
      })
  }

  public async modify(commentId: number, commentary: string) {
    return this.pgClient
      .update(CommentTable)
      .set({commentary})
      .where(eq(CommentTable.id, commentId))
  }

  public async delete(commentId: number) {
    return this.pgClient
      .delete(CommentTable)
      .where(eq(CommentTable.id, commentId))
  }

  public async exists(commentId: number) {
    const result = await this.pgClient
      .select({count: count()})
      .from(CommentTable)
      .where(eq(CommentTable.id, commentId))

    return result[0].count > 0
  }
}
