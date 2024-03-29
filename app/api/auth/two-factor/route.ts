import {NextRequest, NextResponse} from "next/server"
import {TwoFactorAuthenticatorTypeRequest, TwoFactorAuthenticatorTypeResponse} from "@/http/rest/types"
import {emailNotFoundProblem, invalidRequestBodyProblem, passwordIsInvalidProblem, problem} from "@/http/http-problem"
import {HttpErrorCode} from "@/http/http-error-code"
import {findUserByEmail} from "@/db/db-service"
import {isPasswordValid} from "@/utils/password"

export async function POST(req: NextRequest) {
  const body = await req.json()

  let parsedBody;
  try {
    parsedBody = TwoFactorAuthenticatorTypeRequest.parse(body)
  } catch (e: any) {
    return problem({...invalidRequestBodyProblem, detail: e.errors})
  }

  const user = await findUserByEmail(parsedBody.email)
  if (!user) {
    return problem(emailNotFoundProblem)
  }

  if (!await isPasswordValid(parsedBody.password, user.hashedPassword)) {
    return problem(passwordIsInvalidProblem)
  }

  const response: TwoFactorAuthenticatorTypeResponse = {
    type: user.twoFactorEnabled ? "totp" : "none"
  }

  return NextResponse.json(response)
}
