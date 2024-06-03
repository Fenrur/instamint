import {ErrorCode} from "@/http/error-code"
import {NextResponse} from "next/server"
import {z} from "zod"
import {StatusCodes} from "http-status-codes"

interface Problem {
  status: number
  errorCode: ErrorCode
  title: string
  detail?: unknown
  type?: string
}

export function problem(Problem: Problem) {
  const problem = NextResponse.json(Problem, {status: Problem.status})
  problem.headers.set("Content-Type", "application/problem+json")

  return problem
}

export const emailNotFoundProblem = {title: "Email not found", errorCode: ErrorCode.EMAIL_NOT_FOUNT, status: StatusCodes.NOT_FOUND}

export const passwordIsInvalidProblem = {title: "Password is invalid", errorCode: ErrorCode.PASSWORD_IS_INVALID, status: StatusCodes.UNAUTHORIZED}

export const invalidBodyProblem = {title: "Invalid request body", errorCode: ErrorCode.INVALID_BODY, status: StatusCodes.BAD_REQUEST}

export const notAuthenticatedProblem = {title: "Not authenticated", errorCode: ErrorCode.NOT_AUTHENTICATED, status: StatusCodes.UNAUTHORIZED}

export const notActivatedProblem = {title: "Not activated user", errorCode: ErrorCode.NOT_ACTIVATED, status: StatusCodes.UNAUTHORIZED}

export const uidNotFoundProblem = {title: "UID not found", errorCode: ErrorCode.UID_NOT_FOUND, status: StatusCodes.NOT_FOUND}

export const twoFactorSetupRequiredProblem = {title: "Two-factor setup required", errorCode: ErrorCode.TWO_FACTOR_SETUP_REQUIRED, status: StatusCodes.PRECONDITION_REQUIRED}

export const twoFactorNotEnabledProblem = {title: "Two-factor not enabled", errorCode: ErrorCode.TWO_FACTOR_NOT_ENABLED, status: StatusCodes.PRECONDITION_FAILED}

export const invalidTwoFactorCodeProblem = {title: "Invalid two-factor code", errorCode: ErrorCode.INVALID_TWO_FACTOR_CODE, status: StatusCodes.BAD_REQUEST}

export const twoFactorAlreadyEnabledProblem = {title: "Two-factor already enabled", errorCode: ErrorCode.TWO_FACTOR_ALREADY_ENABLED, status: StatusCodes.CONFLICT}

export const invalidContentTypeProblem = {title: "Invalid content type", errorCode: ErrorCode.INVALID_CONTENT_TYPE, status: StatusCodes.UNSUPPORTED_MEDIA_TYPE}

export const invalidQueryParameterProblem = {title: "Invalid query parameter", errorCode: ErrorCode.INVALID_QUERY_PARAMETER, status: StatusCodes.BAD_REQUEST}

export const emailVerificationNotFoundProblem = {title: "Email verification not found", errorCode: ErrorCode.EMAIL_VERIFICATION_NOT_FOUND, status: StatusCodes.NOT_FOUND}

export const emailVerificationAlreadyVerifiedProblem = {title: "Email verification already verified", errorCode: ErrorCode.EMAIL_VERIFICATION_ALREADY_VERIFIED, status: StatusCodes.CONFLICT}

export const emailVerificationExpiredProblem = {title: "Email verification expired", errorCode: ErrorCode.EMAIL_VERIFICATION_EXPIRED, status: StatusCodes.GONE}

export const emailAlreadyUsedProblem = {title: "Email is already in use", errorCode: ErrorCode.EMAIL_ALREADY_USED, status: StatusCodes.CONFLICT}

export const usernameAlreadyUsedProblem = {title: "Username is already in use", errorCode: ErrorCode.USERNAME_ALREADY_USED, status: StatusCodes.CONFLICT}

export const profileNotFoundProblem = {title: "Profile not found", errorCode: ErrorCode.PROFILE_NOT_FOUND, status: StatusCodes.NOT_FOUND}

