import {NextRequest, NextResponse} from "next/server"
import {TwoFactorAuthenticatorTypeRequest, TwoFactorAuthenticatorTypeResponse} from "@/http/rest/types"
import {
  emailNotFoundProblem,
  invalidContentTypeProblem,
  invalidRequestBodyProblem,
  passwordIsInvalidProblem,
  problem
} from "@/http/problem"
import {ErrorCode} from "@/http/error-code"
import {findUserByEmail} from "@/db/db-service"
import {isPasswordValid} from "@/utils/password"
import {isContentType} from "@/http/content-type"

export async function POST(req: NextRequest) {
  if (!isContentType(req, "json")) {
    return problem({...invalidContentTypeProblem, detail: "Content-Type must be application/json"})
  }

  const body = await req.json()

  let parsedBody;
  try {
    parsedBody = TwoFactorAuthenticatorTypeRequest.parse(body)
  } catch (e: any) {
    return problem({...invalidRequestBodyProblem, detail: e.errors})
  }

  const user = await findUserByEmail(parsedBody.email)
  if (!user) {
    return problem(emailNotFoundProblem)
  }

  if (!await isPasswordValid(parsedBody.password, user.hashedPassword)) {
    return problem(passwordIsInvalidProblem)
  }

  const response: TwoFactorAuthenticatorTypeResponse = {
    type: user.twoFactorEnabled ? "totp" : "none"
  }

  return NextResponse.json(response)
}
