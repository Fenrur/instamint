import {NextResponse} from "next/server"
import {
  invalidContentTypeProblem,
  problem,
  invalidQueryParameterProblem,
  badSessionProblem,
  notAuthenticatedProblem,
  notActivatedProblem
} from "@/http/problem"
import {isContentType} from "@/http/content-type"
import {auth, getSession} from "@/auth"

import {userService, profileService} from "@/services"

export const POST  = auth(async (req) => {
  if (!isContentType(req, "form")) {
    return problem({...invalidContentTypeProblem, detail: "Content-Type must be application/x-www-form-urlencoded"})
  }

  const url = req.nextUrl.clone()
  const id = url.searchParams.get("id")
  const session = getSession(req)

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

  if (myUserAndProfile.role !== "admin") {
    return problem({...badSessionProblem, detail: "you don't have the right permissions"})
  }

  if (!id) {
    return problem({...invalidQueryParameterProblem, detail: "id query parameter is required"})
  }

  await userService.deleteUserById(id)

  url.pathname = "/admin/users"

  return NextResponse.redirect(url)
})
