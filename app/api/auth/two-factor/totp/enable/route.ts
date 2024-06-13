import {NextResponse} from "next/server"
import {auth, getSession} from "@/auth"
import {
  invalidContentTypeProblem,
  notAuthenticatedProblem,
  problem, twoFactorAlreadyEnabledProblem,
  twoFactorSetupRequiredProblem,
  uidNotFoundProblem
} from "@/http/problem"
import {isContentType} from "@/http/content-type"
import {userService} from "@/services"
import {StatusCodes} from "http-status-codes"

export const POST = auth(async (req) => {
  if (!isContentType(req, "no_body")) {
    return problem({...invalidContentTypeProblem, detail: "Expected no body in the request"})
  }

  const session = getSession(req)

  if (!session) {
    return problem(notAuthenticatedProblem)
  }

  const user = await userService.findByUid(session.uid)

  if (!user) {
    return problem({...uidNotFoundProblem, detail: `User with UID ${session.uid}`})
  }

  if (!user.twoFactorSecret) {
    return problem({...twoFactorSetupRequiredProblem, detail: "TOTP secret is not defined"})
  }

  if (user.twoFactorEnabled) {
    return problem(twoFactorAlreadyEnabledProblem)
  }

  await userService.enableTwoFactorAuthentification(session.uid)

  return NextResponse.json({message: "Two-factor authentication has been enabled"}, {status: StatusCodes.OK})
})
