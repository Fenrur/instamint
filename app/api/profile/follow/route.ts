import {auth, getSession} from "@/auth"
import {
  alreadyFollowProfileProblem,
  alreadyRequestProfileProblem,
  badSessionProblem,
  cantFollowYourselfProblem,
  cantUnfollowYourselfProblem,
  dontFollowProfileProblem,
  invalidBodyProblem,
  invalidContentTypeProblem,
  invalidQueryParameterProblem,
  notAuthenticatedProblem,
  problem,
  profileNotFoundProblem,
  notActivatedProblem
} from "@/http/problem"
import {
  FollowProfileRequest,
  FollowProfileResponse,
  PaginatedFollowProfileResponse,
  UnfollowProfileRequest,
  UnfollowProfileResponse
} from "@/http/rest/types"
import {followService, profileService} from "@/services"
import {DateTime} from "luxon"
import {NextResponse} from "next/server"
import {usernameRegex} from "@/utils/validator"
import {isContentType} from "@/http/content-type"
import {StatusCodes} from "http-status-codes"

export const POST = auth(async (req) => {
  if (isContentType(req, "json")) {
    const session = getSession(req)
    const followAt = DateTime.utc()

    if (!session) {
      return problem(notAuthenticatedProblem)
    }

    const bodyParsedResult = FollowProfileRequest.safeParse(await req.json())

    if (!bodyParsedResult.success) {
      return problem({...invalidBodyProblem, detail: bodyParsedResult.error.errors})
    }

    const body = bodyParsedResult.data
    const myUserAndProfile = await profileService.findByUserUid(session.uid)

    if (!myUserAndProfile) {
      return problem({...badSessionProblem, detail: "your profile not found from your uid in session"})
    }

    if (!myUserAndProfile.isActivated) {
      return problem({...notActivatedProblem, detail: "your are not enable to access the app"})
    }

    const targetProfile = await profileService.findByUsername(body.username)

    if (!targetProfile) {
      return problem({...profileNotFoundProblem, detail: "target profile not fount"})
    }

    const followOrRequestResult = await followService.followOrRequest(myUserAndProfile.profile.id, targetProfile.id, followAt)

    switch (followOrRequestResult) {
      case "requested_follow":
        return NextResponse.json({
          type: "requesting_follow"
        } satisfies FollowProfileResponse, {status: StatusCodes.OK})

      case "followed":
        return NextResponse.json({
          type: "followed"
        } satisfies FollowProfileResponse, {status: StatusCodes.OK})

      case "cant_follow_yourself":
        return problem(cantFollowYourselfProblem)

      case "already_following":
        return problem(alreadyFollowProfileProblem)

      case "already_request_follow":
        return problem({...alreadyRequestProfileProblem, detail: `@${body.username} requesting to follow`})

      case "followed_profile_not_found":
        return problem(profileNotFoundProblem)
    }
  } else if (isContentType(req, "form")) {
    const session = getSession(req)
    const followAt = DateTime.utc()
    const url = req.nextUrl.clone()
    const formData = await req.formData()
    const username = formData.get("username")

    if (!username || typeof username !== "string") {
      url.pathname = `/`

      return NextResponse.redirect(url)
    }

    if (!session) {
      url.pathname = `/profile/${username}`

      return NextResponse.redirect(url)
    }

    const myUserAndProfile = await profileService.findByUserUid(session.uid)

    if (!myUserAndProfile) {
      url.pathname = `/profile/${username}`

      return NextResponse.redirect(url)
    }

    if (myUserAndProfile.profile.username.toLowerCase() === username.toLowerCase()) {
      url.pathname = `/profile/${username}`

      return NextResponse.redirect(url)
    }

    const targetProfile = await profileService.findByUsername(username)

    if (!targetProfile) {
      url.pathname = `/profile/${username}`

      return NextResponse.redirect(url)
    }

    const followState = await followService.getFollowState(myUserAndProfile.profile.id, targetProfile.id)

    if (followState === "following" || followState === "requesting_follow" || followState === "ignored_request_follow") {
      await followService.unfollowOrUnrequest(myUserAndProfile.profile.id, targetProfile.id)
      url.pathname = `/profile/${username}`

      return NextResponse.redirect(url)
    }

    await followService.followOrRequest(myUserAndProfile.profile.id, targetProfile.id, followAt)
    url.pathname = `/profile/${username}`

    return NextResponse.redirect(url)
  }

  return problem({
    ...invalidContentTypeProblem,
    detail: "Content-Type must be application/json or application/x-www-form-urlencoded"
  })
})

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

  const page = url.searchParams.get("page")
  const username = url.searchParams.get("username")

  if (!page) {
    return problem({...invalidQueryParameterProblem, detail: "page query parameter is required"})
  }

  if (!username) {
    return problem({...invalidQueryParameterProblem, detail: "username query parameter is required"})
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
    const response: PaginatedFollowProfileResponse = await followService.findFollowsPaginatedAndSorted(
      myUserAndProfile.profile.id,
      myUserAndProfile.profile.id,
      parsedPage
    )

    return NextResponse.json(response, {status: StatusCodes.OK})
  }

  const targetProfile = await profileService.findByUsername(username)

  if (!targetProfile) {
    return problem(profileNotFoundProblem)
  }

  if (targetProfile.visibilityType === "private") {
    const followState = await followService.getFollowState(myUserAndProfile.profile.id, targetProfile.id)

    if (followState !== "following") {
      return problem({
        ...dontFollowProfileProblem,
        detail: `@${username} is private, you must follow to see the follows`
      })
    }
  }

  const response: PaginatedFollowProfileResponse = await followService.findFollowsPaginatedAndSorted(
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

  const bodyParsedResult = UnfollowProfileRequest.safeParse(await req.json())

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

  const unfollowOrUnrequestResult = await followService.unfollowOrUnrequest(myUserAndProfile.profile.id, targetProfile.id)

  switch (unfollowOrUnrequestResult) {
    case "cant_unfollow_yourself":
      return problem(cantUnfollowYourselfProblem)

    case "unfollowed":
      return NextResponse.json({
        type: "unfollowed"
      } satisfies UnfollowProfileResponse, {status: StatusCodes.OK})

    case "unrequested_follow":
      return NextResponse.json({
        type: "unrequested_follow"
      } satisfies UnfollowProfileResponse, {status: StatusCodes.OK})

    case "not_following":
      return problem(dontFollowProfileProblem)
  }
})

