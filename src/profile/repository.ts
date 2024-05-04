import {PgClient} from "@/db/db-client"
import {NftTable, ProfileTable, UserTable} from "@/db/schema"
import {eq, ilike} from "drizzle-orm"
import {DateTime} from "luxon"
import {User} from "lucide-react"

export class ProfilePgRepository {
    private readonly pgClient: PgClient

    constructor(pqClient: PgClient) {
        this.pgClient = pqClient
    }

    public findByUsername(username: string) {
        return this.pgClient.query.ProfileTable
            .findFirst({
                where: (profile, {ilike}) => ilike(profile.username, username)
            })
    }

    public updateAvatarUrl(username: string, avatarUrl: string) {
        return this.pgClient
            .update(ProfileTable)
            .set({
                avatarUrl
            })
            .where(ilike(ProfileTable.username, username))
    }

    public async updateProfileByUserUid(uid: string, username: string, bio: string, link: string, avatarUrl: string) {
        const users = await this.pgClient
            .select({profileId: UserTable.profileId}).from(UserTable)
            .where(eq(UserTable.uid, uid))
        const profileId = users[0].profileId

        return this.pgClient
            .update(ProfileTable)
            .set({
                username,
                bio,
                link,
                avatarUrl
            })
            .where(eq(ProfileTable.id, profileId))
    }

    public async create(username: string, createdAt: DateTime<true>, avatarUrl: string) {
        const createdProfile = await this.pgClient
            .insert(ProfileTable)
            .values({
                username,
                createdAt: createdAt.toSQL({includeZone: false, includeOffset: false}),
                avatarUrl,
                displayName: username,
            })
            .returning({id: ProfileTable.id})

        return createdProfile[0]
    }

    public findByUserUid(uid: string) {
        return this.pgClient.query.UserTable
            .findFirst({
                where: (user, {eq}) => eq(user.uid, uid),
                columns: {
                    id: true,
                },
                with: {
                    profile: true,
                }
            })
    }


    public async findUsersOrTeaPaginatedByUsernameOrLocation(username: string, location: string, offset: number, limit: number) {
        const sqlQuery = sql`
            SELECT ${ProfileTable.id},
                   ${ProfileTable.username},
                   ${ProfileTable.createdAt},
                   ${ProfileTable.bio},
                   ${ProfileTable.link},
                   ${ProfileTable.avatarUrl},
                   ${ProfileTable.canBeSearched},
                   ${ProfileTable.visibilityType},
                   ${ProfileTable.location},
                   ${ProfileTable.displayName}
            FROM ${ProfileTable}
            WHERE 1 = 1 `

        // Add search criteria dynamically based on provided parameters
        if (username) {
            sqlQuery.append(sql` AND
            ${ProfileTable.username}
            ILIKE
            '%'
            ||
            ${username}
            ||
            '%'`)
        }

        if (location) {
            sqlQuery.append(sql` AND
            ${ProfileTable.location}
            ILIKE
            '%'
            ||
            ${location}
            ||
            '%'`)
        }

        sqlQuery.append(sql` ORDER BY
        ${ProfileTable.createdAt}
        DESC
        OFFSET
        ${offset}
        LIMIT
        ${limit}`)

        return this.pgClient.execute(sqlQuery)
    }
}
