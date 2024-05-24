import {PgClient} from "@/db/db-client"
import {DateTime} from "luxon"
import {FollowTable} from "@/db/schema"
import {and, count, eq} from "drizzle-orm"

export class FollowPgRepository {
  private readonly pgClient: PgClient

  constructor(pgClient: PgClient) {
    this.pgClient = pgClient
  }

  public create(followerProfileId: number, followedProfileId: number, followAt: DateTime<true>) {
    return this.pgClient
      .insert(FollowTable)
      .values({
        followerProfileId,
        followedProfileId,
        followAt: followAt.toSQL({includeZone: false, includeOffset: false})
      })
  }

  public delete(followerProfileId: number, followedProfileId: number) {
    return this.pgClient
      .delete(FollowTable)
      .where(
        and(
          eq(FollowTable.followerProfileId, followerProfileId),
          eq(FollowTable.followedProfileId, followedProfileId)
        )
      )
  }

  public async get(followerProfileId: number, followedProfileId: number) {
    const result = await this.pgClient.query
      .FollowTable
      .findFirst({
        where: (follow, {eq, and}) => and(
          eq(follow.followerProfileId, followerProfileId),
          eq(follow.followedProfileId, followedProfileId)
        )
      })

    if (result) {
      return {
        ...result,
        followAt: DateTime.fromSQL(result.followAt, {zone: "UTC"}) as DateTime<true>
      }
    }


    return result
  }

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

  public async findFollowsPaginatedAndSorted(profileId: number, offset: number, limit: number) {
    const result = await this.pgClient.query
      .FollowTable
      .findMany({
        where: (follow, {eq}) => eq(follow.followerProfileId, profileId),
        columns: {
          followAt: true
        },
        with: {
          followed: {
            columns: {
              username: true,
              avatarUrl: true,
              displayName: true,
            }
          },
        },
        orderBy: (follow, {desc}) => desc(follow.followAt),
        offset,
        limit,
      })

    return result
      .map(value => {
        return {
          followAt: DateTime.fromSQL(value.followAt, {zone: "UTC"}) as DateTime<true>,
          profile: {
            ...value.followed
          }
        }
      })
  }

  public async findFollowersPaginatedAndSorted(profileId: number, offset: number, limit: number) {
    const result = await this.pgClient.query
      .FollowTable
      .findMany({
        where: (follow, {eq}) => eq(follow.followedProfileId, profileId),
        columns: {
          followAt: true
        },
        with: {
          follower: {
            columns: {
              username: true,
              avatarUrl: true,
              displayName: true,
            },
          },
        },
        orderBy: (follow, {desc}) => desc(follow.followAt),
        offset,
        limit,
      })

    return result
      .map(value => {
        return {
          followAt: DateTime.fromSQL(value.followAt, {zone: "UTC"}) as DateTime<true>,
          profile: {
            ...value.follower
          }
        }
      })
  }
}
