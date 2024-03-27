import {NextRequest, NextResponse} from "next/server"
import {findUserByEmail} from "@/db/db-service"

export async function POST(req: NextRequest) {
  if (req.headers.get("content-type") !== "application/x-www-form-urlencoded") {
    return NextResponse.json({error: "Invalid content type"}, {status: 400})
  }

  const formData = await req.formData()
  const email = String(formData.get("email"))
  if (!email) {
    return NextResponse.json({error: "Email is required"}, {status: 400})
  }

  const emailDb = await findUserByEmail(email)
  console.log("emailDb", emailDb)
  if (emailDb === undefined) {
    req.nextUrl.pathname = "/login"
    return NextResponse.redirect(req.nextUrl)
  }

  req.nextUrl.pathname = "/login/credentials"
  req.nextUrl.searchParams.set("email", email)

  return NextResponse.redirect(req.nextUrl)
}
