import {PgClient} from "@/db/db-client"
import {DateTime} from "luxon"
import {FollowTable} from "@/db/schema"
import {count, eq} from "drizzle-orm"

export class FollowRepository {
  private readonly pgClient: PgClient

  constructor(pgClient: PgClient) {
    this.pgClient = pgClient
  }

  public follow(followerProfileId: number, followedProfileId: number, followAt: DateTime<true>) {
    return this.pgClient
      .insert(FollowTable)
      .values({
        followerProfileId,
        followedProfileId,
        followAt: followAt.toSQL({includeZone: false, includeOffset: false})
      })
  }

  // public unfollow(followerProfileId: number, followedProfileId: number) {
  //   return this.pgClient
  //     .delete(FollowTable)
  //     .where({
  //       followerProfileId,
  //       followedProfileId
  //     })
  // }

  public async countFollowers(profileId: number) {
    const result = await this.pgClient
      .select({count: count()})
      .from(FollowTable)
      .where(eq(FollowTable.followedProfileId, profileId))

    return result[0].count
  }

  public async countFollows(profileId: number) {
    const result = await this.pgClient
      .select({count: count()})
      .from(FollowTable)
      .where(eq(FollowTable.followerProfileId, profileId))

    return result[0].count
  }
}
