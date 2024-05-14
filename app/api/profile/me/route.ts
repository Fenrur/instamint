import {auth, getSession} from "@/auth"
import {badSessionProblem, notAuthenticatedProblem, problem} from "@/http/problem"
import {profileService} from "@/services"
import {NextResponse} from "next/server"
import {MyProfileResponse} from "@/http/rest/types"

export const GET = auth(async (req) => {
  const session = getSession(req)

  if (!session) {
    return problem(notAuthenticatedProblem)
  }

  const userAndProfile = await profileService.findByUserUid(session.uid)

  if (!userAndProfile) {
    return problem({...badSessionProblem, detail: "your profile not found from your uid in session"})
  }

  const response: MyProfileResponse = userAndProfile.profile

  return NextResponse.json(response)
})
