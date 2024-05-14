import {ErrorCode} from "@/http/error-code"
import {NextResponse} from "next/server"
import {z} from "zod"

interface Problem {
  status: number
  errorCode: ErrorCode
  title: string
  detail?: string
  type?: string
}

export function problem(Problem: Problem) {
  const problem = NextResponse.json(Problem, {status: Problem.status})
  problem.headers.set("Content-Type", "application/problem+json")

  return problem
}

export const emailNotFoundProblem = {title: "Email not found", errorCode: ErrorCode.EMAIL_NOT_FOUNT, status: 404}

export const passwordIsInvalidProblem = {title: "Password is invalid", errorCode: ErrorCode.PASSWORD_IS_INVALID, status: 403}

export const invalidBodyProblem = {title: "Invalid request body", errorCode: ErrorCode.INVALID_BODY, status: 400}

export const notAuthenticatedProblem = {title: "Not authenticated", errorCode: ErrorCode.NOT_AUTHENTICATED, status: 401}

export const uidNotFoundProblem = {title: "UID not found", errorCode: ErrorCode.UID_NOT_FOUND, status: 404}

export const twoFactorSetupRequiredProblem = {title: "Two-factor setup required", errorCode: ErrorCode.TWO_FACTOR_SETUP_REQUIRED, status: 400}

export const twoFactorNotEnabledProblem = {title: "Two-factor not enabled", errorCode: ErrorCode.TWO_FACTOR_NOT_ENABLED, status: 400}

export const invalidTwoFactorCodeProblem = {title: "Invalid two-factor code", errorCode: ErrorCode.INVALID_TWO_FACTOR_CODE, status: 400}

export const twoFactorAlreadyEnabledProblem = {title: "Two-factor already enabled", errorCode: ErrorCode.TWO_FACTOR_ALREADY_ENABLED, status: 400}

export const invalidContentTypeProblem = {title: "Invalid content type", errorCode: ErrorCode.INVALID_CONTENT_TYPE, status: 400}

export const invalidQueryParameterProblem = {title: "Invalid query parameter", errorCode: ErrorCode.INVALID_QUERY_PARAMETER, status: 400}

export const emailVerificationNotFoundProblem = {title: "Email verification not found", errorCode: ErrorCode.EMAIL_VERIFICATION_NOT_FOUND, status: 404}

export const emailVerificationAlreadyVerifiedProblem = {title: "Email verification already verified", errorCode: ErrorCode.EMAIL_VERIFICATION_ALREADY_VERIFIED, status: 400}

export const emailVerificationExpiredProblem = {title: "Email verification expired", errorCode: ErrorCode.EMAIL_VERIFICATION_EXPIRED, status: 400}

export const emailAlreadyUsedProblem = {title: "Email is already in use", errorCode: ErrorCode.EMAIL_ALREADY_USED, status: 400}

export const usernameAlreadyUsedProblem = {title: "Username is already in use", errorCode: ErrorCode.USERNAME_ALREADY_USED, status: 400}

export const profileNotFoundProblem = {title: "Profile not found", errorCode: ErrorCode.PROFILE_NOT_FOUND, status: 404}

export const userNotFoundProblem = {title: "User not found", errorCode: ErrorCode.USER_NOT_FOUND, status: 404}

export const dontFollowProfileProblem = {title: "Don't follow profile", errorCode: ErrorCode.DONT_FOLLOW_PROFILE, status: 400}

export const badSessionProblem = {title: "Bad session", errorCode: ErrorCode.BAD_SESSION, status: 400}

export const alreadyFollowProfileProblem = {title: "Already following profile", errorCode: ErrorCode.ALREADY_FOLLOW_PROFILE, status: 400}

export const internalServerErrorProblem = {title: "Internal server error", errorCode: ErrorCode.INTERNAL_SERVER_ERROR, status: 500}

export const cantFollowYourselfProblem = {title: "Can't following yourself", errorCode: ErrorCode.CANT_FOLLOW_YOURSELF, status: 400}

export const alreadyRequestProfileProblem = {title: "Already requesting follow profile", errorCode: ErrorCode.ALREADY_REQUEST_PROFILE, status: 400}

export const cantUnfollowYourselfProblem = {title: "Can't unfollowing yourself", errorCode: ErrorCode.CANT_UNFOLLOW_YOURSELF, status: 400}

export const cantIgnoreYourselfProblem = {title: "Can't ignoring yourself", errorCode: ErrorCode.CANT_IGNORE_YOURSELF, status: 400}

export const dontRequestProfileProblem = {title: "Don't requesting profile", errorCode: ErrorCode.DONT_REQUEST_PROFILE, status: 400}

export const cantAcceptYourselfProblem = {title: "Can't accept yourself", errorCode: ErrorCode.CANT_ACCEPT_YOURSELF, status: 400}

export const cantDeleteFollowerYourselfProblem = {title: "Can't delete follower yourself", errorCode: ErrorCode.CANT_DELETE_FOLLOWER_YOURSELF, status: 400}

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
