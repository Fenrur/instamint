import {PgClient} from "@/db/db-client"
import {S3Client} from "@aws-sdk/client-s3"

export class DefaultProfileService {
  private readonly pgClient: PgClient
  private readonly s3client: S3Client
  private readonly s3Bucket: string

  constructor(pgClient: PgClient, s3client: S3Client, s3Bucket: string) {
    this.pgClient = pgClient
    this.s3client = s3client
    this.s3Bucket = s3Bucket
  }
}
