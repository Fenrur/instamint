import {auth, getSession} from "@/auth"
import {badSessionProblem, notAuthenticatedProblem, problem, notActivated} from "@/http/problem"
import {profileService, userService} from "@/services"
import {NextResponse} from "next/server"
import {MyProfileResponse} from "@/http/rest/types"
import {StatusCodes} from "http-status-codes"

export const GET = auth(async (req) => {
  const session = getSession(req)

  if (!session) {
    return problem(notAuthenticatedProblem)
  }

  const userAndProfile = await profileService.findByUserUid(session.uid)

  if (!userAndProfile) {
    return problem({...badSessionProblem, detail: "your profile not found from your uid in session"})
  }

  const userActivated = await userService.findByUid(session.uid)

  if (userActivated && !userActivated.isActivated) {
    return problem({...notActivated, detail: "your are not enable to access the app"})
    return
  }

  const response: MyProfileResponse = userAndProfile.profile

  return NextResponse.json(response, {status: StatusCodes.OK})
})
