import {PgClient} from "@/db/db-client"
import {count, desc, eq, sql} from "drizzle-orm"
import {CommentTable, HashtagNftTable, MintTable, NftTable, ProfileTable, UserTable} from "@/db/schema"
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
    title: z.string(),
    owner: z.string(),
  }))

  constructor(pqClient: PgClient) {
    this.pgClient = pqClient
  }

  public async exists(nftId: number) {
    const result = await this.pgClient
      .select({count: count()})
      .from(NftTable)
      .where(eq(NftTable.id, nftId))

    return result[0].count > 0
  }

  public async countNftsByProfileId(profileId: number) {
    const result = await this.pgClient
      .select({count: count()})
      .from(NftTable)
      .where(eq(NftTable.showOnProfileId, profileId))

    return result[0].count
  }

  public async getAll() {
    const sqlQuery = sql` SELECT id AS value, title  AS label
                          FROM ${NftTable} `

    return this.pgClient.execute(sqlQuery)
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
    const result = await this.pgClient.select({
      id: NftTable.id,
      title: NftTable.title,
      owner: UserTable.email
    })
      .from(NftTable)
      .leftJoin(UserTable, eq(NftTable.ownerUserId, UserTable.id))
      .orderBy(desc(NftTable.title))
      .offset(offset)
      .limit(limit)

    return this.FindAdminNftsPaginated.parse(result)
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
    const transformedSearchResult = searchResult.map((value) => transformNft(value))
    const countResult = await this.pgClient.execute(countQuery)
    const transformedCountResult = countResult.map((value) => transformNftCount(value))

    return transformedSearchResult.map((value) => {
      const nftCount = transformedCountResult.find((nftCount) => nftCount.id === value.id)

      if (nftCount) {
        return ({
          ...value,
          mintCount: nftCount.mintCount,
          commentCount: nftCount.commentCount
        })
      }

      return {}
    }).filter(item => item)
  }
}

// Function that matches the expected signature
const transformNft = (value: Record<string, unknown>): Nft => {
  // Transform value to match Nft structure
  return {
    id: value.id as number,
    contentUrl: value.contentUrl as string,
    postedAt: new Date(value.postedAt as string),
    type: value.type as string
  }
}
const transformNftCount = (value: Record<string, unknown>): NftCount => {
  // Transform value to match Nft structure
  return {
    id: value.id as number,
    mintCount: value.mintCount as number,
    commentCount: value.commentCount as number
  }
}

interface Nft {
  id: number;
  contentUrl: string;
  postedAt: Date;
  type: string;
}

interface NftCount {
  id: number;
  mintCount: number;
  commentCount: number;
}
