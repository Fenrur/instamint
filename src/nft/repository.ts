import {PgClient} from "@/db/db-client"
import {CommentTable, HashtagNftTable, MintTable, NftTable, ProfileTable, TeaBagTable, UserTable} from "@/db/schema"
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

  public async findNftsPaginatedByUsernameOrHashtagOrDescriptionOrLocationOrPriceRange(query:string, location:string, minPrice:string, maxPrice:string, offset: number, limit: number) {

    const sqlQuery = sql`
      SELECT ${NftTable.id},
             ${NftTable.contentUrl},
             ${NftTable.postedAt},
             ${NftTable.showOnProfileId},
             ${NftTable.type}
      FROM ${NftTable}
      WHERE 1=1
    `;

    if (query.startsWith('#')) {
      sqlQuery.append(sql` AND ${NftTable.id} IN
        (SELECT  ${NftTable.id} FROM ${NftTable} JOIN ${HashtagNftTable} hn
        ON ${NftTable.id} = hn."nftId"
        WHERE  hn.hashtag ILike '%' || ${query} || '%')
      `);
    }else if (query.startsWith('@')) {
      sqlQuery.append(sql` AND ${NftTable.ownerUserId} IN
        ( SELECT ${UserTable.id} FROM ${UserTable} JOIN ${ProfileTable} p ON ${UserTable.profileId} = p.id
        WHERE p.username  ILike '%' || ${query.substring(1)} || '%')
      `);
    }else if(query){
      sqlQuery.append(sql` AND ${NftTable.description} ILIKE '%' || ${query} || '%'`);
    }

    if (location) {
      sqlQuery.append(sql` AND ${NftTable.location} ILike '%' || ${location} || '%'`);
    }

    if (minPrice && maxPrice) {
      sqlQuery.append(sql` AND ${NftTable.price} BETWEEN  ${Number.parseInt(minPrice)} AND ${Number.parseInt(maxPrice)}`);
    }

    sqlQuery.append(sql`
      ORDER BY
      ${NftTable.postedAt}
      DESC OFFSET ${offset} LIMIT ${limit}
    `);

    const result = await this.pgClient.execute(sqlQuery);

    return result;
  }

  public async findUsersOrTeaPaginatedByUsernameOrLocation(username:string, location:string, offset: number, limit: number) {

    const sqlQuery = sql`
              SELECT ${ProfileTable.id},
                     ${ProfileTable.username},
                     ${ProfileTable.createdAt},
                     ${ProfileTable.bio},
                     ${ProfileTable.link},
                     ${ProfileTable.avatarUrl},
                     ${ProfileTable.canBeSearched},
                     ${ProfileTable.visibilityType},
                     ${ProfileTable.location},
                     ${ProfileTable.displayName}
              FROM ${ProfileTable} WHERE 1=1 `;

    // Add search criteria dynamically based on provided parameters
    if (username) {
      sqlQuery.append(sql` WHERE ${ProfileTable.username} ILIKE '%' || ${username} || '%'`);
    }

    if (location) {
      sqlQuery.append(sql` AND ${ProfileTable.location} ILIKE '%' || ${location} || '%'`);
    }

    sqlQuery.append(sql` ORDER BY ${ProfileTable.createdAt} DESC OFFSET ${offset} LIMIT ${limit}`);

    const result = await this.pgClient.execute(sqlQuery);
    return result;
  }
}
