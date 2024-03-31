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
  let parsedFormData
  try {
    parsedFormData = LoginCredentials.parse(formData)
  } catch (e: any) {
    req.nextUrl.pathname = "/login"
    return NextResponse.redirect(req.nextUrl)
  }

  const emailDb = await findUserByEmail(parsedFormData.email)
  if (!emailDb) {
    req.nextUrl.pathname = "/login"
    return NextResponse.redirect(req.nextUrl)
  }

  req.nextUrl.pathname = "/login/credentials"
  req.nextUrl.searchParams.set("email", parsedFormData.email)
  req.nextUrl.searchParams.set("step", "password")

  return NextResponse.redirect(req.nextUrl)
}
