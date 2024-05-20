import {auth, getSession} from "@/auth"
import {badSessionProblem, invalidQueryParameterProblem, notAuthenticatedProblem, problem, notActivated} from "@/http/problem"
import {followService, profileService, userService} from "@/services"
import {NextResponse} from "next/server"
import {PaginatedRequestersFollowProfileResponse} from "@/http/rest/types"

export const GET = auth(async (req) => {
  const session = getSession(req)
  const url = req.nextUrl.clone()

  if (!session) {
    return problem(notAuthenticatedProblem)
  }

  const ignored = url.searchParams.get("ignored")
  const page = url.searchParams.get("page")

  if (!ignored) {
    return problem({...invalidQueryParameterProblem, detail: "ignored (boolean) is required"})
  }

  if (!page) {
    return problem({...invalidQueryParameterProblem, detail: "page (number) is required"})
  }

  const parsedIgnored = ignored.toLowerCase() === "true"
  const parsedPage = parseInt(page, 10)

  if (isNaN(parsedPage)) {
    return problem({...invalidQueryParameterProblem, detail: "page is invalid number"})
  }

  if (parsedPage < 1) {
    return problem({...invalidQueryParameterProblem, detail: "page must be greater than 0"})
  }

  const myUserAndProfile = await profileService.findByUserUid(session.uid)

  if (!myUserAndProfile) {
    return problem({...badSessionProblem, detail: "your profile not found from your uid in session"})
  }

  const userActivated = await userService.findByUid(session.uid)

  if (userActivated && !userActivated.isActivated) {
    return problem({...notActivated, detail: "your are not enable to access the app"})
  }

  let result = null

  if (parsedIgnored) {
    result = await followService.findIgnoredRequestFollowsPaginatedAndSorted(
      myUserAndProfile.profile.id,
      parsedPage
    )
  } else {
    result = await followService.findRequestFollowsPaginatedAndSorted(
      myUserAndProfile.profile.id,
      parsedPage
    )
  }

  const response: PaginatedRequestersFollowProfileResponse = result

  return NextResponse.json(response)
})
