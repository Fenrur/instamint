import {NextRequest, NextResponse} from "next/server"
import {auth, getSession} from "@/auth"
import {
  emailNotFoundProblem,
  invalidContentTypeProblem,
  invalidRequestBodyProblem, invalidTwoFactorCodeProblem,
  notAuthenticatedProblem,
  passwordIsInvalidProblem,
  problem, twoFactorNotEnabledProblem, twoFactorSetupRequiredProblem,
  uidNotFoundProblem
} from "@/http/problem"
import {VerifyTotpCodeRequest} from "@/http/rest/types"
import {verifyUserTotpCode} from "@/db/db-service"
import {isContentType} from "@/http/content-type"

export async function POST(req: NextRequest) {
  if (!isContentType(req, "json")) {
    return problem({...invalidContentTypeProblem, detail: "Content-Type must be application/json"})
  }

  const body = await req.json()
  let parsedBody
  try {
    parsedBody = VerifyTotpCodeRequest.parse(body)
  } catch (e: any) {
    return problem({...invalidRequestBodyProblem, detail: e.errors})
  }

  const result = await verifyUserTotpCode(parsedBody.email, parsedBody.password, parsedBody.totpCode)

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
