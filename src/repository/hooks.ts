import {
  registerUser,
  twoFactorAuthenticatorUserType, verifyExistUsername,
  verifyTwoFactorAuthenticatorTotpCode,
  verifyUserPassword
} from "@/repository/index"
import useSWRMutation from "swr/mutation"
import {
  RegisterUserRequest,
  TwoFactorAuthenticatorTypeRequest,
  VerifyPasswordRequest,
  VerifyTotpCodeRequest
} from "@/http/rest/types"
import useSWR from "swr"
import {useRef} from "react"

export function useVerifyUserPasswordByEmail() {
  const verifyUserPasswordFetcher = (_: any, {arg}: {
    arg: VerifyPasswordRequest
  }) => verifyUserPassword(arg)
  const { trigger, data, error, isMutating } = useSWRMutation("/api/auth/verify/password", verifyUserPasswordFetcher)

  return {
    verifyUserPassword: (req: VerifyPasswordRequest) => trigger(req),
    dataVerification: data,
    errorVerification: error,
    isFetchingVerification: isMutating
  }
}

export function useTwoFactorAuthenticatorUserType() {
  const twoFactorAuthenticatorUserTypeFetcher = (_: any, {arg}: {
    arg: TwoFactorAuthenticatorTypeRequest
  }) => twoFactorAuthenticatorUserType(arg)
  const { trigger, data, error, isMutating } = useSWRMutation("/api/auth/two-factor", twoFactorAuthenticatorUserTypeFetcher)

  return {
    twoFactorAuthenticatorUserType: (req: TwoFactorAuthenticatorTypeRequest) => trigger(req),
    dataTwoFactor: data,
    errorTwoFactor: error,
    isFetchingTwoFactor: isMutating
  }
}

export function useVerifyTwoFactorAuthenticatorTotpCode() {
  const verifyTwoFactorAuthenticatorTotpCodeFetcher = (_: any, {arg}: {
    arg: VerifyTotpCodeRequest
  }) => verifyTwoFactorAuthenticatorTotpCode(arg)
  const { trigger, data, error, isMutating } = useSWRMutation("/api/auth/verify/two-factor/totp", verifyTwoFactorAuthenticatorTotpCodeFetcher)

  return {
    verifyTwoFactorAuthenticatorTotpCode: (req: VerifyTotpCodeRequest) => trigger(req),
    dataVerification: data,
    errorVerification: error,
    isFetchingVerification: isMutating
  }
}

export function useVerifyExistUsername() {
  const aborter = useRef<AbortController>()
  const abort = () => aborter.current?.abort()

  const verifyExistUsernameFetcher = (_: any, {arg}: {
    arg: {username: string}
  }) => {
    aborter.current = new AbortController()
    const signal = aborter.current?.signal
    if (!signal) throw new Error("AbortController.signal is undefined")

    return verifyExistUsername(signal, arg.username)
  }
  const { trigger, data, error, isMutating } = useSWRMutation("/api/user/exist/username", verifyExistUsernameFetcher)

  return {
    verifyExistUsername: (username: string) => trigger({username}),
    abortVerification: abort,
    dataVerification: data,
    errorVerification: error,
    isFetchingVerification: isMutating
  }
}

export function useRegisterUser() {
  const registerUserFetcher = (_: any, {arg}: {
    arg: RegisterUserRequest
  }) => registerUser(arg)

  const { trigger, data, error, isMutating } = useSWRMutation("/api/user/register", registerUserFetcher)

  return {
    registerUser: (req: RegisterUserRequest) => trigger(req),
    dataRegister: data,
    errorRegister: error,
    isFetchingRegister: isMutating
  }
}
