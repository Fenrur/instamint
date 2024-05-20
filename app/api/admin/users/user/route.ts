import {NextRequest, NextResponse} from "next/server"
import {invalidContentTypeProblem, problem, invalidQueryParameterProblem} from "@/http/problem"
import {isContentType} from "@/http/content-type"
import {UserUpdate} from "@/http/rest/types"

import {userService} from "@/services"

const initialNumber = 0

export async function POST(req: NextRequest) {
  if (!isContentType(req, "form")) {
    return problem({...invalidContentTypeProblem, detail: "Content-Type must be application/x-www-form-urlencoded"})
  }
  const url = req.nextUrl.clone()
  const id = url.searchParams.get("id")
  const formData = await req.formData()
  const parseId = initialNumber

  if (id) {
    const parseId = parseInt(id)
  } else {
    return problem({...invalidQueryParameterProblem, detail: "id query parameter is required"})
  }

  const data = req.body
  let parsedFormData = null
  const enabled = formData.get("enabled")
  if (enabled && id) {
    userService.enableIsActivated(parseId)
  }
  if (!enabled && id) {
    userService.disableIsActivated(parseId)
  }
  formData.get
  try {
    parsedFormData = UserUpdate.parse(formData)

  } catch (e: any) {
    url.pathname = `/admin/users/${id}`
  }

  url.pathname = "/admin/users"

  return NextResponse.redirect(url)
}
