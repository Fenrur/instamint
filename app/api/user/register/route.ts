import {NextRequest, NextResponse} from "next/server"
import {createUser} from "@/db/db-service"
import {isContentType} from "@/http/content-type"
import {
  emailAlreadyUsedProblem,
  emailVerificationAlreadyVerifiedProblem,
  emailVerificationExpiredProblem,
  emailVerificationNotFoundProblem,
  invalidContentTypeProblem,
  problem, usernameAlreadyUsedProblem
} from "@/http/problem"
import {DateTime} from "luxon"
import {RegisterUserRequest, RegisterUserResponse} from "@/http/rest/types"
import {render} from "@react-email/render"
import {env} from "@/env"
import {transporter} from "@/mail/mailer"
import {RegisteringUser} from "@/mail/templates/registering-user"

async function sendRegisteredEmail(body: RegisterUserRequest, result: { uid: string; email: string }) {
  const emailHtml = render(RegisteringUser({
    baseUrl: env.BASE_URL,
    contactEmail: env.CONTACT_EMAIL,
    instamintImageUrl: `${env.BASE_URL}/instamint.svg`,
    username: body.username,
    profileLink: `${env.BASE_URL}/profile/${body.username}`,
  }))

  await transporter.sendMail({
    to: result.email,
    subject: "Registered on Instamint",
    html: emailHtml,
  })
}

export const POST = async (req: NextRequest) => {
  if (!isContentType(req, "json")) {
    return problem({...invalidContentTypeProblem, detail: "Content-Type must be application/json"})
  }

  const createdAt = DateTime.now()
  const body = await req.json()

  let parsedBody = null

  try {
    parsedBody = RegisterUserRequest.parse(body)
  } catch (e: any) {
    return NextResponse.json({message: e.errors}, {status: 400})
  }

  const result = await createUser(
    parsedBody.password,
    parsedBody.username,
    parsedBody.emailVerificationId, createdAt
  )

  switch (result) {
    case "email_verification_not_found":
      return problem(emailVerificationNotFoundProblem)

    case "email_verification_already_verified":
      return problem(emailVerificationAlreadyVerifiedProblem)

    case "email_verification_expired":
      return problem(emailVerificationExpiredProblem)

    case "email_already_used":
      return problem(emailAlreadyUsedProblem)

    case "username_already_used":
      return problem(usernameAlreadyUsedProblem)
  }

  const response: RegisterUserResponse = {
    uid: result.uid
  }

  // eslint-disable-next-line @typescript-eslint/no-floating-promises
  sendRegisteredEmail(parsedBody, result)

  return NextResponse.json(response, {status: 201})
}
