import {DeleteObjectCommand, GetObjectCommand, PutObjectCommand, S3Client} from "@aws-sdk/client-s3"
import {avatarS3Path} from "@/utils/avatar"
import {ReadStream} from "node:fs"
import {Readable} from "node:stream"

export class AvatarProfileS3Repository {
  private readonly s3client: S3Client
  private readonly bucket: string

  constructor(s3client: S3Client, bucket: string) {
    this.s3client = s3client
    this.bucket = bucket
  }

  public async get(username: string) {
    const getCommand = new GetObjectCommand({
      Bucket: this.bucket,
      Key: avatarS3Path(username)
    })

    try {
      const result = await this.s3client.send(getCommand)

      if (result.Body) {
        return result.Body
      }

      return "avatar_not_found"
    } catch (error: any) {
      if (error.name === "NoSuchKey") {
        return "avatar_not_found"
      }

      throw error
    }
  }

  public put(username: string, pictureStream: ReadStream) {
    const putCommand = new PutObjectCommand({
      Bucket: this.bucket,
      Key: avatarS3Path(username),
      Body: pictureStream
    })

    return this.s3client.send(putCommand)
  }

  public async putImage(username: string, buffer: Buffer, type: string) {
    const key = avatarS3Path(username)
    const putCommand = new PutObjectCommand({
      Bucket: this.bucket,
      Key: key,
      Body: Readable.from(buffer),
      ContentLength: buffer.length,
      ContentType: `image/${type}`
    })
    await this.s3client.send(putCommand)

    return key
  }

  public delete(username: string) {
    const deleteCommand = new DeleteObjectCommand({
      Bucket: this.bucket,
      Key: avatarS3Path(username)
    })

    return this.s3client.send(deleteCommand)
  }
}
