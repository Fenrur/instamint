import {auth, getSession} from "@/auth"
import {NextResponse} from "next/server"
import {
  invalidContentTypeProblem,
  invalidRequestBodyProblem,
  notAuthenticatedProblem,
  passwordIsInvalidProblem,
  problem, twoFactorAlreadyEnabledProblem, uidNotFoundProblem
} from "@/http/problem"
import qrcode from "qrcode"
import {setupTwoFactorAuthentification} from "@/db/db-service"
import {TwoFactorAuthenticatorSetupRequest, TwoFactorAuthenticatorSetupResponse} from "@/http/rest/types"
// @ts-expect-error TODO fix library not found
import {NextAuthRequest} from "next-auth/lib"
import {isContentType} from "@/http/content-type"
import {authenticator} from "@/two-factor/otp"

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
    parsedBody = TwoFactorAuthenticatorSetupRequest.parse(body)
  } catch (e: any) {
    return problem({...invalidRequestBodyProblem, detail: e.errors})
  }

  const secret = authenticator().generateSecret(20)
  const result = await setupTwoFactorAuthentification(session.uid, parsedBody.password, secret)

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

      return NextResponse.json(response)
    }
  }
})
