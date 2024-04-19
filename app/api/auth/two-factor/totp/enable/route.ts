import {NextResponse} from "next/server"
import {auth, getSession} from "@/auth"
import {
  invalidContentTypeProblem,
  notAuthenticatedProblem,
  problem, twoFactorAlreadyEnabledProblem,
  twoFactorSetupRequiredProblem,
  uidNotFoundProblem
} from "@/http/problem"
import {enableTwoFactorAuthentification, findUserByUid} from "@/db/db-service"
// @ts-expect-error TODO fix library not found
import {NextAuthRequest} from "next-auth/lib"
import {isContentType} from "@/http/content-type"

export const POST = auth(async (req: NextAuthRequest) => {
  if (!isContentType(req, "no_body")) {
    return problem({...invalidContentTypeProblem, detail: "Expected no body in the request"})
  }

  const session = getSession(req)

  if (!session) {
    return problem(notAuthenticatedProblem)
  }

  const user = await findUserByUid(session.uid)

  if (!user) {
    return problem({...uidNotFoundProblem, detail: `User with UID ${session.uid}`})
  }

  if (!user.twoFactorSecret) {
    return problem({...twoFactorSetupRequiredProblem, detail: "TOTP secret is not defined"})
  }

  if (user.twoFactorEnabled) {
    return problem(twoFactorAlreadyEnabledProblem)
  }

  await enableTwoFactorAuthentification(session.uid)

  return NextResponse.json({message: "Two-factor authentication has been enabled"})
})
