import {FollowPgRepository} from "@/follow/repository"
import {PgClient} from "@/db/db-client"
import {DateTime} from "luxon"
import {RequestFollowPgRepository} from "@/follow/request/repository"
import {ProfilePgRepository} from "@/profile/repository"
import {ProfileTable, RequestFollowTable} from "@/db/schema"
import {and, eq, ilike, sql} from "drizzle-orm"

export type FollowState = "following" | "ignored_request_follow" | "requesting_follow" | "not_following"

export class DefaultFollowService {
  private readonly followPgRepository: FollowPgRepository
  private readonly requestFollowPgRepository: RequestFollowPgRepository
  private readonly profilePgRepository: ProfilePgRepository
  private readonly pgClient: PgClient
  private readonly followersPageSize
  private readonly followsPageSize
  private readonly followRequestPageSize
  private readonly followRequestIgnoredPageSize
  private readonly searchRequesterProfileSize
  private readonly searchFollowsProfileSize
  private readonly searchFollowersProfileSize

  constructor(pgClient: PgClient, followersPageSize: number, followsPageSize: number, followRequestPageSize: number, followRequestIgnoredPageSize: number, searchRequesterProfileSize: number, searchFollowsProfileSize: number, searchFollowersProfileSize: number) {
    this.followPgRepository = new FollowPgRepository(pgClient)
    this.pgClient = pgClient
    this.requestFollowPgRepository = new RequestFollowPgRepository(pgClient)
    this.profilePgRepository = new ProfilePgRepository(pgClient)
    this.followersPageSize = followersPageSize
    this.followsPageSize = followsPageSize
    this.followRequestPageSize = followRequestPageSize
    this.followRequestIgnoredPageSize = followRequestIgnoredPageSize
    this.searchRequesterProfileSize = searchRequesterProfileSize
    this.searchFollowsProfileSize = searchFollowsProfileSize
    this.searchFollowersProfileSize = searchFollowersProfileSize
  }

  public async followOrRequest(followerProfileId: number, followedProfileId: number, followAt: DateTime<true>) {
    if (followedProfileId === followerProfileId) {
      return "cant_follow_yourself"
    }

    const follow = await this.followPgRepository.get(followerProfileId, followedProfileId)

    if (follow) {
      return "already_following"
    }

    const request = await this.requestFollowPgRepository.get(followerProfileId, followedProfileId)

    if (request) {
      return "already_request_follow"
    }

    const followedProfile = await this.profilePgRepository.findById(followedProfileId)

    if (!followedProfile) {
      return "followed_profile_not_found"
    }

    if (followedProfile.visibilityType === "private") {
      await this.requestFollowPgRepository.create(followerProfileId, followedProfileId, followAt, false)

      return "requested_follow"
    }

    await this.followPgRepository.create(followerProfileId, followedProfileId, followAt)


    return "followed"
  }

  public async unfollowOrUnrequest(followerProfileId: number, followedProfileId: number) {
    if (followedProfileId === followerProfileId) {
      return "cant_unfollow_yourself"
    }

    const result = await this.pgClient.transaction(async (tx) => {
      const transactionalFollowRepository = new FollowPgRepository(tx)
      const resultDeleteFollow = await transactionalFollowRepository.delete(followerProfileId, followedProfileId)

      if (resultDeleteFollow.count > 0) {
        return "unfollowed"
      }

      const transactionalRequestFollowRepository = new RequestFollowPgRepository(tx)
      const resultDeleteRequest = await transactionalRequestFollowRepository.delete(followerProfileId, followedProfileId)

      if (resultDeleteRequest.count > 0) {
        return "unrequested_follow"
      }

      return "not_following"
    })

    return result
  }

  public countFollowers(profileId: number) {
    return this.followPgRepository.countFollowers(profileId)
  }

  public countFollows(profileId: number) {
    return this.followPgRepository.countFollows(profileId)
  }

