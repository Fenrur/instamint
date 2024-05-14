import {auth, getSession} from "@/auth"
import {
  badSessionProblem,
  dontFollowProfileProblem,
  invalidQueryParameterProblem,
  notAuthenticatedProblem,
  problem,
  profileNotFoundProblem
} from "@/http/problem"
import {usernameCharactersRegex} from "@/utils/validator"
import {followService, profileService} from "@/services"
import {SearchFollowsProfileResponse} from "@/http/rest/types"
import {NextResponse} from "next/server"

export const GET = auth(async (req) => {
  const session = getSession(req)
  const url = req.nextUrl.clone()

  if (!session) {
    return problem(notAuthenticatedProblem)
  }

  const myUserAndProfile = await profileService.findByUserUid(session.uid)

  if (!myUserAndProfile) {
    return problem({...badSessionProblem, detail: "user not found"})
  }

  const targetProfileUsername = url.searchParams.get("targetProfileUsername")
  const searchedUsername = url.searchParams.get("searchedUsername")

  if (!targetProfileUsername) {
    return problem({...invalidQueryParameterProblem, detail: "username query parameter is required"})
  }

  if (!searchedUsername) {
    return problem({...invalidQueryParameterProblem, detail: "searchedUsername query parameter is required"})
  }

  if (!searchedUsername) {
    return problem({...invalidQueryParameterProblem, detail: "searchedUsername query parameter is required"})
  }

  if (!usernameCharactersRegex.test(targetProfileUsername)) {
    return problem({...invalidQueryParameterProblem, detail: "username is invalid pattern"})
  }

  const targetProfile = await profileService.findByUsername(targetProfileUsername)

  if (!targetProfile) {
    return problem(profileNotFoundProblem)
  }

  if (targetProfile.id === myUserAndProfile.profile.id) {
    const response: SearchFollowsProfileResponse = await followService.searchFollowsProfile(
      myUserAndProfile.profile.id,
      myUserAndProfile.profile.id,
      searchedUsername
    )

    return NextResponse.json(response)
  }

  if (targetProfile.visibilityType === "public") {
    const response: SearchFollowsProfileResponse = await followService.searchFollowsProfile(
      targetProfile.id,
      myUserAndProfile.profile.id,
      searchedUsername
    )

    return NextResponse.json(response)
  }

  const followingState = await followService.getFollowState(myUserAndProfile.profile.id, targetProfile.id)

  if (followingState === "following") {
    const response: SearchFollowsProfileResponse = await followService.searchFollowsProfile(
      targetProfile.id,
      myUserAndProfile.profile.id,
      searchedUsername
    )

    return NextResponse.json(response)
  }

  return problem({...dontFollowProfileProblem, detail: `you are not following profile @${targetProfileUsername}`})
})
