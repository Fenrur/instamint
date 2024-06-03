import {auth, getSession} from "@/auth"
import {
  badSessionProblem,
  cantDeleteFollowerYourselfProblem,
  dontFollowProfileProblem,
  internalServerErrorProblem,
  invalidBodyProblem,
  invalidContentTypeProblem,
  invalidQueryParameterProblem,
  notAuthenticatedProblem,
  problem,
  profileNotFoundProblem,
  notActivatedProblem
} from "@/http/problem"
import {DeleteFollowerProfileRequest, PaginatedFollowerProfileResponse} from "@/http/rest/types"
import {followService, profileService} from "@/services"
import {NextResponse} from "next/server"
import {usernameRegex} from "@/utils/validator"
import {isContentType} from "@/http/content-type"
import {StatusCodes} from "http-status-codes"

export const GET = auth(async (req) => {
  const session = getSession(req)
  const url = req.nextUrl.clone()

  if (!session) {
    return problem(notAuthenticatedProblem)
  }

  const page = url.searchParams.get("page")
  const username = url.searchParams.get("username")
  const myUserAndProfile = await profileService.findByUserUid(session.uid)

  if (!myUserAndProfile) {
    return problem({...badSessionProblem, detail: "your profile not found from your uid in session"})
  }

  if (!myUserAndProfile.isActivated) {
    return problem({...notActivatedProblem, detail: "your are not enable to access the app"})
  }

  if (!page || !username) {
    return problem({...invalidQueryParameterProblem, detail: "page and username query parameter is required"})
  }

  if (!usernameRegex.test(username)) {
    return problem({...invalidQueryParameterProblem, detail: "username is invalid pattern"})
  }

  const parsedPage = parseInt(page, 10)

  if (isNaN(parsedPage)) {
    return problem({...invalidQueryParameterProblem, detail: "page is invalid number"})
  }

  if (parsedPage < 1) {
    return problem({...invalidQueryParameterProblem, detail: "page must be greater than 0"})
  }

  if (myUserAndProfile.profile.username.toLowerCase() === username.toLowerCase()) {
    const response: PaginatedFollowerProfileResponse = await followService.findFollowersPaginatedAndSorted(
      myUserAndProfile.profile.id,
      myUserAndProfile.profile.id,
      parsedPage
    )

    return NextResponse.json(response, {status: StatusCodes.OK})
  }

  const targetProfile = await profileService.findByUsername(username)

  if (!targetProfile) {
    return problem({...profileNotFoundProblem, detail: "target profile not fount"})
  }

  if (targetProfile.visibilityType === "private") {
    const followState = await followService.getFollowState(myUserAndProfile.profile.id, targetProfile.id)

    if (followState !== "following") {
      return problem({
        ...dontFollowProfileProblem,
        detail: `@${username} is private, you must follow to see the followers`
      })
    }
  }

  const response: PaginatedFollowerProfileResponse = await followService.findFollowersPaginatedAndSorted(
    targetProfile.id,
    myUserAndProfile.profile.id,
    parsedPage
  )

  return NextResponse.json(response, {status: StatusCodes.OK})
})

export const DELETE = auth(async (req) => {
  if (!isContentType(req, "json")) {
    return problem({...invalidContentTypeProblem, detail: "Content-Type must be application/json"})
  }

  const session = getSession(req)

  if (!session) {
    return problem(notAuthenticatedProblem)
  }

  const bodyParsedResult = DeleteFollowerProfileRequest.safeParse(await req.json())

  if (!bodyParsedResult.success) {
    return problem({...invalidBodyProblem, detail: bodyParsedResult.error.errors})
  }

  const body = bodyParsedResult.data
  const myUserAndProfile = await profileService.findByUserUid(session.uid)

  if (!myUserAndProfile) {
    return problem({...badSessionProblem, detail: "your profile not found from your uid in session"})
  }

  const targetProfile = await profileService.findByUsername(body.username)

  if (!targetProfile) {
    return problem({...profileNotFoundProblem, detail: "target profile not fount"})
  }

  const unfollowOrUnrequestResult = await followService.unfollowOrUnrequest(targetProfile.id, myUserAndProfile.profile.id)

  switch (unfollowOrUnrequestResult) {
    case "cant_unfollow_yourself":
      return problem({...cantDeleteFollowerYourselfProblem, detail: "You can't delete yourself as a follower"})

    case "unfollowed":
      return NextResponse.json({deleted: true}, {status: StatusCodes.OK})

    case "unrequested_follow":
      return problem(internalServerErrorProblem)

    case "not_following":
      return problem({...dontFollowProfileProblem, detail: `@${body.username} not following you`})
  }
})
