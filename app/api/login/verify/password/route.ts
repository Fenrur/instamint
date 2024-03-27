import {NextRequest, NextResponse} from "next/server"
import {VerifyUserPasswordRequest} from "@/repository/types"
import {verifyUserPassword} from "@/db/db-service"
import {HttpErrorCode} from "@/http/http-error-code"
import {problem} from "@/http/http-problem"

export async function POST(req: NextRequest) {
  const body = await req.json()

  let parsedBody
  try {
    parsedBody = VerifyUserPasswordRequest.parse(body)
  } catch (e: any) {
    return NextResponse.json({message: e.errors}, {status: 400})
  }

  const result = await verifyUserPassword(parsedBody.email, parsedBody.password)

  switch (result) {
    case "valid":
      return NextResponse.json({message: "valid"})
    case "invalid":
      return problem({title: "Password is invalid", errorCode: HttpErrorCode.PASSWORD_IS_INVALID, status: 403})
    case "email_not_found":
      return problem({title: "Email not found", errorCode: HttpErrorCode.EMAIL_NOT_FOUNT, status: 404})
  }
}
