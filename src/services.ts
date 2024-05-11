import {pgClient, s3client} from "@/db/db-client"
import {env} from "./env"
import {DefaultUserService} from "@/user/service"
import {DefaultEmailVerificationService} from "@/email-verification/service"
import {DefaultProfileService} from "@/profile/service"
import {DefaultNftService} from "@/nft/service"
import {DefaultFollowService} from "@/follow/service"
import {DefaultTeaBagService} from "@/teaBag/service"
import {DefaultReportProfileService} from "@/Report-profile/service"

export const userService = new DefaultUserService(pgClient, env.PEPPER_PASSWORD_SECRET, env.TOTP_ENCRYPTION_KEY)

export const emailVerificationService = new DefaultEmailVerificationService(pgClient)

export const profileService = new DefaultProfileService(pgClient, s3client, env.S3_BUCKET_NAME, 12)

export const nftService = new DefaultNftService(pgClient, 12)

export const followService = new DefaultFollowService(pgClient)

export const teaBagService = new DefaultTeaBagService(pgClient, 12)

export const reportProfileService = new DefaultReportProfileService(pgClient)
