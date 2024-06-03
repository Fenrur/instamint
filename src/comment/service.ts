import {CommentPgRepository} from "@/comment/repository"
import {DateTime} from "luxon"
import {PgClient} from "@/db/db-client"
import {sql} from "drizzle-orm";

export class DefaultCommentService {
  private readonly commentRepository: CommentPgRepository
  private readonly pgClient: PgClient
  private readonly commentNftSize: number

  constructor(pgClient: PgClient, commentNftSize: number) {
    this.commentRepository = new CommentPgRepository(pgClient)
    this.pgClient = pgClient
    this.commentNftSize = commentNftSize
  }

  public async create(nftId: number, profileId: number, commentedAt: DateTime<true>, commentary: string, replyCommentId?: number) {
    return this.commentRepository.create(nftId, profileId, commentedAt, commentary, replyCommentId)
  }

  public async modify(commentId: number, commentary: string) {
    return this.commentRepository.modify(commentId, commentary)
  }

  public async delete(commentId: number) {
    return this.commentRepository.delete(commentId)
  }

  public async findReplyCommentsPaginatedAndSorted(replyCommentId: number, profileId: number, page: number) {
    const offset = (page - 1) * this.commentNftSize
    const limit = this.commentNftSize
    const query = sql`
      SELECT c."id"                                                        AS "commentId",
             c."commentary"                                                AS "commentary",
             c."commentedAt"                                               AS "commentedAt",
             COALESCE(mc."mintCommentCount", 0)                            AS "mintCommentCount",
             p."username"                                                  AS "commenterUsername",
             p."avatarUrl"                                                 AS "commenterAvatarUrl",
             COALESCE(rc."replyCount", 0)                                  AS "replyCount",
             CASE WHEN ml."profileId" IS NOT NULL THEN TRUE ELSE FALSE END AS "minted"
      FROM "Comment" c
             LEFT JOIN
           LATERAL (SELECT COUNT(*) AS "mintCommentCount"
                    FROM "MintComment"
                    WHERE "commentId" = c."id") mc
           ON true
             INNER JOIN
           "Profile" p
           ON
             c."profileId" = p."id"
             LEFT JOIN
           LATERAL (SELECT COUNT(*) AS "replyCount"
                    FROM "Comment"
                    WHERE "replyCommentId" = c."id") rc
           ON true
             LEFT JOIN
           "MintComment" ml
           ON
             c."id" = ml."commentId" AND ml."profileId" = ${profileId}
      WHERE c."replyCommentId" = ${replyCommentId}
      ORDER BY c."commentedAt"
      LIMIT ${limit} OFFSET ${offset};
    `

    return mapCommentsPaginatedAndSorted(await this.pgClient.execute(query))
  }

  public async findCommentsPaginatedAndSorted(nftId: number, profileId: number, page: number) {
    const offset = (page - 1) * this.commentNftSize
    const limit = this.commentNftSize
    const query = sql`
      SELECT c."id"                                                        AS "commentId",
             c."commentary"                                                AS "commentary",
             c."commentedAt"                                               AS "commentedAt",
             COALESCE(mc."mintCommentCount", 0)                            AS "mintCommentCount",
             p."username"                                                  AS "commenterUsername",
             p."avatarUrl"                                                 AS "commenterAvatarUrl",
             COALESCE(rc."replyCount", 0)                                  AS "replyCount",
             CASE WHEN ml."profileId" IS NOT NULL THEN TRUE ELSE FALSE END AS "minted"
      FROM "Comment" c
             LEFT JOIN
           LATERAL (SELECT COUNT(*) AS "mintCommentCount"
                    FROM "MintComment"
                    WHERE "commentId" = c.id) mc ON true
             INNER JOIN
           "Profile" p ON c."profileId" = p.id
             LEFT JOIN
           LATERAL (SELECT COUNT(*) AS "replyCount"
                    FROM "Comment"
                    WHERE "replyCommentId" = c.id) rc ON true
             LEFT JOIN
           LATERAL (SELECT "profileId"
                    FROM "MintComment"
                    WHERE "commentId" = c.id
                      AND "profileId" = ${profileId} ) ml ON true
      WHERE c."replyCommentId" IS NULL
        AND c."nftId" = ${nftId}
      ORDER BY mc."mintCommentCount" DESC, c."commentedAt" DESC
      LIMIT ${limit} OFFSET ${offset};
    `

    return mapCommentsPaginatedAndSorted(await this.pgClient.execute(query))
  }
}


function mapCommentsPaginatedAndSorted(response: unknown) {
  const mappedResponse = response as {
    commentId: number,
    commentary: string,
    commentedAt: string,
    commenterAvatarUrl: string,
    commenterUsername: string,
    mintCommentCount: string,
    replyCount: string,
    minted: boolean
  }[]

  return mappedResponse.map(value => {
    return {
      commentId: value.commentId,
      commentary: value.commentary,
      commentedAt: DateTime.fromSQL(value.commentedAt, {zone: "UTC"}) as DateTime<true>,
      commenterAvatarUrl: value.commenterAvatarUrl,
      commenterUsername: value.commenterUsername,
      mintCommentCount: Number(value.mintCommentCount),
      replyCount: Number(value.replyCount),
      minted: value.minted
    }
  })
}
