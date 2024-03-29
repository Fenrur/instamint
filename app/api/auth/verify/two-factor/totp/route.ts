import {NextRequest, NextResponse} from "next/server"
import {auth, getSession} from "@/auth"
import {
  invalidRequestBodyProblem, invalidTwoFactorCodeProblem,
  notAuthenticatedProblem,
  passwordIsInvalidProblem,
  problem, twoFactorNotEnabledProblem, twoFactorSetupRequiredProblem,
  uidNotFoundProblem
} from "@/http/http-problem"
import {VerifyTotpCodeRequest} from "@/http/rest/types"
import {verifyUserTotpCode} from "@/db/db-service"

export async function POST(req: NextRequest) {
  const session = getSession(req)
  if (!session) {
    return problem(notAuthenticatedProblem)
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
      return problem(uidNotFoundProblem)
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
