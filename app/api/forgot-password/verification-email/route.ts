import {NextRequest, NextResponse} from "next/server";
import {DateTime} from "luxon";
import {emailVerificationService} from "@/services";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const url = req.nextUrl.clone();
  const verificationId = url.searchParams.get("vid");

  if (!verificationId) {
    url.pathname = "/verification-email/invalid/url";
    return NextResponse.redirect(url);
  }

  const emailVerification = await emailVerificationService.findByVerificationId(verificationId)

  if (!emailVerification) {
    url.pathname = "/verification-email/invalid/url"

    return NextResponse.redirect(url)
  }

  if (emailVerification.isVerified) {
    url.pathname = "/verification-email/invalid/already-used"

    return NextResponse.redirect(url)
  }

  const expireAt = DateTime.fromSQL(emailVerification.expireAt, {zone: "utc"});
  const now = DateTime.now();

  if (now > expireAt) {
    url.pathname = "/verification-email/invalid/expired"

    return NextResponse.redirect(url)
  }

  url.pathname = "/forgot-password/password"

  return NextResponse.redirect(url)
}
