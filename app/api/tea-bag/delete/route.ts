import {auth, getSession} from "@/auth"
// @ts-expect-error TODO fix library not found
import {NextAuthRequest} from "next-auth/lib"
import {invalidQueryParameterProblem, notAuthenticatedProblem, problem, userNotFoundProblem} from "@/http/problem"
import {profileService} from "@/services"
import {NextResponse} from "next/server"
import {StatusCodes} from "http-status-codes"

export const POST = auth(async (req: NextAuthRequest) => {
  const formData = await req.json()
  const profileId = formData.profileId as number

  if (!profileId) {
    return problem({...invalidQueryParameterProblem, detail: "profileId is required"})
  }

  const session = getSession(req)

  if (!session) {
    return problem({...notAuthenticatedProblem, detail: "you need to be authenticated to see this private profile"})
  }

  const myUserAndProfile = await profileService.findByUserUid(session.uid)

  if (!myUserAndProfile) {
    return problem({...userNotFoundProblem, detail: "my user not found"})
  }

  const result = await profileService.deleteProfile(profileId)

  return NextResponse.json({result}, {status: StatusCodes.OK})
})
