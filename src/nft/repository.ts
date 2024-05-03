import {PgClient} from "@/db/db-client"
import {CommentTable, MintTable, NftTable} from "@/db/schema"
import {count, eq, sql} from "drizzle-orm"
import {z} from "zod"
import {DateTime} from "luxon"
import {nftTypeArray} from "../../app/domain/types"

export class NftPgRepository {
  private readonly pgClient: PgClient
  private readonly FindNftsPaginatedByProfileIdWithMintCountCommentCountSchema = z.array(z.object({
    id: z.number().int().positive(),
    contentUrl: z.string(),
    postedAt: z.string().transform(dateSql => {
      const pAt = DateTime.fromSQL(dateSql, {zone: "utc"})

      if (pAt.isValid) {
        return pAt
      }

      throw new Error("Invalid date")
    }),
    showOnProfileId: z.number().int().positive(),
    commentCount: z
      .string()
      .transform(str => parseInt(str, 10))
      .refine((num) => !isNaN(num) && Number.isInteger(num), { message: "commentCount must be an integer" }),
    mintCount: z
      .string()
      .transform(str => parseInt(str, 10))
      .refine((num) => !isNaN(num) && Number.isInteger(num), { message: "mintCount must be an integer" }),
    type: z.enum(nftTypeArray)
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

  public async findNftsPaginatedByProfileIdWithMintCountAndCommentCount(profileId: number, offset: number, limit: number) {
    const query = sql`
      SELECT ${NftTable.id},
             ${NftTable.contentUrl},
             ${NftTable.postedAt},
             ${NftTable.showOnProfileId},
             ${NftTable.type},
             COALESCE(m."mintCount", 0) AS "mintCount",
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
}
