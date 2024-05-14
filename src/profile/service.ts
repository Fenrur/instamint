import {PgClient} from "@/db/db-client"
import {S3Client} from "@aws-sdk/client-s3"
import {ProfilePgRepository} from "@/profile/repository"
import {AvatarProfileS3Repository} from "@/profile/avatar/repository"
import {DateTime} from "luxon"

export class DefaultProfileService {
  private readonly profilePgRepository: ProfilePgRepository
  private readonly avatarProfileS3Repository: AvatarProfileS3Repository
  private readonly pgClient: PgClient

  constructor(pgClient: PgClient, s3client: S3Client, s3Bucket: string) {
    this.profilePgRepository = new ProfilePgRepository(pgClient)
    this.avatarProfileS3Repository = new AvatarProfileS3Repository(s3client, s3Bucket)
    this.pgClient = pgClient
  }

  public findByUsername(username: string) {
    return this.profilePgRepository.findByUsername(username)
  }

  public async findByUserUid(uid: string) {
    const result = await this.pgClient.query.UserTable
      .findFirst({
        where: (user, {eq}) => eq(user.uid, uid),
        columns: {
          id: true,
        },
        with: {
          profile: true,
        }
      })

    if (result) {
      return {
        id: result.id,
        profile: {
          ...result.profile,
          createdAt: DateTime.fromSQL(result.profile.createdAt.replace("T", " "), {zone: "UTC"}) as DateTime<true>
        }
      }
    }

    return result
  }

  public existUsername(username: string) {
    return this.profilePgRepository.existUsername(username)
  }
}
