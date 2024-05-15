import {NextRequest, NextResponse} from "next/server"
import {VerifyPasswordRequest} from "@/http/rest/types"
import {
  emailNotFoundProblem,
  invalidContentTypeProblem,
  invalidBodyProblem,
  passwordIsInvalidProblem,
  problem
} from "@/http/problem"
import {isContentType} from "@/http/content-type"
import {userService} from "@/services"
import {StatusCodes} from "http-status-codes"

export async function POST(req: NextRequest) {
  if (!isContentType(req, "json")) {
    return problem({...invalidContentTypeProblem, detail: "Content-Type must be application/json"})
  }

  const bodyParsedResult = VerifyPasswordRequest.safeParse(await req.json())

  if (!bodyParsedResult.success) {
    return problem({...invalidBodyProblem, detail: bodyParsedResult.error.errors})
  }

  const body = bodyParsedResult.data
  const result = await userService.verifyPasswordByEmail(body.email, body.password)

  switch (result) {
    case "valid":
      return NextResponse.json({message: "valid"}, {status: StatusCodes.OK})

    case "invalid":
      return problem(passwordIsInvalidProblem)

    case "email_not_found":
      return problem(emailNotFoundProblem)
  }
}
