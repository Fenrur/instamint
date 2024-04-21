import {NextRequest, NextResponse} from "next/server"
import {
  createEmailVerification,
  findUnverifiedEmailAndInIntervalEmailVerifications,
  findUserByEmail,
} from "@/db/db-service"
import {invalidContentTypeProblem, problem} from "@/http/problem"
import {SignupCredentials} from "@/http/rest/types"
import {isContentType} from "@/http/content-type"
import {DateTime} from "luxon"
import {transporter} from "@/mail/mailer"
import {render} from "@react-email/render"
import VerificationEmail from "@/mail/templates/verification-email"
import {env} from "@/env"
import * as u from "node:url"

export async function POST(req: NextRequest) {
  if (!isContentType(req, "form")) {
    return problem({...invalidContentTypeProblem, detail: "Content-Type must be application/x-www-form-urlencoded"})
  }

  const createdAt = DateTime.now()
  const formData = await req.formData()
  let parsedFormData = null
  const url = req.nextUrl.clone()

  try {
    parsedFormData = SignupCredentials.parse(formData)
  } catch (e: any) {
    // TODO error ?
    url.pathname = "/signup"

    return NextResponse.redirect(url)
  }

  const emailDb = await findUserByEmail(parsedFormData.email)

  if (emailDb) {
    url.pathname = "/signup"

    return NextResponse.redirect(url)
  }

  const emailVerifications = await findUnverifiedEmailAndInIntervalEmailVerifications(
    parsedFormData.email,
    createdAt
  )

  if (emailVerifications && emailVerifications.length >= 5) {
    // TODO error ?
    url.pathname = "/signup"

    return NextResponse.redirect(url)
  }

  url.pathname = "/verification-email/sent"
  url.searchParams.set("email", parsedFormData.email)

  createEmailVerification(parsedFormData.email, createdAt)
    .then((verificationId) => {
      const verificationLink = u.format({
        host: env.BASE_URL,
        pathname: "/api/signup/verification-email",
        query: {vid: verificationId},
      })

      const emailHtml = render(VerificationEmail({
        baseUrl: env.BASE_URL,
        contactEmail: env.CONTACT_EMAIL,
        instamintImageUrl: env.BASE_URL + "/instamint.svg",
        verificationLink
      }))

      transporter.sendMail({
        to: parsedFormData.email,
        subject: "Verify email Instamint",
        html: emailHtml,
      })
    })

  return NextResponse.redirect(url)
}
