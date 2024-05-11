import {PgClient} from "@/db/db-client"
import {ProfileTable, TeaBagTable} from "@/db/schema"
import {sql} from "drizzle-orm";

export class TeaBagPgRepository {
    private readonly pgClient: PgClient

    constructor(pqClient: PgClient) {
        this.pgClient = pqClient
    }

    public async getAllByUId(uid: string) {
        const query = sql`
            SELECT ${ProfileTable.username},
                   ${ProfileTable.bio},
                   COALESCE(COUNT(DISTINCT "TeaBag".id), 0)                AS "CooksCount",
                   COALESCE(COUNT(DISTINCT "Follow".followerProfileId), 0) AS "FollowedCount",
                   COALESCE(COUNT(DISTINCT "Follow".followedProfileId), 0) AS "FollowersCount",
                   ${ProfileTable.link}
            FROM ${ProfileTable}
                     LEFT JOIN
                 ${TeaBagTable} ON ${ProfileTable.id} = ${TeaBagTable.profileId}
                     LEFT JOIN
                 ${FollowTable} ON ${ProfileTable.id} = ${FollowTable.followerProfileId} OR ${ProfileTable.id} = ${FollowTable.followedProfileId}
            GROUP BY ${ProfileTable.id};
        `;

        const result = await this.pgClient.execute(query);
        return result;
    }

    public async create(profileId: number) {
        const createdTeaBag = await this.pgClient
            .insert(TeaBagTable)
            .values({
                profileId,
            })
            .returning({id: TeaBagTable.id});
        return createdTeaBag[0];
    }


}
