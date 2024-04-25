import {pgClient, PgClient} from "@/db/db-client"
import {DateTime, Duration} from "luxon"
import {EmailVerificationTable} from "@/db/schema"
import {eq} from "drizzle-orm"

export class EmailVerificationPgRepository {
  private readonly pgClient: PgClient

  constructor(pqClient: PgClient) {
    this.pgClient = pqClient
  }

  public findByVerificationId(verificationId: string) {
    return this.pgClient.query.EmailVerificationTable
      .findFirst({
        where: (emailVerification, {eq}) => (eq(emailVerification.verificationId, verificationId))
      })
  }

  public findUnverifiedAndBeforeExpirationByEmail(email: string, dateTime: DateTime<true>) {
    const nowSql = dateTime.toSQL({includeZone: false, includeOffset: false})

    return this.pgClient.query.EmailVerificationTable
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
    const result = await this.pgClient.insert(EmailVerificationTable).values({
      email: email.toLowerCase(),
      createdAt: createAtSql,
      expireAt: expireAtSql,
      isVerified: false
    }).returning({verificationId: EmailVerificationTable.verificationId})

    return result[0].verificationId
  }

  public async verify(emailVerificationId: string) {
    return pgClient
      .update(EmailVerificationTable)
      .set({
        isVerified: true
      })
      .where(eq(EmailVerificationTable.verificationId, emailVerificationId))
  }
}
