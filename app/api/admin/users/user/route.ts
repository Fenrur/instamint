import {NextRequest, NextResponse} from "next/server"
import {
  invalidContentTypeProblem,
  problem,
  invalidQueryParameterProblem,
  badSessionProblem,
  notAuthenticatedProblem
} from "@/http/problem"
import {isContentType} from "@/http/content-type"
import {UserUpdate} from "@/http/rest/types"
import {getSession} from "@/auth"

import {userService} from "@/services"

const initialNumber = 0

export async function POST(req: NextRequest) {
  if (!isContentType(req, "form")) {
    return problem({...invalidContentTypeProblem, detail: "Content-Type must be application/x-www-form-urlencoded"})
  }
  const url = req.nextUrl.clone()
  const id = url.searchParams.get("id")
  const formData = await req.formData()
  const session = getSession(req)

  if (!session) {
    return problem({...notAuthenticatedProblem, detail: "you need to be authenticated to access"})
  }

  let parseId = initialNumber

  if (id) {
    parseId = parseInt(id)
  } else {
    return problem({...invalidQueryParameterProblem, detail: "id query parameter is required"})
  }

  const data = req.body
  let parsedFormData = null
  const enabled = formData.get("enabled")

  if (enabled && parseId) {
    userService.enableIsActivated(parseId)
  }

  if (!enabled && parseId) {
    userService.disableIsActivated(parseId)
  }

  try {
    parsedFormData = UserUpdate.parse(formData)

  } catch (e: any) {
    url.pathname = `/admin/users/${id}`
  }

  url.pathname = "/admin/users"

  const myUser = await userService.findByUid(session.uid)
  if (myUser && myUser.role !== "admin") {
    return problem({...badSessionProblem, detail: "you don't have the right permissions"})
  }

  return NextResponse.redirect(url)
}
