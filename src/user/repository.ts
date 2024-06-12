import {PgClient} from "@/db/db-client"
import {env} from "@/env"
import {UserTable} from "@/db/schema"
import {desc, eq} from "drizzle-orm"
import {symmetricEncrypt} from "@/utils/crypto"


export class UserPgRepository {
  private readonly pgClient: PgClient

  constructor(pqClient: PgClient) {
    this.pgClient = pqClient
  }

  public findByEmail(email: string) {
    return this.pgClient.query.UserTable
      .findFirst({
        where: (user, {eq}) => (eq(user.email, email.toLowerCase())),
      })
  }

    public async getAll() {
        return this.pgClient.query.UserTable
            .findMany({
                columns: {
                    id: true,
                },
                with: {
                    profile: true,
                }
            })
    }



  public findByUid(uid: string) {
    return this.pgClient.query.UserTable
      .findFirst({
        where: (user, {eq}) => (eq(user.uid, uid)),
      })
  }

  public findById(id: string) {
    return this.pgClient.query.UserTable
      .findFirst({
        where: (user, {eq}) => (eq(user.id, Number(id))),
      })
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

  public async resetTwoFactorAuthentification(id: number) {
    return this.pgClient
      .update(UserTable)
      .set({
        twoFactorEnabled: false,
        twoFactorSecret: null
      })
      .where(eq(UserTable.id, id))
  }

  public async enableTwoFactorAuthentification(uid: string) {
    return this.pgClient
      .update(UserTable)
      .set({
        twoFactorEnabled: true
      })
      .where(eq(UserTable.uid, uid))
  }

  public async disableTwoFactorAuthentification(uid: string) {
    return this.pgClient
      .update(UserTable)
      .set({
        twoFactorEnabled: false
      })
      .where(eq(UserTable.uid, uid))
  }

  public async enable(id: number) {
    return this.pgClient
      .update(UserTable)
      .set({
        isActivated: true
      })
      .where(eq(UserTable.id, id))
  }

  public async disable(id: number) {
    return this.pgClient
      .update(UserTable)
      .set({
        isActivated: false
      })
      .where(eq(UserTable.id, id))
  }

  public async setTwoFactorSecret(uid: string, secret: string) {
    return this.pgClient
      .update(UserTable)
      .set({
        twoFactorSecret: symmetricEncrypt(secret, env.TOTP_ENCRYPTION_KEY)
      })
      .where(eq(UserTable.uid, uid))
  }

  public async updatePassword(uid: string, hashedPassword: string) {
    return this.pgClient
      .update(UserTable)
      .set({
        hashedPassword
      })
      .where(eq(UserTable.uid, uid))
  }

  public async deleteUser(uid: string) {
    return this.pgClient
      .delete(UserTable)
      .where(eq(UserTable.uid, uid))
  }

  public async create(email: string, hashedPassword: string, profileId: number) {
    const createdUser = await this.pgClient
      .insert(UserTable)
      .values({
        email,
        hashedPassword,
        profileId,
      })
      .returning({uid: UserTable.uid})

    return createdUser[0]
  }

  public findUsersPaginatedAndSorted(offset: number, limit: number) {
    return this.pgClient.query
      .UserTable
      .findMany({
        columns: {
          id: true,
          email: true,
          isActivated: true,
          role: true
        },
        offset,
        limit,
        orderBy: desc(UserTable.email)
      })
  }
}
