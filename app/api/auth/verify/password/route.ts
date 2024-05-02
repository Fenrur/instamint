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

export async function POST(req: NextRequest) {
  if (!isContentType(req, "json")) {
    return problem({...invalidContentTypeProblem, detail: "Content-Type must be application/json"})
  }

  const body = await req.json()

  let parsedBody = null

  try {
    parsedBody = VerifyPasswordRequest.parse(body)
  } catch (e: any) {
    return problem({...invalidBodyProblem, detail: e.errors})
  }

  const result = await userService.verifyPasswordByEmail(parsedBody.email, parsedBody.password)

  switch (result) {
    case "valid":
      return NextResponse.json({message: "valid"})

    case "invalid":
      return problem(passwordIsInvalidProblem)

    case "email_not_found":
      return problem(emailNotFoundProblem)
  }
}
