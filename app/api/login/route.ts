import {NextRequest, NextResponse} from "next/server"
import {findUserByEmail} from "@/db/db-service"
import {invalidContentTypeProblem, problem} from "@/http/problem"
import {LoginCredentials} from "@/http/rest/types"
import {isContentType} from "@/http/content-type"

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

  const emailDb = await findUserByEmail(parsedFormData.email)

  if (!emailDb) {
    url.pathname = "/login"

    return NextResponse.redirect(url)
  }

  url.pathname = "/login/credentials"
  url.searchParams.set("email", parsedFormData.email)

  return NextResponse.redirect(url)
}
