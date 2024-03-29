import {NextRequest, NextResponse} from "next/server"
import {VerifyPasswordRequest} from "@/http/rest/types"
import {verifyUserPasswordByEmail} from "@/db/db-service"
import {HttpErrorCode} from "@/http/http-error-code"
import {emailNotFoundProblem, invalidRequestBodyProblem, passwordIsInvalidProblem, problem} from "@/http/http-problem"

export async function POST(req: NextRequest) {
  const body = await req.json()

  let parsedBody
  try {
    parsedBody = VerifyPasswordRequest.parse(body)
  } catch (e: any) {
    return problem({...invalidRequestBodyProblem, detail: e.errors})
  }

  const result = await verifyUserPasswordByEmail(parsedBody.email, parsedBody.password)

  switch (result) {
    case "valid":
      return NextResponse.json({message: "valid"})
    case "invalid":
      return problem(passwordIsInvalidProblem)
    case "email_not_found":
      return problem(emailNotFoundProblem)
  }
}
