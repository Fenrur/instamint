import {NextRequest, NextResponse} from "next/server"
import {invalidContentTypeProblem, problem} from "@/http/problem"
import {SignupCredentials} from "@/http/rest/types"
import {isContentType} from "@/http/content-type"
import {DateTime} from "luxon"
import {transporter} from "@/mail/mailer"
import {render} from "@react-email/render"
import VerificationEmail from "@/mail/templates/verification-email"
import {env} from "@/env"
import * as u from "node:url"
import {emailVerificationService, userService} from "@/services"

async function createVerificationAndSendEmail(formData: SignupCredentials, createdAt: DateTime<true>) {
  const verificationId = await emailVerificationService.create(formData.email, createdAt)
  const verificationLink = u.format({
    host: env.BASE_URL,
    pathname: "/api/signup/verification-email",
    query: {vid: verificationId},
  })
  const emailHtml = render(VerificationEmail({
    baseUrl: env.BASE_URL,
    contactEmail: env.CONTACT_EMAIL,
    instamintImageUrl: `${env.BASE_URL}/instamint.svg`,
    verificationLink,
  }))

  await transporter.sendMail({
    to: formData.email,
    subject: "Verify email Instamint",
    html: emailHtml,
  })
}

export async function POST(req: NextRequest) {
  if (!isContentType(req, "form")) {
    return problem({...invalidContentTypeProblem, detail: "Content-Type must be application/x-www-form-urlencoded"})
  }

  const createdAt = DateTime.utc()
  const url = req.nextUrl.clone()
  const formDataParsedResult = SignupCredentials.safeParse(await req.formData())

  if (!formDataParsedResult.success) {
    url.pathname = "/signup"

    return NextResponse.redirect(url)
  }

  const formData = formDataParsedResult.data
  const emailDb = await userService.findByEmail(formData.email)

  if (emailDb) {
    url.pathname = "/signup"
    url.searchParams.set("error", "email_exists")

    return NextResponse.redirect(url)
  }

  const emailVerifications = await emailVerificationService.findUnverifiedAndBeforeExpirationByEmail(
    formData.email,
    createdAt
  )

  if (emailVerifications && emailVerifications.length >= 5) {
    url.pathname = "/signup"
    url.searchParams.set("error", "email_verification_limit_exceeded")

    return NextResponse.redirect(url)
  }

  url.pathname = "/verification-email/sent"
  url.searchParams.set("email", formData.email)

  // eslint-disable-next-line @typescript-eslint/no-floating-promises
  createVerificationAndSendEmail(formData, createdAt)

  return NextResponse.redirect(url)
}
