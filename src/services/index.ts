import {pgClient, s3client} from "@/db/db-client"
import {DefaultUserService} from "@/user/service"
import {DefaultEmailVerificationService} from "@/email-verification/service"
import {DefaultProfileService} from "@/profile/service"
import {DefaultNftService} from "@/nft/service"
import {DefaultFollowService} from "@/follow/service"
import {DefaultPasswordResetService} from "@/password-reset/service"
import {DefaultReportCommentService} from "@/report-comment/service"
import {DefaultReportNftService} from "@/report-nft/service"
import {env} from "@/env"
import {
  commentNftSize, commentsPageSize,
  durationExpireOffset,
  followersPageSize,
  followRequestIgnoredPageSize,
  followRequestPageSize,
  followsPageSize,
  nftsPageSize,
  profilePageSize,
  searchFollowersProfileSize,
  searchFollowsProfileSize,
  searchRequesterProfileSize,
  reportsPageSize,
  teaBagsPageSize,
  usersPageSize
} from "@/services/constants"
import {DefaultTeaBagService} from "@/teaBag/service"
import {DefaultReportProfileService} from "@/report-profile/service"
import {DefaultMintService} from "@/mint/service"
import {DefaultCommentService} from "@/comment/service"
import {DefaultMintCommentService} from "@/mint-comment/service"

export const userService = new DefaultUserService(pgClient, env.PEPPER_PASSWORD_SECRET, env.TOTP_ENCRYPTION_KEY, usersPageSize)

export const emailVerificationService = new DefaultEmailVerificationService(pgClient, durationExpireOffset)

export const passwordResetService = new DefaultPasswordResetService(pgClient)

export const profileService = new DefaultProfileService(pgClient, s3client, env.S3_BUCKET_NAME, profilePageSize)

export const nftService = new DefaultNftService(pgClient, nftsPageSize)

export const teaBagService = new DefaultTeaBagService(pgClient, s3client, env.S3_BUCKET_NAME, teaBagsPageSize)

export const followService = new DefaultFollowService(
  pgClient,
  followersPageSize,
  followsPageSize,
  followRequestPageSize,
  followRequestIgnoredPageSize,
  searchRequesterProfileSize,
  searchFollowsProfileSize,
  searchFollowersProfileSize
)

export const mintNftService = new DefaultMintService(pgClient)

export const commentService = new DefaultCommentService(pgClient, commentNftSize, commentsPageSize)

export const mintCommentService = new DefaultMintCommentService(pgClient)

export const reportCommentService = new DefaultReportCommentService(pgClient, reportsPageSize)

export const reportNftService = new DefaultReportNftService(pgClient, reportsPageSize)

export const reportProfileService = new DefaultReportProfileService(pgClient, reportsPageSize)
