import {PgClient} from "@/db/db-client"
import {FollowTable, ProfileTable, TeaBagTable} from "@/db/schema"
import {sql} from "drizzle-orm"

export class TeaBagPgRepository {
  private readonly pgClient: PgClient

  constructor(pqClient: PgClient) {
    this.pgClient = pqClient
  }


  public async getAllByUId(uid: string, offset: number, limit: number) {
    const sqlQuery = sql`
      SELECT DISTINCT ${ProfileTable.id},
             ${ProfileTable.username},
             ${ProfileTable.link},
             ${ProfileTable.avatarUrl},
             ${ProfileTable.bio},
             COALESCE(followers.count, 0)::int AS followers_count, COALESCE(followed.count, 0)::int  AS followed_count, COALESCE(followed.count, 0) ::int  AS cooks_count
      FROM ${ProfileTable}
             LEFT JOIN (SELECT "followedProfileId",
                               COUNT(*) AS "count"
                        FROM ${FollowTable}
                        GROUP BY "followedProfileId") followed
                       ON ${ProfileTable.id} = followed."followedProfileId"
             LEFT JOIN (SELECT "followerProfileId",
                               COUNT(*) AS "count"
                        FROM ${FollowTable}
                        GROUP BY "followerProfileId") followers
                       ON ${ProfileTable.id} = followers."followerProfileId"
      WHERE ${ProfileTable.id} IN (SELECT ${TeaBagTable.profileId} FROM ${TeaBagTable})`
    sqlQuery.append(sql`
      OFFSET
      ${offset}
      LIMIT
      ${limit}
    `)

    return this.pgClient.execute(sqlQuery)
  }

  public async getByProfileId(profileId: string) {
    const sqlQuery = sql`
      SELECT ${ProfileTable.id},
             ${ProfileTable.username},
             ${ProfileTable.link},
             ${ProfileTable.bio},
      FROM ${ProfileTable}
      WHERE ${ProfileTable.id} = ${profileId}`

    return this.pgClient.execute(sqlQuery)
  }

  public async create(profileId: number) {
    const createdTeaBag = await this.pgClient
      .insert(TeaBagTable)
      .values({
        profileId,
      })
      .returning({id: TeaBagTable.id})

    return createdTeaBag[0]
  }
}
