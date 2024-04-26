import {NextResponse} from "next/server"
import {auth, getSession} from "@/auth"
import {
  invalidContentTypeProblem,
  invalidRequestBodyProblem, invalidTwoFactorCodeProblem,
  notAuthenticatedProblem,
  passwordIsInvalidProblem,
  problem, twoFactorNotEnabledProblem, twoFactorSetupRequiredProblem,
  uidNotFoundProblem
} from "@/http/problem"
import {TwoFactorAuthenticatorDisableRequest} from "@/http/rest/types"
// @ts-expect-error TODO fix library not found
import {NextAuthRequest} from "next-auth/lib"
import {isContentType} from "@/http/content-type"
import {userService} from "@/services"

export const POST = auth(async (req: NextAuthRequest) => {
  if (!isContentType(req, "json")) {
    return problem({...invalidContentTypeProblem, detail: "Content-Type must be application/json"})
  }

  const session = getSession(req)

  if (!session) {
    return problem(notAuthenticatedProblem)
  }

  const body = await req.json()

  let parsedBody = null

  try {
    parsedBody = TwoFactorAuthenticatorDisableRequest.parse(body)
  } catch (e: any) {
    return problem({...invalidRequestBodyProblem, detail: e.errors})
  }

  const result = await userService.verifyPasswordAndTotpCodeByUid(session.uid, parsedBody.password, parsedBody.totpCode)

  switch (result) {
    case "uid_not_found":
      return problem({...uidNotFoundProblem, detail: `User with UID ${session.uid}`})

    case "invalid_password":
      return problem(passwordIsInvalidProblem)

    case "two_factor_not_enabled":
      return problem(twoFactorNotEnabledProblem)

    case "two_factor_no_secret":
      return problem(twoFactorSetupRequiredProblem)

    case "invalid_totp_code":
      return problem(invalidTwoFactorCodeProblem)

    case "valid":
      await userService.disableTwoFactorAuthentification(session.uid)

    return NextResponse.json({message: "Two-factor authentication has been disabled"})
  }
})
