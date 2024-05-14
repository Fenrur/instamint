import {auth, getSession} from "@/auth"
import {
  badSessionProblem,
  invalidQueryParameterProblem,
  notAuthenticatedProblem,
  problem,
  profileNotFoundProblem
} from "@/http/problem"
import {followService, profileService} from "@/services"
import {FollowProfileStateResponse} from "@/http/rest/types"
import {NextResponse} from "next/server"
import {usernameRegex} from "@/utils/validator"

export const GET = auth(async (req) => {
  const session = getSession(req)
  const url = req.nextUrl.clone()

  if (!session) {
    return problem(notAuthenticatedProblem)
  }

  const myUserAndProfile = await profileService.findByUserUid(session.uid)

  if (!myUserAndProfile) {
    return problem({...badSessionProblem, detail: "your profile not found from your uid in session"})
  }

  const targetUsername = url.searchParams.get("username")

  if (!targetUsername) {
    return problem({...invalidQueryParameterProblem, detail: "username query parameter is required"})
  }

  if (!usernameRegex.test(targetUsername)) {
    return problem({...invalidQueryParameterProblem, detail: "username query parameter is invalid"})
  }

  if (targetUsername.toLowerCase() === myUserAndProfile.profile.username.toLowerCase()) {
    return problem({...invalidQueryParameterProblem, detail: "username query parameter is same as your username"})
  }

  const targetProfile = await profileService.findByUsername(targetUsername)

  if (!targetProfile) {
    return problem({...profileNotFoundProblem, detail: "target profile not fount"})
  }

  const followState = await followService.getFollowState(myUserAndProfile.profile.id, targetProfile.id)
  const response: FollowProfileStateResponse = {
    state: followState === "ignored_request_follow" ? "requesting_follow" : followState
  }

  return NextResponse.json(response)
})
