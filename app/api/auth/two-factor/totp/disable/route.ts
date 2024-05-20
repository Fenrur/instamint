import {NextResponse} from "next/server"
import {auth, getSession} from "@/auth"
import {
  invalidContentTypeProblem,
  invalidBodyProblem, invalidTwoFactorCodeProblem,
  notAuthenticatedProblem,
  passwordIsInvalidProblem,
  problem, twoFactorNotEnabledProblem, twoFactorSetupRequiredProblem,
  uidNotFoundProblem
} from "@/http/problem"
import {TwoFactorAuthenticatorDisableRequest} from "@/http/rest/types"
import {isContentType} from "@/http/content-type"
import {userService} from "@/services"
import {StatusCodes} from "http-status-codes"

export const POST = auth(async (req) => {
  if (!isContentType(req, "json")) {
    return problem({...invalidContentTypeProblem, detail: "Content-Type must be application/json"})
  }

  const session = getSession(req)

  if (!session) {
    return problem(notAuthenticatedProblem)
  }

  const bodyParsedResult = TwoFactorAuthenticatorDisableRequest.safeParse(await req.json())

  if (!bodyParsedResult.success) {
    return problem({...invalidBodyProblem, detail: bodyParsedResult.error.errors})
  }

  const body = bodyParsedResult.data
  const result = await userService.verifyPasswordAndTotpCodeByUid(session.uid, body.password, body.totpCode)

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

      return NextResponse.json({message: "Two-factor authentication has been disabled"}, {status: StatusCodes.OK})
  }
})
