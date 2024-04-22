import {NextRequest, NextResponse} from "next/server"
import {findEmailVerificationByVerificationId} from "@/db/db-service"
import {DateTime} from "luxon"

export async function GET(req: NextRequest) {
  const url = req.nextUrl.clone()
  const verificationId = url.searchParams.get("vid")

  if (!verificationId) {
    url.pathname = "/verification-email/invalid/url"
    return NextResponse.redirect(url)
  }

  const emailVerification = await findEmailVerificationByVerificationId(verificationId)

  if (!emailVerification) {
    url.pathname = "/verification-email/invalid/url"
    return NextResponse.redirect(url)
  }

  if (emailVerification.isVerified) {
    url.pathname = "/verification-email/invalid/already-used"
    return NextResponse.redirect(url)
  }

  const expireAt = DateTime.fromSQL(emailVerification.expireAt, {zone: "utc"})
  const now = DateTime.now()

  if (now > expireAt) {
    url.pathname = "/verification-email/invalid/expired"
    return NextResponse.redirect(url)
  }

  url.pathname = "/signup/password"
  return NextResponse.redirect(url)
}