  public async getFollowState(followerProfileId: number, followedProfileId: number): Promise<FollowState> {
    const [follow, request] = await Promise.all([
      this.followPgRepository.get(followerProfileId, followedProfileId),
      this.requestFollowPgRepository.get(followerProfileId, followedProfileId)
    ])

    if (follow) {
      return "following"
    }

    if (request) {
      return request.isIgnored ? "ignored_request_follow" : "requesting_follow"
    }

    return "not_following"
  }

  public async ignoreRequestFollow(requesterProfileId: number, requestedProfileId: number) {
    if (requestedProfileId === requesterProfileId) {
      return "cant_ignore_yourself"
    }

    const result = await this.requestFollowPgRepository.ignore(requesterProfileId, requestedProfileId)

    if (!result) {
      return "not_requesting_follow"
    }

    return result.count > 0 ? "ignored_request_follow" : "not_requesting_follow"
  }

  public async unIgnoreRequestFollow(requesterProfileId: number, requestedProfileId: number) {
    const result = await this.requestFollowPgRepository.unIgnore(requesterProfileId, requestedProfileId)

    if (!result) {
      return "not_requesting_follow"
    }

    return result.count > 0 ? "unignored_request_follow" : "not_requesting_follow"
  }

  public async acceptAllRequestFollows(profileId: number, followAt: DateTime<true>, ignored: boolean) {
    // eslint-disable-next-line no-warning-comments
    //TODO Fix followAtSql cant be passed into queryInsertIntoFollow ????
    // const followAtSql = followAt.toSQL({includeZone: false, includeOffset: false})
    const queryInsertIntoFollow = sql`
      INSERT INTO "Follow" ("followerProfileId", "followedProfileId", "followAt")
      SELECT "requesterProfileId", "requestedProfileId", CURRENT_TIMESTAMP
      FROM "RequestFollow"
      WHERE "requestedProfileId" = ${profileId}
        AND "isIgnored" = ${ignored}
    `
    const queryDeleteRequestFollow = sql`
      DELETE
      FROM "RequestFollow"
      WHERE "requestedProfileId" = ${profileId}
        AND "isIgnored" = ${ignored}
    `

    await this.pgClient.transaction(async (tx) => {
      await tx.execute(queryInsertIntoFollow)
      await tx.execute(queryDeleteRequestFollow)
    })
  }

  public ignoreAllRequestFollows(profileId: number) {
    return this.requestFollowPgRepository.ignoreAll(profileId)
  }

  public async acceptRequestFollow(requesterProfileId: number, requestedProfileId: number, followAt: DateTime<true>) {
    if (requestedProfileId === requesterProfileId) {
      return "cant_accept_yourself"
    }

    try {
      const result = await this.pgClient.transaction(async (tx) => {
        const transactionalRequestFollowRepository = new RequestFollowPgRepository(tx)
        const resultDeletingRequestFollow = await transactionalRequestFollowRepository.delete(
          requesterProfileId,
          requestedProfileId
        )

        if (!resultDeletingRequestFollow || resultDeletingRequestFollow.count === 0) {
          return "not_requesting_follow"
        }

        const transactionalFollowRepository = new FollowPgRepository(tx)
        const resultCreatedFollow = await transactionalFollowRepository.create(
          requesterProfileId,
          requestedProfileId,
          followAt
        )

        if (!resultCreatedFollow || resultCreatedFollow.count === 0) {
          tx.rollback()


          return "already_follow"
        }

        return "accepted_request_follow"
      })

      return result
    } catch (e) {
      return "already_follow"
    }
  }

