import {NextRequest, NextResponse} from "next/server"
import {invalidContentTypeProblem, problem, notActivated} from "@/http/problem"
import {LoginCredentials} from "@/http/rest/types"
import {isContentType} from "@/http/content-type"
import {userService} from "@/services"

export async function POST(req: NextRequest) {
  if (!isContentType(req, "form")) {
    return problem({...invalidContentTypeProblem, detail: "Content-Type must be application/x-www-form-urlencoded"})
  }

  const formData = await req.formData()
  let parsedFormData = null
  const url = req.nextUrl.clone()

  try {
    parsedFormData = LoginCredentials.parse(formData)
  } catch (e: any) {
    url.pathname = "/login"

    return NextResponse.redirect(url)
  }

  const user = await userService.findByEmail(parsedFormData.email)

  if (!user) {
    url.pathname = "/login"
    url.searchParams.set("error", "email_not_found")

    return NextResponse.redirect(url)
  }

  if (!user.isActivated) {
    return problem({...notActivated, detail: "your are not enable to access the app"})
  }

  url.pathname = "/login/credentials"
  url.searchParams.set("email", parsedFormData.email)

  return NextResponse.redirect(url)
}
