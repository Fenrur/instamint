import {PgClient} from "@/db/db-client"
import {env} from "@/env"
import {UserTable} from "@/db/schema"
import {eq} from "drizzle-orm"
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

  public findByUid(uid: string) {
    return this.pgClient.query.UserTable
      .findFirst({
        where: (user, {eq}) => (eq(user.uid, uid)),
      })
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

  public async setTwoFactorSecret(uid: string, secret: string) {
    return this.pgClient
      .update(UserTable)
      .set({
        twoFactorSecret: symmetricEncrypt(secret, env.TOTP_ENCRYPTION_KEY)
      })
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
}