  public async findFollowersPaginatedAndSorted(expectedProfileId: number, followStateOfProfileId: number, page: number) {
    const offset = (page - 1) * this.followersPageSize
    const query = sql`
      SELECT F."followAt",
             P."username",
             P."displayName",
             P."avatarUrl",
             CASE
               WHEN EXISTS (SELECT 1
                            FROM "Follow" AS F2
                            WHERE F2."followerProfileId" = ${followStateOfProfileId}
                              AND F2."followedProfileId" = F."followerProfileId") THEN 'following'
               WHEN EXISTS (SELECT 1
                            FROM "RequestFollow" AS RF
                            WHERE RF."requesterProfileId" = ${followStateOfProfileId}
                              AND RF."requestedProfileId" = F."followerProfileId") THEN 'requesting_follow'
               ELSE 'not_following'
               END AS "followStateTo",
             CASE
               WHEN EXISTS (SELECT 1
                            FROM "Follow" AS F2
                            WHERE F2."followedProfileId" = ${followStateOfProfileId}
                              AND F2."followerProfileId" = F."followerProfileId") THEN 'following'
               WHEN EXISTS (SELECT 1
                            FROM "RequestFollow" AS RF
                            WHERE RF."requestedProfileId" = ${followStateOfProfileId}
                              AND RF."requesterProfileId" = F."followerProfileId"
                              AND RF."isIgnored" = true) THEN 'ignored_request_follow'
               WHEN EXISTS (SELECT 1
                            FROM "RequestFollow" AS RF
                            WHERE RF."requestedProfileId" = ${followStateOfProfileId}
                              AND RF."requesterProfileId" = F."followerProfileId"
                              AND RF."isIgnored" = false) THEN 'requesting_follow'
               ELSE 'not_following'
               END AS "followStateFrom"
      FROM "Follow" AS F
             JOIN "Profile" AS P ON P.id = F."followerProfileId"
      WHERE F."followedProfileId" = ${expectedProfileId}
      ORDER BY F."followAt" DESC
      OFFSET ${offset} LIMIT ${this.followersPageSize};
    `
    const result = await this.pgClient.execute(query) as {
      followAt: string,
      username: string,
      displayName: string,
      avatarUrl: string,
      followStateTo: "following" | "requesting_follow" | "not_following",
      followStateFrom: "following" | "ignored_request_follow" | "requesting_follow" | "not_following"
    }[]

    return result.map(value => {
      return {
        followAt: DateTime.fromSQL(value.followAt, {zone: "UTC"}) as DateTime<true>,
        profile: {
          username: value.username,
          displayName: value.displayName,
          avatarUrl: value.avatarUrl
        },
        followStateTo: value.followStateTo,
        followStateFrom: value.followStateFrom
      }
    })
  }

  public async findFollowsPaginatedAndSorted(expectedProfileId: number, followStateOfProfileId: number, page: number) {
    const offset = (page - 1) * this.followsPageSize
    const query = sql`
      SELECT F."followAt",
             P."username",
             P."displayName",
             P."avatarUrl",
             CASE
               WHEN EXISTS (SELECT 1
                            FROM "Follow" AS F2
                            WHERE F2."followerProfileId" = ${followStateOfProfileId}
                              AND F2."followedProfileId" = F."followedProfileId") THEN 'following'
               WHEN EXISTS (SELECT 1
                            FROM "RequestFollow" AS RF
                            WHERE RF."requesterProfileId" = ${followStateOfProfileId}
                              AND RF."requestedProfileId" = F."followedProfileId") THEN 'requesting_follow'
               ELSE 'not_following'
               END AS "followStateTo",
             CASE
               WHEN EXISTS (SELECT 1
                            FROM "Follow" AS F2
                            WHERE F2."followedProfileId" = ${followStateOfProfileId}
                              AND F2."followerProfileId" = F."followedProfileId") THEN 'following'
               WHEN EXISTS (SELECT 1
                            FROM "RequestFollow" AS RF
                            WHERE RF."requestedProfileId" = ${followStateOfProfileId}
                              AND RF."requesterProfileId" = F."followedProfileId"
                              AND RF."isIgnored" = true) THEN 'ignored_request_follow'
               WHEN EXISTS (SELECT 1
                            FROM "RequestFollow" AS RF
                            WHERE RF."requestedProfileId" = ${followStateOfProfileId}
                              AND RF."requesterProfileId" = F."followedProfileId"
                              AND RF."isIgnored" = false) THEN 'requesting_follow'
               ELSE 'not_following'
               END AS "followStateFrom"
      FROM "Follow" AS F
             JOIN "Profile" AS P ON P.id = F."followedProfileId"
      WHERE F."followerProfileId" = ${expectedProfileId}
      ORDER BY F."followAt" DESC
      OFFSET ${offset} LIMIT ${this.followsPageSize};
    `
    const result = await this.pgClient.execute(query) as {
      followAt: string,
      username: string,
      displayName: string,
      avatarUrl: string,
      followStateTo: "following" | "requesting_follow" | "not_following",
      followStateFrom: "following" | "ignored_request_follow" | "requesting_follow" | "not_following"
    }[]

    return result.map(value => {
      return {
        followAt: DateTime.fromSQL(value.followAt, {zone: "UTC"}) as DateTime<true>,
        profile: {
          username: value.username,
          displayName: value.displayName,
          avatarUrl: value.avatarUrl
        },
        followStateTo: value.followStateTo,
        followStateFrom: value.followStateFrom
      }
    })
  }

