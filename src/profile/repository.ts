import {pgClient, PgClient} from "@/db/db-client"
import {ProfileTable} from "@/db/schema"
import {ilike} from "drizzle-orm"
import {DateTime} from "luxon"

export class ProfilePgRepository {
  private readonly pgClient: PgClient

  constructor(pqClient: PgClient) {
    this.pgClient = pqClient
  }

  public async findByUsername(username: string) {
    return pgClient.query.ProfileTable
      .findFirst({
        where: (profile, {ilike}) => ilike(profile.username, username)
      })
  }

  public async updateAvatarUrl(username: string, avatarUrl: string) {
    return pgClient
      .update(ProfileTable)
      .set({
        avatarUrl: avatarUrl
      })
      .where(ilike(ProfileTable.username, username))
  }

  public async create(username: string, createdAt: DateTime<true>, avatarUrl: string) {
    const createdProfile = await pgClient
      .insert(ProfileTable)
      .values({
        username,
        createdAt: createdAt.toSQL({includeZone: false, includeOffset: false}),
        avatarUrl,
        displayName: username,
      })
      .returning({id: ProfileTable.id})

    return createdProfile[0]
  }
}
