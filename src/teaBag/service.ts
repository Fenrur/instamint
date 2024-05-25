import {PgClient} from "@/db/db-client"
import {ProfilePgRepository} from "@/profile/repository"
import {TeaBagPgRepository} from "@/teaBag/repository"
import {TeaBag} from "../../app/tea-bags/page"
import {WhitelistPgRepository} from "@/whitelist/repository"
import {S3Client} from "@aws-sdk/client-s3"
import {AvatarProfileS3Repository} from "@/profile/avatar/repository"

export class DefaultTeaBagService {
  private readonly teaBagPgRepository: TeaBagPgRepository
  private readonly avatarProfileS3Repository: AvatarProfileS3Repository
  private readonly pgClient: PgClient
  private readonly pageSize: number

  constructor(pgClient: PgClient, s3client: S3Client, s3Bucket: string, pageSize: number) {
    this.teaBagPgRepository = new TeaBagPgRepository(pgClient)
    this.avatarProfileS3Repository = new AvatarProfileS3Repository(s3client, s3Bucket)
    this.pageSize = pageSize
    this.pgClient = pgClient
  }

  public async getAll(uid: string) {
    return await this.teaBagPgRepository.getAllByUId(uid)
  }

  public async getByProfileId(uid: string) {
    return await this.teaBagPgRepository.getByProfileId(uid)
  }

  public async create(data: TeaBag) {
    return await this.pgClient.transaction(async (tx) => {
      const profileRepository = new ProfilePgRepository(tx)
      const teaBagRepository = new TeaBagPgRepository(tx)
      const whitelist = new WhitelistPgRepository(tx)
      const profile = await profileRepository.createTeaBagProfile(data.username, data.link, data.bio)
      const teaBag = await teaBagRepository.create(profile.id)
      await whitelist.create(data.whitelistStart, data.whitelistEnd, teaBag.id, data.whitelistUserIds)


      return teaBag.id
    })
  }
}
