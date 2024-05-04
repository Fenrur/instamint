import {PgClient} from "@/db/db-client"
import {S3Client} from "@aws-sdk/client-s3"
import {ProfilePgRepository} from "@/profile/repository"
import {AvatarProfileS3Repository} from "@/profile/avatar/repository"

export class DefaultProfileService {
  private readonly profilePgRepository: ProfilePgRepository
  private readonly avatarProfileS3Repository: AvatarProfileS3Repository
  private readonly pageSize: number

  constructor(pgClient: PgClient, s3client: S3Client, s3Bucket: string, pageSize: number) {
    this.profilePgRepository = new ProfilePgRepository(pgClient)
    this.avatarProfileS3Repository = new AvatarProfileS3Repository(s3client, s3Bucket)
    this.pageSize = pageSize;
  }

  public findByUsername(username: string) {
    return this.profilePgRepository.findByUsername(username)
  }

  public findByUserUid(uid: string) {
    return this.profilePgRepository.findByUserUid(uid)
  }
  public findUsersOrTeaPaginatedByUsernameOrLocation(username:string, location:string, page: number) {
    return this.profilePgRepository.findUsersOrTeaPaginatedByUsernameOrLocation(username, location, this.pageSize * (page - 1), this.pageSize);
  }
}
