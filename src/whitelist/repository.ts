import {pgClient, PgClient} from "@/db/db-client"
import {TeaBagTable, WhitelistTable, WhitelistUserTable} from "@/db/schema"
import {DateTime} from "luxon"
import {eq, sql} from "drizzle-orm"

export class WhitelistPgRepository {
  private readonly pgClient: PgClient

  constructor(pqClient: PgClient) {
    this.pgClient = pqClient
  }

  public async create(startAt: DateTime<true>, endAt: DateTime<true>, teaBagId: number, whitelistUserIds: number[]) {
    // Parse the string into a JavaScript Date object
    const sqlFormattedDateStartAt = new Date(startAt.toString()).toISOString().slice(0, 19).replace("T", " ")
    const sqlFormattedDateEndAt = new Date(endAt.toString()).toISOString().slice(0, 19).replace("T", " ")
    // Insert data into the Whitelist table
    const createdWhitelist = await this.pgClient
      .insert(WhitelistTable)
      .values({
        startAt: sqlFormattedDateStartAt,
        endAt: sqlFormattedDateEndAt,
        teaBagId,
      })
      .returning({id: WhitelistTable.id})
    const whitelistId = createdWhitelist[0].id

    if (whitelistUserIds) {
      // Insert data into the WhitelistUser table for each whitelisted user
      const whitelistUserInserts = whitelistUserIds.map((userId: number) => {
        return this.pgClient
          .insert(WhitelistUserTable)
          .values({
            whitelistId,
            whitelistedUserId: userId,
          })
      })
      await Promise.all(whitelistUserInserts)
    }
  }

  public async update(
    profileId: number,
    startAt: DateTime<true>,
    endAt: DateTime<true>,
    whitelistUserIds: number[]
  ) {
    // Parse the string into a JavaScript Date object
    const sqlFormattedDateStartAt = new Date(startAt.toString()).toISOString().slice(0, 19).replace("T", " ")
    const sqlFormattedDateEndAt = new Date(endAt.toString()).toISOString().slice(0, 19).replace("T", " ")
    const sqlQuery = sql`SELECT ${WhitelistTable.id}
                         FROM ${WhitelistTable}
                                inner join ${TeaBagTable} on ${WhitelistTable.teaBagId} = ${TeaBagTable.id}
                         WHERE ${TeaBagTable.profileId} = ${profileId}`
    const result = await this.pgClient.execute(sqlQuery)
    const whitelistId = result[0].id as number

    await pgClient.transaction(async (tx) => {
      // Update data in the Whitelist table
      await tx.update(WhitelistTable)
        .set({
          startAt: sqlFormattedDateStartAt,
          endAt: sqlFormattedDateEndAt,
        })
        .where(eq(WhitelistTable.id, whitelistId))

      // Delete existing entries in the WhitelistUser table for the given whitelistId
      await tx.delete(WhitelistUserTable)
        .where(eq(WhitelistUserTable.whitelistId, whitelistId))

      if (whitelistUserIds && whitelistUserIds.length > 0) {
        // Insert new data into the WhitelistUser table for each whitelisted user
        const whitelistUserInserts = whitelistUserIds.map((userId: number) => {
          return tx.insert(WhitelistUserTable)
            .values({
              whitelistId,
              whitelistedUserId: userId,
            })
        })
        await Promise.all(whitelistUserInserts)
      }
    })
  }


  // Function to fetch whitelist data with associated users
  public async fetchByIdWithUsers(profileId: number) {
    // Fetch whitelist data
    const sqlQuery = sql`
      SELECT ${WhitelistTable.teaBagId},
             ${WhitelistTable.startAt},
             ${WhitelistTable.endAt},
             ${WhitelistUserTable.whitelistedUserId}
      FROM ${WhitelistTable}
             left join ${WhitelistUserTable} on ${WhitelistUserTable.whitelistId} = ${WhitelistTable.id}
             left join ${TeaBagTable} on ${TeaBagTable.id} = ${WhitelistTable.teaBagId}
      WHERE ${TeaBagTable.profileId} = ${profileId}`

    return await this.pgClient.execute(sqlQuery)
  }
}
