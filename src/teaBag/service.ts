import {PgClient} from "@/db/db-client"
import {ProfilePgRepository} from "@/profile/repository"
import {TeaBagPgRepository} from "@/teaBag/repository";
import {TeaBag} from "../../app/tea-bag/page";
import {WhitelistPgRepository} from "@/whitelist/repository";

export class DefaultTeaBagService {
    private readonly teaBagPgRepository: TeaBagPgRepository
    private readonly pgClient: PgClient
    private readonly pageSize: number

    constructor(pgClient: PgClient, pageSize: number) {
        this.teaBagPgRepository = new TeaBagPgRepository(pgClient)
        this.pageSize = pageSize
        this.pgClient= pgClient
    }
    public async getAll(uid: string){
        return await this.teaBagPgRepository.getAllByUId(uid);
    }
    public async create(data: TeaBag) {
        return await this.pgClient.transaction(async (tx) => {
            const profileRepository = new ProfilePgRepository(tx)
            const teaBagRepository = new TeaBagPgRepository(tx)
            const whitelist = new WhitelistPgRepository(tx)

            const profile = await profileRepository.createTeaBagProfile(data.username, data.link, data.bio);
            const teaBag = await teaBagRepository.create(profile.id);
            const whitelistUser = await whitelist.create(data.whitelistStart, data.whitelistEnd, teaBag.id, data.whitelistUserIds);
            return teaBag.id;
        });
    }


}
