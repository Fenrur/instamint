import {NextResponse} from "next/server"
import {
  problem,
  invalidQueryParameterProblem,
  badSessionProblem,
  notAuthenticatedProblem,
  notActivatedProblem
} from "@/http/problem"
import {auth, getSession} from "@/auth"

import {userService, profileService} from "@/services"

const initialNumber = 0

export const PUT  = auth(async (req) => {
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

  let parseId = initialNumber

  if (id) {
    parseId = parseInt(id, 10)
  } else {
    return problem({...invalidQueryParameterProblem, detail: "id query parameter is required"})
  }

  const user = await userService.findWithId(parseId)

  if (user[0].isActivated) {
    await userService.disableIsActivated(parseId)
  } else {
    await userService.enableIsActivated(parseId)
  }

  url.pathname = "/admin/users"

  return NextResponse.redirect(url)
})
