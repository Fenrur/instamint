import {PgClient} from "@/db/db-client"
import {ProfileTable} from "@/db/schema"
import {ilike} from "drizzle-orm"
import {DateTime} from "luxon"

export class ProfilePgRepository {
  private readonly pgClient: PgClient

  constructor(pqClient: PgClient) {
    this.pgClient = pqClient
  }

  public async findByUsername(username: string) {
    const result = await this.pgClient.query.ProfileTable
      .findFirst({
        where: (profile, {ilike}) => ilike(profile.username, username)
      })

    if (result) {
      return {
        ...result,
        createdAt: DateTime.fromSQL(result.createdAt, {zone: "utc"}) as DateTime<true>
      }
    }

    return result
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

  public async existUsername(username: string) {
    const result = await this.pgClient.query.ProfileTable
      .findFirst({
        where: (profile, {ilike}) => (ilike(profile.username, username)),
        columns: {
          id: false,
          createdAt: false,
          avatarUrl: false,
          link: false,
          displayName: false,
          bio: false,
          location: false,
          canBeSearched: false,
          visibilityType: false,
        }
      })

    return Boolean(result)
  }

  public findById(followedProfileId: number) {
    return this.pgClient.query.ProfileTable
      .findFirst({
        where: (profile, {eq}) => eq(profile.id, followedProfileId)
      })
  }
}
