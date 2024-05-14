import {auth, getSession} from "@/auth"
import {badSessionProblem, notAuthenticatedProblem, problem} from "@/http/problem"
import {followService, profileService} from "@/services"
import {NextResponse} from "next/server"

export const PUT = auth(async (req) => {
  const session = getSession(req)

  if (!session) {
    return problem(notAuthenticatedProblem)
  }

  const myUserAndProfile = await profileService.findByUserUid(session.uid)

  if (!myUserAndProfile) {
    return problem({...badSessionProblem, detail: "your profile not found from your uid in session"})
  }

  await followService.ignoreAllRequestFollows(myUserAndProfile.profile.id)

  return NextResponse.json({ignoredAll: true}, {status: 200})
})
