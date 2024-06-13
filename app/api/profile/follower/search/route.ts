import {auth, getSession} from "@/auth"
import {
  badSessionProblem, dontFollowProfileProblem,
  invalidQueryParameterProblem,
  notAuthenticatedProblem,
  problem,
  profileNotFoundProblem,
  notActivatedProblem
} from "@/http/problem"
import {usernameCharactersRegex} from "@/utils/validator"
import {followService, profileService} from "@/services"
import {SearchFollowersProfileResponse} from "@/http/rest/types"
import {NextResponse} from "next/server"
import {StatusCodes} from "http-status-codes"

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

  if (!myUserAndProfile.isActivated) {
    return problem({...notActivatedProblem, detail: "your are not enable to access the app"})
  }

  const targetProfileUsername = url.searchParams.get("targetProfileUsername")
  const searchedUsername = url.searchParams.get("searchedUsername")

  if (!targetProfileUsername) {
    return problem({...invalidQueryParameterProblem, detail: "username query parameter is required"})
  }

  if (!searchedUsername) {
    return problem({...invalidQueryParameterProblem, detail: "searchedUsername query parameter is required"})
  }

  if (!usernameCharactersRegex.test(searchedUsername)) {
    return problem({...invalidQueryParameterProblem, detail: "targetProfileUsername must be alphanumeric and _"})
  }

  const targetProfile = await profileService.findByUsername(targetProfileUsername)

  if (!targetProfile) {
    return problem(profileNotFoundProblem)
  }

  if (targetProfile.id === myUserAndProfile.profile.id) {
    const response: SearchFollowersProfileResponse = await followService.searchFollowersProfile(
      myUserAndProfile.profile.id,
      myUserAndProfile.profile.id,
      searchedUsername
    )

    return NextResponse.json(response, {status: StatusCodes.OK})
  }

  if (targetProfile.visibilityType === "public") {
    const response: SearchFollowersProfileResponse = await followService.searchFollowersProfile(
      targetProfile.id,
      myUserAndProfile.profile.id,
      searchedUsername
    )

    return NextResponse.json(response, {status: StatusCodes.OK})
  }

  const followingState = await followService.getFollowState(myUserAndProfile.profile.id, targetProfile.id)

  if (followingState === "following") {
    const response: SearchFollowersProfileResponse = await followService.searchFollowersProfile(
      targetProfile.id,
      myUserAndProfile.profile.id,
      searchedUsername
    )

    return NextResponse.json(response, {status: StatusCodes.OK})
  }

  return problem({...dontFollowProfileProblem, detail: `you are not following profile @${targetProfileUsername}`})
})
