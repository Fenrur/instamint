import {
  RegisterUserRequest, RegisterUserResponse,
  TwoFactorAuthenticatorTypeRequest,
  TwoFactorAuthenticatorTypeResponse, VerifyExistUsernameResponse,
  VerifyPasswordRequest,
  VerifyTotpCodeRequest
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
  }

  const errorCode = getErrorCodeFromProblem(await res.json())

  switch (errorCode) {
    case ErrorCode.EMAIL_NOT_FOUNT:
      return "email_not_found"

    case ErrorCode.PASSWORD_IS_INVALID:
      return "password_invalid"
  }

  throw new Error(`Undefined error code from server ${errorCode}`)
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
    return TwoFactorAuthenticatorTypeResponse.parse(await res.json())
  }

  const errorCode = getErrorCodeFromProblem(await res.json())

  switch (errorCode) {
    case ErrorCode.EMAIL_NOT_FOUNT:
      return "email_not_found"

    case ErrorCode.PASSWORD_IS_INVALID:
      return "password_invalid"
  }

  throw new Error(`Undefined error code from server ${errorCode}`)
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
  }

  const errorCode = getErrorCodeFromProblem(await res.json())

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

export async function verifyExistUsername(signal: AbortSignal, username: string) {
  const url = encodeURI("/api/user/exist?username=" + username)
  const res = await fetch(url, {
    method: "GET",
    signal: signal
  })

  if (res.status === 200) {
    return VerifyExistUsernameResponse.parse(await res.json())
  }

  throw new Error("Undefined error code from server")
}

export async function registerUser(req: RegisterUserRequest) {
  const res = await fetch("/api/user/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(req)
  })

  if (res.status === 201) {
    return RegisterUserResponse.parse(await res.json())
  }

  const errorCode = getErrorCodeFromProblem(await res.json())

  switch (errorCode) {
    case ErrorCode.EMAIL_VERIFICATION_NOT_FOUND:
      return "email_verification_not_found"

    case ErrorCode.EMAIL_VERIFICATION_ALREADY_VERIFIED:
      return "email_verification_already_verified"

    case ErrorCode.EMAIL_VERIFICATION_EXPIRED:
      return "email_verification_expired"

    case ErrorCode.EMAIL_ALREADY_USED:
      return "email_already_used"

    case ErrorCode.USERNAME_ALREADY_USED:
      return "username_already_used"
  }

  throw new Error(`Undefined error code from server ${errorCode}`)
}
