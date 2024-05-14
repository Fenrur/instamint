import {PgClient} from "@/db/db-client"
import {DateTime, Duration} from "luxon"
import {eq} from "drizzle-orm"
import {PasswordResetTable} from "@/db/schema"

export class PasswordResetPgRepository {
  private readonly pgClient: PgClient

  constructor(pqClient: PgClient) {
    this.pgClient = pqClient
  }

  public findByResetId(resetId: string) {
    return this.pgClient.query.PasswordResetTable
      .findFirst({
        where: (passwordReset, {eq}) => (eq(passwordReset.resetId, resetId))
      })
  }

  public async create(userId: number, createdAt: DateTime<true>) {
    const expireAt = createdAt.plus(Duration.fromObject({hours: 2}))
    const createAtSql = createdAt.toSQL({includeZone: false, includeOffset: false})
    const expireAtSql = expireAt.toSQL({includeZone: false, includeOffset: false})
    const result = await this.pgClient.insert(PasswordResetTable).values({
      userId,
      createdAt: createAtSql,
      expireAt: expireAtSql,
      active: true
    }).returning({resetId: PasswordResetTable.resetId})

    return result[0].resetId
  }

  public deactivateResetById(resetId: number) {
    return this.pgClient
      .update(PasswordResetTable)
      .set({
        active: false
      })
      .where(eq(PasswordResetTable.id, resetId))
  }
}
