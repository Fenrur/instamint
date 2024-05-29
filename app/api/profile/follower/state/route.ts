import {auth, getSession} from "@/auth"
import {
  badSessionProblem,
  invalidQueryParameterProblem,
  notAuthenticatedProblem,
  problem,
  profileNotFoundProblem,
  notActivatedProblem
} from "@/http/problem"
import {followService, profileService} from "@/services"
import {NextResponse} from "next/server"
import {FollowerProfileStateResponse} from "@/http/rest/types"
import {usernameRegex} from "@/utils/validator"
import {StatusCodes} from "http-status-codes"

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

  if (!myUserAndProfile.isActivated) {
    return problem({...notActivatedProblem, detail: "your are not enable to access the app"})
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

  const followerState = await followService.getFollowState(targetProfile.id, myUserAndProfile.profile.id)
  const response: FollowerProfileStateResponse = {
    state: followerState
  }

  return NextResponse.json(response, {status: StatusCodes.OK})
})
