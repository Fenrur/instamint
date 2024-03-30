import {NextRequest, NextResponse} from "next/server"
import {auth, getSession} from "@/auth"
import {
  invalidContentTypeProblem,
  notAuthenticatedProblem,
  problem,
  twoFactorSetupRequiredProblem,
  uidNotFoundProblem
} from "@/http/problem"
import {ErrorCode} from "@/http/error-code"
import {enableTwoFactorAuthentification, findUserByUid} from "@/db/db-service"
// @ts-ignore
import {NextAuthRequest} from "next-auth/lib"
import {isContentType} from "@/http/content-type"

export const POST = auth(async (req: NextAuthRequest) => {
  if (!isContentType(req, "json")) {
    return problem({...invalidContentTypeProblem, detail: "Content-Type must be application/json"})
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

  await enableTwoFactorAuthentification(session.uid)

  return NextResponse.json({message: "Two-factor authentication has been enabled"})
})
