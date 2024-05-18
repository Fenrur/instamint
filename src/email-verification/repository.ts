import {PgClient} from "@/db/db-client"
import {DateTime} from "luxon"
import {EmailVerificationTable} from "@/db/schema"
import {eq} from "drizzle-orm"

export class EmailVerificationPgRepository {
  private readonly pgClient: PgClient

  constructor(pqClient: PgClient) {
    this.pgClient = pqClient
  }

  public async findByVerificationId(verificationId: string) {
    const result = await this.pgClient.query.EmailVerificationTable
      .findFirst({
        where: (emailVerification, {eq}) => (eq(emailVerification.verificationId, verificationId))
      })

    if (result) {
      return {
        ...result,
        expireAt: DateTime.fromSQL(result.expireAt, {zone: "UTC"}) as DateTime<true>,
        createdAt: DateTime.fromSQL(result.createdAt, {zone: "UTC"}) as DateTime<true>
      }
    }

    return result
  }

  public async findUnverifiedAndBeforeExpirationByEmail(email: string, dateTime: DateTime<true>) {
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

  public async create(email: string, createdAt: DateTime<true>, expireAt: DateTime<true>) {
    const result = await this.pgClient.insert(EmailVerificationTable).values({
      email: email.toLowerCase(),
      createdAt: createdAt.toSQL({includeZone: false, includeOffset: false}),
      expireAt: expireAt.toSQL({includeZone: false, includeOffset: false}),
      isVerified: false
    }).returning({verificationId: EmailVerificationTable.verificationId})

    return result[0].verificationId
  }

  public verify(emailVerificationId: string) {
    return this.pgClient
      .update(EmailVerificationTable)
      .set({
        isVerified: true
      })
      .where(eq(EmailVerificationTable.verificationId, emailVerificationId))
  }
}