export const userNotFoundProblem = {title: "User not found", errorCode: ErrorCode.USER_NOT_FOUND, status: StatusCodes.NOT_FOUND}

export const dontFollowProfileProblem = {title: "Don't follow profile", errorCode: ErrorCode.DONT_FOLLOW_PROFILE, status: StatusCodes.FORBIDDEN}

export const badSessionProblem = {title: "Bad session", errorCode: ErrorCode.BAD_SESSION, status: StatusCodes.UNAUTHORIZED}

export const alreadyFollowProfileProblem = {title: "Already following profile", errorCode: ErrorCode.ALREADY_FOLLOW_PROFILE, status: StatusCodes.CONFLICT}

export const internalServerErrorProblem = {title: "Internal server error", errorCode: ErrorCode.INTERNAL_SERVER_ERROR, status: StatusCodes.INTERNAL_SERVER_ERROR}

export const cantFollowYourselfProblem = {title: "Can't following yourself", errorCode: ErrorCode.CANT_FOLLOW_YOURSELF, status: StatusCodes.BAD_REQUEST}

export const alreadyRequestProfileProblem = {title: "Already requesting follow profile", errorCode: ErrorCode.ALREADY_REQUEST_PROFILE, status: StatusCodes.CONFLICT}

export const cantUnfollowYourselfProblem = {title: "Can't unfollowing yourself", errorCode: ErrorCode.CANT_UNFOLLOW_YOURSELF, status: StatusCodes.BAD_REQUEST}

export const cantIgnoreYourselfProblem = {title: "Can't ignoring yourself", errorCode: ErrorCode.CANT_IGNORE_YOURSELF, status: StatusCodes.BAD_REQUEST}

export const dontRequestProfileProblem = {title: "Don't requesting profile", errorCode: ErrorCode.DONT_REQUEST_PROFILE, status: StatusCodes.BAD_REQUEST}

export const cantAcceptYourselfProblem = {title: "Can't accept yourself", errorCode: ErrorCode.CANT_ACCEPT_YOURSELF, status: StatusCodes.BAD_REQUEST}

export const cantDeleteFollowerYourselfProblem = {title: "Can't delete follower yourself", errorCode: ErrorCode.CANT_DELETE_FOLLOWER_YOURSELF, status: StatusCodes.BAD_REQUEST}

export const linkAlreadyUsedProblem = {title: "unique link is already in use", errorCode: ErrorCode.LINK_ALREADY_USED, status: StatusCodes.BAD_REQUEST}

export const alreadyMintedNftProblem = {
  title: "Already minted NFT",
  errorCode: ErrorCode.ALREADY_MINTED_NFT,
  status: StatusCodes.CONFLICT
}

export const notMintedNftProblem = {
  title: "Not minted NFT",
  errorCode: ErrorCode.NOT_MINTED_NFT,
  status: StatusCodes.NOT_FOUND
}

export const nftNotFoundProblem = {
  title: "NFT not found",
  errorCode: ErrorCode.NFT_NOT_FOUND,
  status: StatusCodes.NOT_FOUND
}

export const commentNotFoundProblem = {
  title: "Comment not found",
  errorCode: ErrorCode.COMMENT_NOT_FOUND,
  status: StatusCodes.NOT_FOUND
}

export const alreadyMintedCommentProblem = {
  title: "Already minted comment",
  errorCode: ErrorCode.ALREADY_MINTED_COMMENT,
  status: StatusCodes.CONFLICT
}

export const notMintedCommentProblem = {
  title: "Not minted comment",
  errorCode: ErrorCode.NOT_MINTED_COMMENT,
  status: StatusCodes.NOT_FOUND
}

const GetCode = z.object({
  errorCode: z.number().int().positive()
})

export function getErrorCodeFromProblem(e: any): ErrorCode {
  try {
    const parsed = GetCode.parse(e)

    return parsed.errorCode
  } catch {
    throw e
  }
}