  public findRequestFollowsPaginatedAndSorted(profileId: number, page: number) {
    return this.requestFollowPgRepository.findRequestsPaginatedAndSorted(
      profileId,
      false,
      (page - 1) * this.followRequestPageSize,
      this.followRequestPageSize
    )
  }

  public findIgnoredRequestFollowsPaginatedAndSorted(profileId: number, page: number) {
    return this.requestFollowPgRepository.findRequestsPaginatedAndSorted(
      profileId,
      true,
      (page - 1) * this.followRequestIgnoredPageSize,
      this.followRequestIgnoredPageSize
    )
  }

  public countRequestFollow(profileId: number) {
    return this.requestFollowPgRepository.countRequestFollow(profileId)
  }

  public async searchRequesterProfile(requestedProfileId: number, ignored: boolean, search: string) {
    const result = await this.pgClient
      .select({
        username: ProfileTable.username,
        avatarUrl: ProfileTable.avatarUrl,
        displayName: ProfileTable.displayName,
        isIgnored: RequestFollowTable.isIgnored,
        requestAt: RequestFollowTable.requestAt
      })
      .from(RequestFollowTable).innerJoin(ProfileTable, eq(RequestFollowTable.requesterProfileId, ProfileTable.id))
      .where(and(
        eq(RequestFollowTable.isIgnored, ignored),
        eq(RequestFollowTable.requestedProfileId, requestedProfileId),
        ilike(ProfileTable.username, `%${search}%`),
      ))
      .limit(this.searchRequesterProfileSize)

    return result.map(value => {
      return {
        requestAt: DateTime.fromSQL(value.requestAt, {zone: "UTC"}) as DateTime<true>,
        isIgnored: value.isIgnored,
        profile: {
          username: value.username,
          displayName: value.displayName,
          avatarUrl: value.avatarUrl
        }
      }
    })
  }

  public async searchFollowsProfile(expectedProfileId: number, followStateOfProfileId: number, search: string) {
    const likeSearch = `%${search}%`
    const query = sql`
      SELECT F."followAt",
             P."username",
             P."displayName",
             P."avatarUrl",
             CASE
               WHEN EXISTS (SELECT 1
                            FROM "Follow" AS F2
                            WHERE F2."followerProfileId" = ${followStateOfProfileId}
                              AND F2."followedProfileId" = F."followedProfileId") THEN 'following'
               WHEN EXISTS (SELECT 1
                            FROM "RequestFollow" AS RF
                            WHERE RF."requesterProfileId" = ${followStateOfProfileId}
                              AND RF."requestedProfileId" = F."followedProfileId") THEN 'requesting_follow'
               ELSE 'not_following'
               END AS "followStateTo",
             CASE
               WHEN EXISTS (SELECT 1
                            FROM "Follow" AS F2
                            WHERE F2."followedProfileId" = ${followStateOfProfileId}
                              AND F2."followerProfileId" = F."followedProfileId") THEN 'following'
               WHEN EXISTS (SELECT 1
                            FROM "RequestFollow" AS RF
                            WHERE RF."requestedProfileId" = ${followStateOfProfileId}
                              AND RF."requesterProfileId" = F."followedProfileId"
                              AND RF."isIgnored" = true) THEN 'ignored_request_follow'
               WHEN EXISTS (SELECT 1
                            FROM "RequestFollow" AS RF
                            WHERE RF."requestedProfileId" = ${followStateOfProfileId}
                              AND RF."requesterProfileId" = F."followedProfileId"
                              AND RF."isIgnored" = false) THEN 'requesting_follow'
               ELSE 'not_following'
               END AS "followStateFrom"
      FROM "Follow" AS F
             JOIN "Profile" AS P ON P.id = F."followedProfileId"
      WHERE (F."followerProfileId" = ${expectedProfileId}
        AND P."username" ILIKE ${likeSearch})
      ORDER BY F."followAt" DESC
      LIMIT ${this.searchFollowsProfileSize};
    `
    const result = await this.pgClient.execute(query) as {
      followAt: string,
      username: string,
      displayName: string,
      avatarUrl: string,
      followStateTo: "following" | "requesting_follow" | "not_following",
      followStateFrom: "following" | "ignored_request_follow" | "requesting_follow" | "not_following"
    }[]

    return result.map(value => {
      return {
        followAt: DateTime.fromSQL(value.followAt, {zone: "UTC"}) as DateTime<true>,
        profile: {
          username: value.username,
          displayName: value.displayName,
          avatarUrl: value.avatarUrl
        },
        followStateTo: value.followStateTo,
        followStateFrom: value.followStateFrom
      }
    })
  }

