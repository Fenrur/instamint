import {MintCommentPgRepository} from "@/mint-comment/repository"
import {PgClient} from "@/db/db-client"
import {DateTime} from "luxon"
import {CommentPgRepository} from "@/comment/repository"

export class DefaultMintCommentService {
  private readonly commentRepository: CommentPgRepository
  private readonly mintCommentRepository: MintCommentPgRepository

  constructor(pgClient: PgClient) {
    this.commentRepository = new CommentPgRepository(pgClient)
    this.mintCommentRepository = new MintCommentPgRepository(pgClient)
  }

  public async mint(commentId: number, profileId: number, mintAt: DateTime<true>) {
    const existComment = await this.commentRepository.exists(commentId)

    if (!existComment) {
      return "comment_not_found"
    }

    const mintComment = await this.mintCommentRepository.get(commentId, profileId)

    if (mintComment) {
      return "already_minted"
    }

    await this.mintCommentRepository.create(commentId, profileId, mintAt)

    return "minted"
  }

  public async unmint(commentId: number, profileId: number) {
    const existComment = await this.commentRepository.exists(commentId)

    if (!existComment) {
      return "comment_not_found"
    }

    const mintComment = await this.mintCommentRepository.get(commentId, profileId)

    if (!mintComment) {
      return "not_minted"
    }

    await this.mintCommentRepository.delete(commentId, profileId)

    return "unminted"
  }
}
