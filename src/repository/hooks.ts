import {
  twoFactorAuthenticatorUserType,
  verifyTwoFactorAuthenticatorTotpCode,
  verifyUserPassword
} from "@/repository/index"
import useSWRMutation from "swr/mutation"
import {TwoFactorAuthenticatorTypeRequest, VerifyPasswordRequest, VerifyTotpCodeRequest} from "@/http/rest/types"

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
