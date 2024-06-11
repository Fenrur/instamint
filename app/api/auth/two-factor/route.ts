import {NextRequest, NextResponse} from "next/server"
import {TwoFactorAuthenticatorTypeRequest, TwoFactorAuthenticatorTypeResponse} from "@/http/rest/types"
import {
  emailNotFoundProblem,
  invalidContentTypeProblem,
  invalidBodyProblem,
  passwordIsInvalidProblem,
  problem,
} from "@/http/problem"
import {isPasswordValid} from "@/utils/password"
import {isContentType} from "@/http/content-type"
import { env } from "@/env"
import {userService} from "@/services"
import {StatusCodes} from "http-status-codes"

export async function POST(req: NextRequest) {
  if (!isContentType(req, "json")) {
    return problem({...invalidContentTypeProblem, detail: "Content-Type must be application/json"})
  }

  const bodyParsedResult = TwoFactorAuthenticatorTypeRequest.safeParse(await req.json())

  if (!bodyParsedResult.success) {
    return problem({...invalidBodyProblem, detail: bodyParsedResult.error.errors})
  }

  const body = bodyParsedResult.data
  const user = await userService.findByEmail(body.email)

  if (!user) {
    return problem(emailNotFoundProblem)
  }

  if (!await isPasswordValid(body.password, user.hashedPassword, env.PEPPER_PASSWORD_SECRET)) {
    return problem(passwordIsInvalidProblem)
  }

  const response: TwoFactorAuthenticatorTypeResponse = {
    type: user.twoFactorEnabled ? "totp" : "none"
  }

  return NextResponse.json(response, {status: StatusCodes.OK})
}
