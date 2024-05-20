import {NextRequest, NextResponse} from "next/server"
import {DateTime} from "luxon"
import {passwordResetService} from "@/services"

export const dynamic = "force-dynamic"

export async function GET(req: NextRequest) {
  const url = req.nextUrl.clone()
  const resetId = url.searchParams.get("resetId")

  if (!resetId) {
    url.pathname = "/reset-password/invalid/url"

    return NextResponse.redirect(url)
  }

  const passwordReset = await passwordResetService.findByResetId(resetId)

  if (!passwordReset) {
    url.pathname = "/reset-password/invalid/url"

    return NextResponse.redirect(url)
  }


  if (!passwordReset.active) {
    url.pathname = "/reset-password/invalid/deactivated"

    return NextResponse.redirect(url)
  }

  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  const expireAt = DateTime.fromSQL(passwordReset.expireAt, {zone: "utc"})
  const now = DateTime.utc()

  if (now > expireAt) {
    url.pathname = "/reset-password/invalid/expired"

    return NextResponse.redirect(url)
  }

  url.pathname = "/forgot-password/password"

  return NextResponse.redirect(url)
}
