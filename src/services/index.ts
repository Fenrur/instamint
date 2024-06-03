import {pgClient, s3client} from "@/db/db-client"
import {DefaultUserService} from "@/user/service"
import {DefaultEmailVerificationService} from "@/email-verification/service"
import {DefaultProfileService} from "@/profile/service"
import {DefaultNftService} from "@/nft/service"
import {DefaultFollowService} from "@/follow/service"
import {DefaultPasswordResetService} from "@/password-reset/service"
import {env} from "@/env"
import {
  durationExpireOffset,
  followersPageSize,
  followRequestIgnoredPageSize,
  followRequestPageSize,
  followsPageSize,
  nftsPageSize,
  profilePageSize,
  usersPageSize,
  searchFollowersProfileSize,
  searchFollowsProfileSize,
  searchRequesterProfileSize
} from "@/services/constants"

export const userService = new DefaultUserService(pgClient, env.PEPPER_PASSWORD_SECRET, env.TOTP_ENCRYPTION_KEY, usersPageSize)

export const emailVerificationService = new DefaultEmailVerificationService(pgClient, durationExpireOffset)

export const passwordResetService = new DefaultPasswordResetService(pgClient)

export const profileService = new DefaultProfileService(pgClient, s3client, env.S3_BUCKET_NAME, profilePageSize)

export const nftService = new DefaultNftService(pgClient, nftsPageSize)

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
