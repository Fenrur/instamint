import {NextRequest, NextResponse} from "next/server"
import {auth, getSession} from "@/auth"
import {notAuthenticatedProblem, problem, twoFactorSetupRequiredProblem, uidNotFoundProblem} from "@/http/http-problem"
import {HttpErrorCode} from "@/http/http-error-code"
import {enableTwoFactorAuthentification, findUserByUid} from "@/db/db-service"
// @ts-ignore
import {NextAuthRequest} from "next-auth/lib"

export const POST = auth(async (req: NextAuthRequest) => {
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
