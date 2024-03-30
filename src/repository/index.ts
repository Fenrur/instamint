import {
  TwoFactorAuthenticatorTypeRequest,
  TwoFactorAuthenticatorTypeResponse,
  VerifyPasswordRequest, VerifyTotpCodeRequest
} from "@/http/rest/types"
import {getErrorCodeFromProblem} from "@/http/problem"
import {ErrorCode} from "@/http/error-code"

export async function verifyUserPassword(req: VerifyPasswordRequest) {
  const res = await fetch("/api/auth/verify/password", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(req)
  })

  if (res.status === 200) {
    return "password_valid"
  } else {
    const body = await res.json()
    const errorCode = getErrorCodeFromProblem(body)
    switch (errorCode) {
      case ErrorCode.EMAIL_NOT_FOUNT:
        return "email_not_found"
      case ErrorCode.PASSWORD_IS_INVALID:
        return "password_invalid"
    }

    throw new Error(`Undefined error code from server ${errorCode}`)
  }
}

export async function twoFactorAuthenticatorUserType(req: TwoFactorAuthenticatorTypeRequest) {
  const res = await fetch("/api/auth/two-factor", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(req)
  })

  if (res.status === 200) {
    const body = await res.json()
    return TwoFactorAuthenticatorTypeResponse.parse(body)
  } else {
    const body = await res.json()
    const errorCode = getErrorCodeFromProblem(body)
    switch (errorCode) {
      case ErrorCode.EMAIL_NOT_FOUNT:
        return "email_not_found"
      case ErrorCode.PASSWORD_IS_INVALID:
        return "password_invalid"
    }

    throw new Error(`Undefined error code from server ${errorCode}`)
  }
}

export async function verifyTwoFactorAuthenticatorTotpCode(req: VerifyTotpCodeRequest) {
  const res = await fetch("/api/auth/verify/two-factor/totp", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(req)
  })

  if (res.status === 200) {
    return "code_valid"
  } else {
    const body = await res.json()
    const errorCode = getErrorCodeFromProblem(body)
    switch (errorCode) {
      case ErrorCode.EMAIL_NOT_FOUNT:
        return "email_not_found"
      case ErrorCode.PASSWORD_IS_INVALID:
        return "password_invalid"
      case ErrorCode.TWO_FACTOR_NOT_ENABLED:
        return "two_factor_not_enabled"
      case ErrorCode.TWO_FACTOR_SETUP_REQUIRED:
        return "two_factor_setup_required"
      case ErrorCode.INVALID_TWO_FACTOR_CODE:
        return "invalid_totp_code"
    }

    throw new Error(`Undefined error code from server ${errorCode}`)
  }
}
