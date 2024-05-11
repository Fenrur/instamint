import {PgClient} from "@/db/db-client"
import {WhitelistTable, WhitelistUserTable} from "@/db/schema"
import {DateTime} from "luxon";

export class WhitelistPgRepository {
    private readonly pgClient: PgClient

    constructor(pqClient: PgClient) {
        this.pgClient = pqClient
    }

    public async create(startAt: DateTime<true>, endAt: DateTime<true>, teaBagId: number, whitelistUserIds: number[]) {
        // Parse the string into a JavaScript Date object
        let sqlFormattedDateStartAt = new Date(startAt.toString()).toISOString().slice(0, 19).replace('T', ' ');
        let sqlFormattedDateEndAt = new Date(endAt.toString()).toISOString().slice(0, 19).replace('T', ' ');

        // Insert data into the Whitelist table
        const createdWhitelist = await this.pgClient
            .insert(WhitelistTable)
            .values({
                startAt: sqlFormattedDateStartAt,
                endAt: sqlFormattedDateEndAt,
                teaBagId,
            })
            .returning({id: WhitelistTable.id});
        const whitelistId = createdWhitelist[0].id;

        if(whitelistUserIds){
            // Insert data into the WhitelistUser table for each whitelisted user
            const whitelistUserInserts = whitelistUserIds.map((userId: number) => {
                return this.pgClient
                    .insert(WhitelistUserTable)
                    .values({
                        whitelistId: whitelistId,
                        whitelistedUserId: userId,
                    });
            });
            await Promise.all(whitelistUserInserts);
        }




    }
}
