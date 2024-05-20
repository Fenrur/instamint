import {PgClient} from "@/db/db-client"
import {CommentTable, HashtagNftTable, MintTable, NftTable, ProfileTable, UserTable} from "@/db/schema"
import {count, eq, sql} from "drizzle-orm"
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

  public async findNftsPaginatedByProfileIdWithMintCountAndCommentCount(profileId: number, offset: number, limit: number) {
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

  public async findNftsPaginatedByUsernameOrHashtagOrDescriptionOrLocationOrPriceRange(
    query: string, location: string, minPrice: string, maxPrice: string, offset: number, limit: number
  ) {
    const searchQuery = sql`
      SELECT ${NftTable.id},
             ${NftTable.contentUrl},
             ${NftTable.postedAt},
             ${NftTable.showOnProfileId},
             ${NftTable.type}
      FROM ${NftTable}
      WHERE 1 = 1
    `

    if (query.startsWith("#")) {
      searchQuery.append(sql` AND
      ${NftTable.id}
      IN
      (
      SELECT
      ${NftTable.id}
      FROM
      ${NftTable}
      JOIN
      ${HashtagNftTable}
      hn
      ON
      ${NftTable.id}
      =
      hn
      .
      "nftId"
      WHERE
      hn
      .
      hashtag
      ILIKE
      '%'
      ||
      ${query}
      ||
      '%'
      )`)
    } else if (query.startsWith("@")) {
      searchQuery.append(sql` AND
      ${NftTable.ownerUserId}
      IN
      (
      SELECT
      ${UserTable.id}
      FROM
      ${UserTable}
      JOIN
      ${ProfileTable}
      p
      ON
      ${UserTable.profileId}
      =
      p
      .
      id
      WHERE
      p
      .
      username
      ILIKE
      '%'
      ||
      ${query.substring(1)}
      ||
      '%'
      )`)
    } else if (query) {
      searchQuery.append(sql` AND
      ${NftTable.description}
      ILIKE
      '%'
      ||
      ${query}
      ||
      '%'`)
    }

    if (location) {
      searchQuery.append(sql` AND
      ${NftTable.location}
      ILIKE
      '%'
      ||
      ${location}
      ||
      '%'`)
    }

    if (minPrice && maxPrice) {
      searchQuery.append(sql` AND
      ${NftTable.price}
      BETWEEN
      ${Number.parseInt(minPrice, 10)}
      AND
      ${Number.parseInt(maxPrice, 10)}`)
    }

    searchQuery.append(sql`
      ORDER BY
      ${NftTable.postedAt}
      DESC
      OFFSET
      ${offset}
      LIMIT
      ${limit}
    `)

    const countQuery = sql`
      SELECT ${NftTable.id},
             COALESCE(m."mintCount", 0)    AS "mintCount",
             COALESCE(c."commentCount", 0) AS "commentCount"
      FROM ${NftTable}
             LEFT JOIN (SELECT ${MintTable.nftId}, COUNT(*) AS "mintCount"
                        FROM ${MintTable}
                        GROUP BY ${MintTable.nftId}) m ON ${NftTable.id} = m."nftId"

             LEFT JOIN (SELECT ${CommentTable.nftId}, COUNT(*) AS "commentCount"
                        FROM ${CommentTable}
                        GROUP BY ${CommentTable.nftId}) c ON ${NftTable.id} = c."nftId"
    `
    const searchResult = await this.pgClient.execute(searchQuery)
    const searchMap: Record<number, Nft> = {}
    searchResult.forEach((row) => {
      searchMap[row.id as number] = {
        id: row.id as number,
        contentUrl: row.contentUrl as string,
        type: row.type as string,
        postedAt: row.postedAt as Date,
        showOnProfileId: row.showOnProfileId as string,
      }
    })


    const countResult = await this.pgClient.execute(countQuery)
    const countsMap: Record<number, NftCount> = {}

    countResult.forEach((row) => {
      countsMap[row.id as number] = {
        id: row.id as number,
        mintCount: row.mintCount as number,
        commentCount: row.commentCount as number,
      }
    })

    const finalResult: NftWithCounts[] = searchResult.map(nft => ({
      id: searchResult[nft.id as number]?.id as number,
      contentUrl: searchResult[nft.id as number]?.contentUrl as string,
      type: searchResult[nft.id as number]?.type as string,
      mintCount: countsMap[nft.id as number]?.mintCount || 0,
      commentCount: countsMap[nft.id as number]?.commentCount || 0,
    } as NftWithCounts))

    return finalResult
  }
}

interface Nft {
  id: number;
  contentUrl: string;
  postedAt: Date;
  showOnProfileId: string;
  type: string;
}

interface NftCount {
  id: number;
  mintCount: number;
  commentCount: number;
}

interface NftWithCounts extends Nft {
  mintCount: number;
  commentCount: number;
}
