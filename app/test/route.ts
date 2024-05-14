import {followService} from "@/services"
import {NextResponse} from "next/server"
import {ProfileTable, RequestFollowTable} from "@/db/schema"
import {and, eq, ilike} from "drizzle-orm"
import {pgClient} from "@/db/db-client"

export async function GET() {
  const result = pgClient
    .select({
      username: ProfileTable.username,
      avatarUrl: ProfileTable.avatarUrl,
      displayName: ProfileTable.displayName,
      isIgnored: RequestFollowTable.isIgnored,
      requestAt: RequestFollowTable.requestAt
    })
    .from(RequestFollowTable).innerJoin(ProfileTable, eq(RequestFollowTable.requesterProfileId, ProfileTable.id))
    .where(and(
      eq(RequestFollowTable.isIgnored, true),
      eq(RequestFollowTable.requestedProfileId, 1),
      ilike(ProfileTable.username, `%caca%`),
    ))
    .limit(1)

  console.log(result.toSQL().sql)

  return NextResponse.json(result.toSQL().sql)
}
