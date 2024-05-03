import {NextRequest, NextResponse} from "next/server"
import {
  emailNotFoundProblem,
  invalidContentTypeProblem,
  invalidBodyProblem, invalidTwoFactorCodeProblem,
  passwordIsInvalidProblem,
  problem, twoFactorNotEnabledProblem, twoFactorSetupRequiredProblem,
} from "@/http/problem"
import {VerifyTotpCodeRequest} from "@/http/rest/types"
import {isContentType} from "@/http/content-type"
import {userService} from "@/services"

export async function POST(req: NextRequest) {
  if (!isContentType(req, "json")) {
    return problem({...invalidContentTypeProblem, detail: "Content-Type must be application/json"})
  }

  const body = await req.json()
  let parsedBody = null

  try {
    parsedBody = VerifyTotpCodeRequest.parse(body)
  } catch (e: any) {
    return problem({...invalidBodyProblem, detail: e.errors})
  }

  const result = await userService.verifyPasswordAndTotpCodeByEmail(parsedBody.email, parsedBody.password, parsedBody.totpCode)

  switch (result) {
    case "email_not_found":
      return problem(emailNotFoundProblem)

    case "invalid_password":
      return problem(passwordIsInvalidProblem)

    case "two_factor_not_enabled":
      return problem(twoFactorNotEnabledProblem)

    case "two_factor_no_secret":
      return problem(twoFactorSetupRequiredProblem)

    case "invalid_totp_code":
      return problem(invalidTwoFactorCodeProblem)

    case "valid":
      return NextResponse.json({message: "TOTP code is valid"})
  }
}
