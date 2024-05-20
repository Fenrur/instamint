import {auth, getSession} from "@/auth"
import {badSessionProblem, notAuthenticatedProblem, problem, notActivated} from "@/http/problem"
import {followService, profileService, userService} from "@/services"
import {NextResponse} from "next/server"
import {StatusCodes} from "http-status-codes"

export const PUT = auth(async (req) => {
  const session = getSession(req)

  if (!session) {
    return problem(notAuthenticatedProblem)
  }

  const myUserAndProfile = await profileService.findByUserUid(session.uid)

  if (!myUserAndProfile) {
    return problem({...badSessionProblem, detail: "your profile not found from your uid in session"})
  }

  const userActivated = await userService.findByUid(session.uid)

  if (userActivated && !userActivated.isActivated) {
    return problem({...notActivated, detail: "your are not enable to access the app"})
  }

  await followService.ignoreAllRequestFollows(myUserAndProfile.profile.id)

  return NextResponse.json({ignoredAll: true}, {status: StatusCodes.OK})
})
