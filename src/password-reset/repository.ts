import {PgClient} from "@/db/db-client"
import {DateTime, Duration} from "luxon"
import {eq} from "drizzle-orm"

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

  public findUnverifiedAndBeforeExpirationByEmail(email: string, dateTime: DateTime<true>) {
    const nowSql = dateTime.toSQL({includeZone: false, includeOffset: false})

    return this.pgClient.query.PasswordResetTable
      .findMany({
        where: (emailVerification, {eq, and, gt}) => (
          and(
            eq(emailVerification.email, email.toLowerCase()),
            eq(emailVerification.isVerified, false),
            gt(emailVerification.expireAt, nowSql)
          )
        )
      })
  }

  public async create(email: string, createdAt: DateTime<true>) {
    const expireAt = createdAt.plus(Duration.fromObject({hours: 2}))
    const createAtSql = createdAt.toSQL({includeZone: false, includeOffset: false})
    const expireAtSql = expireAt.toSQL({includeZone: false, includeOffset: false})
    const result = await this.pgClient.insert(PasswordResetTable).values({
      email: email.toLowerCase(),
      createdAt: createAtSql,
      expireAt: expireAtSql,
      isVerified: false
    }).returning({verificationId: PasswordResetTable.verificationId})

    return result[0].verificationId
  }

  public verify(emailVerificationId: string) {
    return this.pgClient
      .update(PasswordResetTable)
      .set({
        isVerified: true
      })
      .where(eq(PasswordResetTable.verificationId, emailVerificationId))
  }
}
