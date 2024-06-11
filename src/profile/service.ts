import {PgClient} from "@/db/db-client"
import {S3Client} from "@aws-sdk/client-s3"
import {ProfilePgRepository} from "@/profile/repository"
import {AvatarProfileS3Repository} from "@/profile/avatar/repository"
import {DateTime} from "luxon"
import {env} from "@/env"
import {WhitelistPgRepository} from "@/whitelist/repository"

export class DefaultProfileService {
  private readonly profilePgRepository: ProfilePgRepository
  private readonly whitelistPgRepository: WhitelistPgRepository
  private readonly avatarProfileS3Repository: AvatarProfileS3Repository
  private readonly pageSize: number
  private readonly pgClient: PgClient

  constructor(pgClient: PgClient, s3client: S3Client, s3Bucket: string, pageSize: number) {
    this.profilePgRepository = new ProfilePgRepository(pgClient)
    this.whitelistPgRepository = new WhitelistPgRepository(pgClient)
    this.avatarProfileS3Repository = new AvatarProfileS3Repository(s3client, s3Bucket)
    this.pgClient = pgClient
    this.pageSize = pageSize
  }

  public findByUsername(username: string) {
    return this.profilePgRepository.findByUsername(username)
  }

  public async deleteProfile(id: number) {
    return await this.profilePgRepository.deleteProfile(id)
  }

  public async findByUserUid(uid: string) {
    const result = await this.pgClient.query.UserTable
      .findFirst({
        where: (user, {eq}) => eq(user.uid, uid),
        with: {
          profile: true,
        }
      })

    if (result) {
      return {
        ...result,
        profile: {
          ...result.profile,
          createdAt: DateTime.fromSQL(result.profile.createdAt.replace("T", " "), {zone: "UTC"}) as DateTime<true>
        }
      }
    }

    return result
  }
  public async findByProfileId(id: number) {
    return await this.profilePgRepository.findByProfileId(id)
  }

  public existUsername(username: string) {
    return this.profilePgRepository.existUsername(username)
  }

  public async updateProfileByUid(userId: string, username: string, bio: string, link: string, avatar: Buffer | null, type: string | null) {
    let avatarKey = ""

    if (avatar) {
      const uname = await this.avatarProfileS3Repository.putImage(username, avatar, <string>type)
      avatarKey = `${env.S3_ENDPOINT}/${env.S3_BUCKET_NAME}/${uname}`
    }

    return this.profilePgRepository.updateProfileByUserUid(userId, username, bio, link, avatarKey)
  }

  public async findTeaBagWithChildDataByProfileId(profileId: number) {
    const profile = await this.profilePgRepository.findByProfileId(profileId)
    const whitelist = await this.whitelistPgRepository.fetchByIdWithUsers(profileId)

    return {
      username: profile?.username,
      bio: profile?.bio,
      link: profile?.link,
      avatarUrl: profile?.avatarUrl,
      nftIds: [],
      whitelistUserIds: whitelist.map(item => item.whitelistedUserId),
      whitelistStart: whitelist[0]?.startAt,
      whitelistEnd: whitelist[0]?.endAt,
    }
  }


  public findUsersOrTeaPaginatedByUsernameOrLocation(username: string, location: string, page: number) {
    return this.profilePgRepository.findUsersOrTeaPaginatedByUsernameOrLocation(username, location, this.pageSize * (page - 1), this.pageSize)
  }

  public isUsernameExist(username: string) {
    return this.profilePgRepository.isUsernameExist(username)
  }

  public isLinkExist(link: string) {
    return this.profilePgRepository.isLinkExist(link)
  }

  public async findByNftId(nftId: number) {
    const result = await this.pgClient.query
      .NftTable
      .findFirst({
        where: (nft, {eq}) => eq(nft.id, nftId),
        columns: {},
        with: {
          profile: {}
        }
      })

    if (result) {
      return result.profile
    }

    return "no_profile"
  }

  public async findByCommentId(commentId: number) {
    const result = await this.pgClient.query
      .CommentTable
      .findFirst({
        where: (comment, {eq}) => eq(comment.id, commentId),
        columns: {},
        with: {
          nft: {
            columns: {},
            with: {
              profile: {}
            }
          }
        }
      })

    if (result) {
      return result.nft.profile
    }


    return "no_profile"
  }
}
