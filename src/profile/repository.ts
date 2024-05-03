import {PgClient} from "@/db/db-client"
import {ProfileTable} from "@/db/schema"
import {ilike} from "drizzle-orm"
import {DateTime} from "luxon"

export class ProfilePgRepository {
  private readonly pgClient: PgClient

  constructor(pqClient: PgClient) {
    this.pgClient = pqClient
  }

  public findByUsername(username: string) {
    return this.pgClient.query.ProfileTable
      .findFirst({
        where: (profile, {ilike}) => ilike(profile.username, username)
      })
  }

  public updateAvatarUrl(username: string, avatarUrl: string) {
    return this.pgClient
      .update(ProfileTable)
      .set({
        avatarUrl
      })
      .where(ilike(ProfileTable.username, username))
  }

  public async create(username: string, createdAt: DateTime<true>, avatarUrl: string) {
    const createdProfile = await this.pgClient
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

  public findByUserUid(uid: string) {
    return this.pgClient.query.UserTable
      .findFirst({
        where: (user, {eq}) => eq(user.uid, uid),
        columns: {
          id: true,
        },
        with: {
          profile: true,
        }
      })
  }
}
