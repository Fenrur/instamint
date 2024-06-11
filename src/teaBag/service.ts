import {PgClient} from "@/db/db-client"
import {ProfilePgRepository} from "@/profile/repository"
import {TeaBagPgRepository} from "@/teaBag/repository"
import {TeaBag} from "../../app/tea-bags/page"
import {WhitelistPgRepository} from "@/whitelist/repository"
import {S3Client} from "@aws-sdk/client-s3"
import {AvatarProfileS3Repository} from "@/profile/avatar/repository"
import {profilePageSize} from "@/services/constants"
import {DateTime} from "luxon"
import {followService} from "@/services"
import {env} from "@/env"

type TeaBagUpdate = {
  profileId: number;
} & TeaBag

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

  public async getAll(uid: string, page: number) {
    return await this.teaBagPgRepository.getAllByUId(uid, profilePageSize * (page - 1), profilePageSize)
  }

  public async findByProfileId(uid: string) {
    return await this.teaBagPgRepository.findByProfileId(uid)
  }

  public async create(data: TeaBag, avatar: Buffer | null, type: string | null) {
    return await this.pgClient.transaction(async (tx) => {
      async function followUsers(whitelistUserIds: number[], profileId: number) {
        if (whitelistUserIds) {
          const followPromises = whitelistUserIds.map(userId =>
            followService.followOrRequest(userId, profileId, DateTime.utc())
          )

          await Promise.all(followPromises)
        }
      }

      const profileRepository = new ProfilePgRepository(tx)
      const teaBagRepository = new TeaBagPgRepository(tx)
      const whitelist = new WhitelistPgRepository(tx)

      let avatarKey = ""

      if (avatar) {
        const uname = await this.avatarProfileS3Repository.putImage(data.username, avatar, <string>type)
        avatarKey = `${env.S3_ENDPOINT}/${env.S3_BUCKET_NAME}/${uname}`
      }

      const profile = await profileRepository.createTeaBagProfile(data.username, data.link, data.bio as string, avatarKey)
      const teaBag = await teaBagRepository.create(profile.id)
      await whitelist.create(data.whitelistStart as DateTime<true>, data.whitelistEnd as DateTime<true>, teaBag.id, data.whitelistUserIds as number[])
      await followUsers(data.whitelistUserIds as number[], profile.id)

      return teaBag.id
    })
  }

  public async update(data: TeaBagUpdate, avatar: Buffer | null, type: string | null) {
     await this.pgClient.transaction(async (tx) => {
      async function followUsers(whitelistUserIds: number[], profileId: number) {
        if (whitelistUserIds) {
          const followPromises = whitelistUserIds.map(async userId => {
            try {
              await followService.followOrRequest(userId, profileId, DateTime.utc())
            } catch (error) {
              // Handle the error for this specific userId as needed
            }
          })

          await Promise.all(followPromises)
        }
      }

      const profileRepository = new ProfilePgRepository(tx)
      const whitelist = new WhitelistPgRepository(tx)

      let avatarKey = ""

      if (avatar) {
        const uname = await this.avatarProfileS3Repository.putImage(data.username, avatar, <string>type)
        avatarKey = `${env.S3_ENDPOINT}/${env.S3_BUCKET_NAME}/${uname}`
      }

      await profileRepository.updateById(
        data.profileId, data.username, data.link, data.bio as string, avatarKey
      )

      await whitelist.update(
        data.profileId,
        data.whitelistStart as DateTime<true>,
        data.whitelistEnd as DateTime<true>,
        data.whitelistUserIds as number[]
      )

      await followUsers(data.whitelistUserIds as number[], data.profileId)
    })
  }
}
