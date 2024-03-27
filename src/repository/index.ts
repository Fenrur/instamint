import type {VerifyUserPasswordRequest} from "@/repository/types"
import {getErrorCodeFromProblem} from "@/http/http-problem"
import {HttpErrorCode} from "@/http/http-error-code"

export async function verifyUserPassword(req: VerifyUserPasswordRequest) {
  const res = await fetch("/api/login/verify/password", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(req)
  })

  console.log(res.status)

  if (res.status === 200) {
    return "password_valid"
  } else {
    const body = await res.json()
    const errorCode = getErrorCodeFromProblem(body)
    switch (errorCode) {
      case HttpErrorCode.EMAIL_NOT_FOUNT:
        return "email_not_found"
      case HttpErrorCode.PASSWORD_IS_INVALID:
        return "password_invalid"
    }

    throw new Error(`Undefined error code from server ${errorCode}`)
  }
}
