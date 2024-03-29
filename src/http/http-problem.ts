import {HttpErrorCode} from "@/http/http-error-code"
import {NextResponse} from "next/server"
import {z} from "zod"

interface Problem {
  status: number
  errorCode: HttpErrorCode
  title: string
  detail?: string
  type?: string
}

export function problem(Problem: Problem) {
  const problem = NextResponse.json(Problem, {status: Problem.status})
  problem.headers.set("Content-Type", "application/problem+json")
  return problem
}

export const emailNotFoundProblem = {title: "Email not found", errorCode: HttpErrorCode.EMAIL_NOT_FOUNT, status: 404}
export const passwordIsInvalidProblem = {title: "Password is invalid", errorCode: HttpErrorCode.PASSWORD_IS_INVALID, status: 403}
export const invalidRequestBodyProblem = {title: "Invalid request body", errorCode: HttpErrorCode.INVALID_REQUEST_BODY, status: 400}
export const notAuthenticatedProblem = {title: "Not authenticated", errorCode: HttpErrorCode.NOT_AUTHENTICATED, status: 401}
export const uidNotFoundProblem = {title: "UID not found", errorCode: HttpErrorCode.UID_NOT_FOUND, status: 404}
export const twoFactorSetupRequiredProblem = {title: "Two-factor setup required", errorCode: HttpErrorCode.TWO_FACTOR_SETUP_REQUIRED, status: 400}
export const twoFactorNotEnabledProblem = {title: "Two-factor not enabled", errorCode: HttpErrorCode.TWO_FACTOR_NOT_ENABLED, status: 400}
export const invalidTwoFactorCodeProblem = {title: "Invalid two-factor code", errorCode: HttpErrorCode.INVALID_TWO_FACTOR_CODE, status: 400}
export const twoFactorAlreadyEnabledProblem = {title: "Two-factor already enabled", errorCode: HttpErrorCode.TWO_FACTOR_ALREADY_ENABLED, status: 400}

const GetCode = z.object({
  errorCode: z.number().int().positive()
})

export function getErrorCodeFromProblem(e: any): HttpErrorCode {
  try {
    const parsed = GetCode.parse(e)
    return parsed.errorCode
  } catch {
    throw e
  }
}
