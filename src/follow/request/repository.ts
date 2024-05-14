import {PgClient} from "@/db/db-client"
import {RequestFollowTable} from "@/db/schema"
import {DateTime} from "luxon"
import {and, count, eq} from "drizzle-orm"

export class RequestFollowPgRepository {
  private readonly pgClient: PgClient

  constructor(pgClient: PgClient) {
    this.pgClient = pgClient
  }

  public create(requesterProfileId: number, requestedProfileId: number, requestAt: DateTime<true>, isIgnored: boolean) {
    return this.pgClient
      .insert(RequestFollowTable)
      .values({
        requesterProfileId,
        requestedProfileId,
        requestAt: requestAt.toSQL({includeZone: false, includeOffset: false}),
        isIgnored
      })
  }

  public delete(requesterProfileId: number, requestedProfileId: number) {
    return this.pgClient
      .delete(RequestFollowTable)
      .where(
        and(
          eq(RequestFollowTable.requesterProfileId, requesterProfileId),
          eq(RequestFollowTable.requestedProfileId, requestedProfileId)
        )
      )
  }

  public async get(requesterProfileId: number, requestedProfileId: number) {
    const result = await this.pgClient.query
      .RequestFollowTable
      .findFirst({
        where: (request, {eq, and}) => and(
          eq(request.requesterProfileId, requesterProfileId),
          eq(request.requestedProfileId, requestedProfileId)
        )
      })

    if (result) {
      return {
        ...result,
        requestAt: DateTime.fromSQL(result.requestAt, {zone: "UTC"}) as DateTime<true>
      }
    }

    return result
  }

  public async count(profileId: number) {
    const result = await this.pgClient
      .select({count: count()})
      .from(RequestFollowTable)
      .where(eq(RequestFollowTable.requestedProfileId, profileId))

    return result[0].count
  }

  public async ignore(requesterProfileId: number, requestedProfileId: number) {
    return this.pgClient
      .update(RequestFollowTable)
      .set({isIgnored: true})
      .where(
        and(
          eq(RequestFollowTable.requesterProfileId, requesterProfileId),
          eq(RequestFollowTable.requestedProfileId, requestedProfileId)
        )
      )
  }

  public async unIgnore(requesterProfileId: number, requestedProfileId: number) {
    return this.pgClient
      .update(RequestFollowTable)
      .set({isIgnored: false})
      .where(
        and(
          eq(RequestFollowTable.requesterProfileId, requesterProfileId),
          eq(RequestFollowTable.requestedProfileId, requestedProfileId)
        )
      )
  }

  public async findRequestsPaginatedAndSorted(profileId: number, ignored: boolean, offset: number, limit: number) {
    const result = await this.pgClient.query
      .RequestFollowTable
      .findMany({
        where: (request, {eq, and}) => and(
          eq(request.requestedProfileId, profileId),
          eq(request.isIgnored, ignored)
        ),
        columns: {
          requestAt: true,
        },
        with: {
          requester: {
            columns: {
              username: true,
              avatarUrl: true,
              displayName: true,
            }
          },
        },
        orderBy: (request, {desc}) => desc(request.requestAt),
        offset,
        limit,
      })

    return result
      .map(value => {
        return {
          requestAt: DateTime.fromSQL(value.requestAt, {zone: "UTC"}) as DateTime<true>,
          isIgnored: ignored,
          profile: {
            ...value.requester
          }
        }
      })
  }

  public async countRequestFollow(profileId: number) {
    const result = await this.pgClient
      .select({count: count()})
      .from(RequestFollowTable)
      .where(eq(RequestFollowTable.requestedProfileId, profileId))

    if (result) {
      return result[0].count
    }

    return null
  }

  public ignoreAll(profileId: number) {
    return this.pgClient
      .update(RequestFollowTable)
      .set({isIgnored: true})
      .where(eq(RequestFollowTable.requestedProfileId, profileId))
  }
}
