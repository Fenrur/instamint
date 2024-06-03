import {auth, getSession} from "@/auth"
import {
  badSessionProblem,
  invalidQueryParameterProblem,
  notAuthenticatedProblem,
  problem,
  notActivatedProblem
} from "@/http/problem"
import {followService, profileService} from "@/services"
import {usernameCharactersRegex} from "@/utils/validator"
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

  const searchedUsername = url.searchParams.get("searchedUsername")
  const ignored = url.searchParams.get("ignored")

  if (!searchedUsername) {
    return problem({...invalidQueryParameterProblem, detail: "searchedUsername query parameter is required"})
  }

  if (!ignored) {
    return problem({...invalidQueryParameterProblem, detail: "ignored query parameter is required"})
  }

  if (!usernameCharactersRegex.test(searchedUsername)) {
    return problem({...invalidQueryParameterProblem, detail: "username is invalid pattern"})
  }

  const response = await followService.searchRequesterProfile(
    myUserAndProfile.profile.id,
    ignored.toLowerCase() === "true",
    searchedUsername
  )

  return NextResponse.json(response, {status: StatusCodes.OK})
})
