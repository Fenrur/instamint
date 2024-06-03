import {PgClient} from "@/db/db-client"
import {CommentTable, MintTable, NftTable} from "@/db/schema"
import {count, desc, eq, sql} from "drizzle-orm"
import {z} from "zod"
import {nftTypeArray} from "@/domain/types"
import {datetimeSql} from "@/utils/zod"

export class NftPgRepository {
  private readonly pgClient: PgClient
  private readonly FindNftsPaginatedByProfileIdWithMintCountCommentCountSchema = z.array(z.object({
    id: z.number().int().positive(),
    contentUrl: z.string(),
    postedAt: datetimeSql(),
    showOnProfileId: z.number().int().positive(),
    commentCount: z
      .string()
      .transform(str => parseInt(str, 10))
      .refine((num) => !isNaN(num) && Number.isInteger(num), {message: "commentCount must be an integer"}),
    mintCount: z
      .string()
      .transform(str => parseInt(str, 10))
      .refine((num) => !isNaN(num) && Number.isInteger(num), {message: "mintCount must be an integer"}),
    type: z.enum(nftTypeArray)
  }))
  private readonly FindAdminNftsPaginated = z.array(z.object({
    id: z.number().int().positive(),
    title: z.string()
  }))

  constructor(pqClient: PgClient) {
    this.pgClient = pqClient
  }

  public async countNftsByProfileId(profileId: number) {
    const result = await this.pgClient
      .select({count: count()})
      .from(NftTable)
      .where(eq(NftTable.showOnProfileId, profileId))

    return result[0].count
  }

  public async findNftsPaginatedAndSorted(profileId: number, offset: number, limit: number) {
    const query = sql`
      SELECT ${NftTable.id},
             ${NftTable.contentUrl},
             ${NftTable.postedAt},
             ${NftTable.showOnProfileId},
             ${NftTable.type},
             COALESCE(m."mintCount", 0)    AS "mintCount",
             COALESCE(c."commentCount", 0) AS "commentCount"
      FROM ${NftTable}
             LEFT JOIN (SELECT ${MintTable.nftId}, COUNT(*) AS "mintCount"
                        FROM ${MintTable}
                        GROUP BY ${MintTable.nftId}) m ON ${NftTable.id} = m."nftId"

             LEFT JOIN (SELECT ${CommentTable.nftId}, COUNT(*) AS "commentCount"
                        FROM ${CommentTable}
                        GROUP BY ${CommentTable.nftId}) c ON ${NftTable.id} = c."nftId"

      WHERE ${NftTable.showOnProfileId} = ${profileId}
      ORDER BY ${NftTable.postedAt} DESC
      OFFSET ${offset} LIMIT ${limit}
    `
    const result = await this.pgClient.execute(query)

    return this.FindNftsPaginatedByProfileIdWithMintCountCommentCountSchema.parse(result)
  }

  public async findAdminNftsPaginatedAndSorted(offset: number, limit: number) {
    return this.pgClient.query
      .NftTable
      .findMany({
        columns: {
          id: true,
          title: true,
        },
        offset,
        limit,
        orderBy: desc(NftTable.title)
      })
  }

  public async deleteNft(id: number) {
    return this.pgClient
      .delete(NftTable)
      .where(eq(NftTable.id, id))
  }

  public findById(id: string) {
    return this.pgClient.query.NftTable
      .findFirst({
        where: (nft, {eq}) => (eq(nft.id, Number(id))),
      })
  }
}
