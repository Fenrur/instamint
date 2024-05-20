import {PgClient} from "@/db/db-client"
import {env} from "@/env"
import {UserTable} from "@/db/schema"
import {eq, sql} from "drizzle-orm"
import {symmetricEncrypt} from "@/utils/crypto"
import {z} from "zod"
import {userRoleArray} from "@/domain/types"


export class UserPgRepository {
  private readonly pgClient: PgClient
  private readonly FindUsersPaginated = z.array(z.object({
    id: z.number().int().positive(),
    email: z.string(),
    isActivated: z.boolean(),
    role: z.enum(userRoleArray),
  }))
  private readonly  UserObject = z.array(z.object({
    id: z.number().int().positive(),
    email: z.string(),
    isActivated: z.boolean(),
    role: z.enum(userRoleArray),
  }))

  constructor(pqClient: PgClient) {
    this.pgClient = pqClient
  }

  public findByEmail(email: string) {
    return this.pgClient.query.UserTable
      .findFirst({
        where: (user, {eq}) => (eq(user.email, email.toLowerCase())),
      })
  }

  public async findById(id: number) {
    const query = sql`
      SELECT ${UserTable.id},
             ${UserTable.email},
             ${UserTable.isActivated},
             ${UserTable.role}
      FROM ${UserTable} WHERE id = ${id}
    `
    const result = await this.pgClient.execute(query)
    return this.UserObject.parse(result)
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

  public async enableIsActivated(id: number) {
    return this.pgClient
      .update(UserTable)
      .set({
        isActivated: true
      })
      .where(eq(UserTable.id, id))
  }

  public async disableIsActivated(id: number) {
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

  public async findUsersPaginatedAndSorted(offset: number, limit: number) {
    const query = sql`
      SELECT ${UserTable.id},
             ${UserTable.email},
             ${UserTable.isActivated},
             ${UserTable.role}
      FROM ${UserTable}
      ORDER BY ${UserTable.email} DESC
      OFFSET ${offset} LIMIT ${limit}
    `
    const result = await this.pgClient.execute(query)
    return this.FindUsersPaginated.parse(result)
  }
}
