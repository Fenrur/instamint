import {NextRequest, NextResponse} from "next/server"
import {TwoFactorAuthenticatorTypeRequest, TwoFactorAuthenticatorTypeResponse} from "@/http/rest/types"
import {
  emailNotFoundProblem,
  invalidContentTypeProblem,
  invalidBodyProblem,
  passwordIsInvalidProblem,
  problem
} from "@/http/problem"
import {isPasswordValid} from "@/utils/password"
import {isContentType} from "@/http/content-type"
import { env } from "@/env"
import {userService} from "@/services"

export async function POST(req: NextRequest) {
  if (!isContentType(req, "json")) {
    return problem({...invalidContentTypeProblem, detail: "Content-Type must be application/json"})
  }

  const body = await req.json()

  let parsedBody = null

  try {
    parsedBody = TwoFactorAuthenticatorTypeRequest.parse(body)
  } catch (e: any) {
    return problem({...invalidBodyProblem, detail: e.errors})
  }

  const user = await userService.findByEmail(parsedBody.email)

  if (!user) {
    return problem(emailNotFoundProblem)
  }

  if (!await isPasswordValid(parsedBody.password, user.hashedPassword, env.PEPPER_PASSWORD_SECRET)) {
    return problem(passwordIsInvalidProblem)
  }

  const response: TwoFactorAuthenticatorTypeResponse = {
    type: user.twoFactorEnabled ? "totp" : "none"
  }

  return NextResponse.json(response)
}
