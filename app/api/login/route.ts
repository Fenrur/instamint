import {NextRequest, NextResponse} from "next/server"
import {invalidContentTypeProblem, problem, notActivatedProblem} from "@/http/problem"
import {LoginCredentials} from "@/http/rest/types"
import {isContentType} from "@/http/content-type"
import {userService} from "@/services"

export async function POST(req: NextRequest) {
  if (!isContentType(req, "form")) {
    return problem({...invalidContentTypeProblem, detail: "Content-Type must be application/x-www-form-urlencoded"})
  }

  const url = req.nextUrl.clone()
  const formDataParsedResult = LoginCredentials.safeParse(await req.formData())

  if (!formDataParsedResult.success) {
    url.pathname = "/login"

    return NextResponse.redirect(url)
  }

  const formData = formDataParsedResult.data
  const user = await userService.findByEmail(formData.email)

  if (!user) {
    url.pathname = "/login"
    url.searchParams.set("error", "email_not_found")

    return NextResponse.redirect(url)
  }

  if (!user.isActivated) {
    return problem({...notActivatedProblem, detail: "your are not enable to access the app"})
  }

  url.pathname = "/login/credentials"
  url.searchParams.set("email", formData.email)

  return NextResponse.redirect(url)
}
