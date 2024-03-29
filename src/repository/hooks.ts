import {twoFactorAuthenticatorUserType, verifyUserPassword} from "@/repository/index"
import useSWRMutation from "swr/mutation"
import {useLogin} from "@/store"
import {TwoFactorAuthenticatorTypeRequest, VerifyPasswordRequest} from "@/http/rest/types"

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
