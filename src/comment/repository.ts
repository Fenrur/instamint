import {PgClient} from "@/db/db-client"
import {DateTime} from "luxon"
import {CommentTable, UserTable, ProfileTable} from "@/db/schema"
import {and, count, desc, eq, isNull} from "drizzle-orm"
import {z} from "zod"

export class CommentPgRepository {
  private readonly pgClient: PgClient
  private readonly FindAdminCommentsPaginated = z.array(z.object({
    id: z.number().int().positive(),
    commentary: z.string(),
    ownerUsername: z.string(),
    ownerEmail: z.string(),
  }))

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

  public async findComment(profile: number, nftId: number, replyCommentId?: number) {
    if (replyCommentId) {
      const comment = await this.pgClient
        .select()
        .from(CommentTable)
        .where(and(
          eq(CommentTable.nftId, nftId),
          eq(CommentTable.profileId, profile),
          eq(CommentTable.replyCommentId, replyCommentId)
        ))

      if (comment.length > 0) {
        return comment[0]
      }


      return null
    }

    const comment = await this.pgClient
      .select()
      .from(CommentTable)
      .where(and(
        eq(CommentTable.nftId, nftId),
        eq(CommentTable.profileId, profile),
        isNull(CommentTable.replyCommentId)
      ))

    if (comment.length > 0) {
      return comment[0]
    }


    return null
  }

  public async findAdminCommentsPaginatedAndSorted(offset: number, limit: number) {
    const result = await this.pgClient.select({
      id: CommentTable.id,
      commentary: CommentTable.commentary,
      ownerEmail: UserTable.email,
      ownerUsername: ProfileTable.username
    })
      .from(CommentTable)
      .leftJoin(ProfileTable, eq(CommentTable.profileId, ProfileTable.id))
      .rightJoin(UserTable, eq(UserTable.profileId, ProfileTable.id))
      .orderBy(desc(ProfileTable.username))
      .offset(offset)
      .limit(limit)

    return this.FindAdminCommentsPaginated.parse(result)
  }

  public findById(id: string) {
    return this.pgClient.query.CommentTable
      .findFirst({
        where: (comment, {eq}) => (eq(comment.id, Number(id))),
      })
  }

  public async deleteComment(id: number) {
    return this.pgClient
      .delete(CommentTable)
      .where(eq(CommentTable.id, id))
  }
}
