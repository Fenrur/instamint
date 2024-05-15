import {auth, getSession} from "@/auth"
import {NextResponse} from "next/server"
import {
  invalidContentTypeProblem,
  invalidBodyProblem,
  notAuthenticatedProblem,
  passwordIsInvalidProblem,
  problem, twoFactorAlreadyEnabledProblem, uidNotFoundProblem
} from "@/http/problem"
import qrcode from "qrcode"
import {TwoFactorAuthenticatorSetupRequest, TwoFactorAuthenticatorSetupResponse} from "@/http/rest/types"
import {isContentType} from "@/http/content-type"
import {authenticator} from "@/two-factor/otp"
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

  const bodyParsedResult = TwoFactorAuthenticatorSetupRequest.safeParse(await req.json())

  if (!bodyParsedResult.success) {
    return problem({...invalidBodyProblem, detail: bodyParsedResult.error.errors})
  }

  const body = bodyParsedResult.data
  const secret = authenticator().generateSecret(20)
  const result = await userService.setupTwoFactorAuthentification(session.uid, body.password, secret)

  switch (result) {
    case "uid_not_found":
      return problem({...uidNotFoundProblem, detail: `User with UID ${session.uid}`})

    case "invalid_password":
      return problem(passwordIsInvalidProblem)

    case "two_factor_already_enabled":
      return problem(twoFactorAlreadyEnabledProblem)

    case "setup_complete": {
      const keyUri = authenticator().keyuri(session.uid, "Instamint", secret)
      const dataUri = await qrcode.toDataURL(keyUri)
      const response: TwoFactorAuthenticatorSetupResponse = {
        secret,
        keyUri,
        dataUri
      }

      return NextResponse.json(response, {status: StatusCodes.OK})
    }
  }
})