  public async searchFollowersProfile(expectedProfileId: number, followStateOfProfileId: number, search: string) {
    const likeSearch = `%${search}%`
    const query = sql`
      SELECT F."followAt",
             P."username",
             P."displayName",
             P."avatarUrl",
             CASE
               WHEN EXISTS (SELECT 1
                            FROM "Follow" AS F2
                            WHERE F2."followerProfileId" = ${followStateOfProfileId}
                              AND F2."followedProfileId" = F."followerProfileId") THEN 'following'
               WHEN EXISTS (SELECT 1
                            FROM "RequestFollow" AS RF
                            WHERE RF."requesterProfileId" = ${followStateOfProfileId}
                              AND RF."requestedProfileId" = F."followerProfileId") THEN 'requesting_follow'
               ELSE 'not_following'
               END AS "followStateTo",
             CASE
               WHEN EXISTS (SELECT 1
                            FROM "Follow" AS F2
                            WHERE F2."followedProfileId" = ${followStateOfProfileId}
                              AND F2."followerProfileId" = F."followerProfileId") THEN 'following'
               WHEN EXISTS (SELECT 1
                            FROM "RequestFollow" AS RF
                            WHERE RF."requestedProfileId" = ${followStateOfProfileId}
                              AND RF."requesterProfileId" = F."followerProfileId"
                              AND RF."isIgnored" = true) THEN 'ignored_request_follow'
               WHEN EXISTS (SELECT 1
                            FROM "RequestFollow" AS RF
                            WHERE RF."requestedProfileId" = ${followStateOfProfileId}
                              AND RF."requesterProfileId" = F."followerProfileId"
                              AND RF."isIgnored" = false) THEN 'requesting_follow'
               ELSE 'not_following'
               END AS "followStateFrom"
      FROM "Follow" AS F
             JOIN "Profile" AS P ON P.id = F."followerProfileId"
      WHERE (F."followedProfileId" = ${expectedProfileId}
        AND P."username" ILIKE ${likeSearch})
      ORDER BY F."followAt" DESC
      LIMIT ${this.searchFollowersProfileSize};
    `
    const result = await this.pgClient.execute(query) as {
      followAt: string,
      username: string,
      displayName: string,
      avatarUrl: string,
      followStateTo: "following" | "requesting_follow" | "not_following",
      followStateFrom: "following" | "ignored_request_follow" | "requesting_follow" | "not_following"
    }[]

    return result.map(value => {
      return {
        followAt: DateTime.fromSQL(value.followAt, {zone: "UTC"}) as DateTime<true>,
        profile: {
          username: value.username,
          displayName: value.displayName,
          avatarUrl: value.avatarUrl
        },
        followStateTo: value.followStateTo,
        followStateFrom: value.followStateFrom
      }
    })
  }
}
