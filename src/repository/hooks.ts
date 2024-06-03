import {
  acceptAllRequestFollowProfile,
  acceptRequestFollowProfile,
  deleteFollowerProfile,
  fetchProfileData,
  deleteUser, enableOrDisableUser,
  followProfile,
  ignoreAllRequestFollowProfile,
  ignoreRequestFollowProfile,
  registerUser,
  searchFollowersProfile,
  searchRequesterProfile,
  twoFactorAuthenticatorUserType,
  unfollowProfile,
  verifyExistUsername,
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
import {useRef} from "react"
import useSWR from "swr"

export function useFollowProfile(username: string) {
  const followProfileFetcher = () => followProfile({username})
  const {trigger, data, error, isMutating} = useSWRMutation(`FollowProfile/${username}`, followProfileFetcher)

  return {
    followProfile: () => trigger(),
    dataFollow: data,
    errorFollow: error,
    isFetchingFollow: isMutating
  }
}

export function useUnfollowProfile(username: string) {
  const unfollowProfileFetcher = () => unfollowProfile({username})
  const {trigger, data, error, isMutating} = useSWRMutation(`UnfollowProfile/${username}`, unfollowProfileFetcher)

  return {
    unfollowProfile: () => trigger(),
    dataUnfollow: data,
    errorUnfollow: error,
    isFetchingUnfollow: isMutating
  }
}

export function useDeleteFollowerProfile(username: string) {
  const deleteFollowerProfileFetcher = () => deleteFollowerProfile({username})
  const {
    trigger,
    data,
    error,
    isMutating
  } = useSWRMutation(`DeleteFollowerProfile/${username}`, deleteFollowerProfileFetcher)

  return {
    deleteFollowerProfile: () => trigger(),
    dataDelete: data,
    errorDelete: error,
    isFetchingDelete: isMutating
  }
}

export function useSearchRequesterProfile() {
  const aborter = useRef<AbortController>()
  const abort = () => aborter.current?.abort()
  const searchRequesterProfileFetcher = (_: any, {arg}: {
    arg: { username: string }
  }) => {
    aborter.current = new AbortController()
    const signal = aborter.current?.signal

    if (!signal) {
      throw new Error("AbortController.signal is undefined")
    }

    return searchRequesterProfile(signal, arg.username, false)
  }
  const {trigger, data, error, isMutating} = useSWRMutation("SearchRequesterProfile", searchRequesterProfileFetcher)

  return {
    searchRequesterProfile: (username: string) => trigger({username}),
    abortSearch: abort,
    dataSearch: data,
    errorSearch: error,
    isFetchingSearch: isMutating
  }
}

export function useSearchIgnoredRequesterProfile() {
  const aborter = useRef<AbortController>()
  const abort = () => aborter.current?.abort()
  const searchIgnoredRequesterProfileFetcher = (_: any, {arg}: {
    arg: { username: string }
  }) => {
    aborter.current = new AbortController()
    const signal = aborter.current?.signal

    if (!signal) {
      throw new Error("AbortController.signal is undefined")
    }

    return searchRequesterProfile(signal, arg.username, true)
  }
  const {
    trigger,
    data,
    error,
    isMutating
  } = useSWRMutation("SearchIgnoredRequesterProfile", searchIgnoredRequesterProfileFetcher)

  return {
    searchIgnoredRequesterProfile: (username: string) => trigger({username}),
    abortSearchIgnored: abort,
    dataSearchIgnored: data,
    errorSearchIgnored: error,
    isFetchingSearchIgnored: isMutating
  }
}

export function useAcceptAllRequestFollowProfile() {
  const acceptAllRequestFollowProfileFetcher = () => acceptAllRequestFollowProfile({ignored: false})
  const {
    trigger,
    data,
    error,
    isMutating
  } = useSWRMutation("AcceptAllRequestFollowProfile", acceptAllRequestFollowProfileFetcher)

  return {
    acceptAllRequestFollowProfile: () => trigger(),
    dataAcceptAll: data,
    errorAcceptAll: error,
    isFetchingAcceptAll: isMutating
  }
}

export function useAcceptAllIgnoredRequestFollowProfile() {
  const acceptAllIgnoredRequestFollowProfileFetcher = () => acceptAllRequestFollowProfile({ignored: true})
  const {
    trigger,
    data,
    error,
    isMutating
  } = useSWRMutation("AcceptAllIgnoredRequestFollowProfile", acceptAllIgnoredRequestFollowProfileFetcher)

  return {
    acceptAllIgnoredRequestFollowProfile: () => trigger(),
    dataAcceptAllIgnored: data,
    errorAcceptAllIgnored: error,
    isFetchingAcceptAllIgnored: isMutating
  }
}

export function useIgnoreAllRequestFollowProfile() {
  const ignoreAllRequestFollowProfileFetcher = () => ignoreAllRequestFollowProfile()
  const {
    trigger,
    data,
    error,
    isMutating
  } = useSWRMutation("IgnoreAllRequestFollowProfile", ignoreAllRequestFollowProfileFetcher)

  return {
    ignoreAllRequestFollowProfile: () => trigger(),
    dataIgnoreAll: data,
    errorIgnoreAll: error,
    isFetchingIgnoreAll: isMutating
  }
}

export function useAcceptFollowProfile(username: string) {
  const acceptFollowProfileFetcher = () => acceptRequestFollowProfile({username})
  const {
    trigger,
    data,
    error,
    isMutating
  } = useSWRMutation(`AcceptFollowProfile/${username}`, acceptFollowProfileFetcher)

  return {
    acceptFollowProfile: () => trigger(),
    dataAccept: data,
    errorAccept: error,
    isFetchingAccept: isMutating
  }
}

export function useIgnoreFollowProfile(username: string) {
  const ignoreFollowProfileFetcher = () => ignoreRequestFollowProfile({username})
  const {
    trigger,
    data,
    error,
    isMutating
  } = useSWRMutation(`IgnoreFollowProfile/${username}`, ignoreFollowProfileFetcher)

  return {
    ignoreFollowProfile: () => trigger(),
    dataIgnore: data,
    errorIgnore: error,
    isFetchingIgnore: isMutating
  }
}

export function useSearchFollowersProfile(username: string) {
  const aborter = useRef<AbortController>()
  const abort = () => aborter.current?.abort()
  const searchFollowersProfileFetcher = (_: any, {arg}: {
    arg: { searchedUsername: string }
  }) => {
    aborter.current = new AbortController()
    const signal = aborter.current?.signal

    if (!signal) {
      throw new Error("AbortController.signal is undefined")
    }

    return searchFollowersProfile(signal, username, arg.searchedUsername)
  }
  const {
    trigger,
    data,
    error,
    isMutating
  } = useSWRMutation(`SearchFollowersProfile/${username}`, searchFollowersProfileFetcher)

  return {
    searchFollowersProfile: (searchedUsername: string) => trigger({searchedUsername}),
    abortSearch: abort,
    dataSearch: data,
    errorSearch: error,
    isFetchingSearch: isMutating
  }
}

export function useSearchFollowsProfile(username: string) {
  const aborter = useRef<AbortController>()
  const abort = () => aborter.current?.abort()
  const searchFollowsProfileFetcher = (_: any, {arg}: {
    arg: { searchedUsername: string }
  }) => {
    aborter.current = new AbortController()
    const signal = aborter.current?.signal

    if (!signal) {
      throw new Error("AbortController.signal is undefined")
    }

    return searchFollowersProfile(signal, arg.searchedUsername, username)
  }
  const {
    trigger,
    data,
    error,
    isMutating
  } = useSWRMutation(`SearchFollowsProfile/${username}`, searchFollowsProfileFetcher)

  return {
    searchFollowsProfile: (searchedUsername: string) => trigger({searchedUsername}),
    abortSearch: abort,
    dataSearch: data,
    errorSearch: error,
    isFetchingSearch: isMutating
  }
}

export function useVerifyUserPasswordByEmail() {
  const verifyUserPasswordFetcher = (_: any, {arg}: {
    arg: VerifyPasswordRequest
  }) => verifyUserPassword(arg)
  const {trigger, data, error, isMutating} = useSWRMutation("VerifyUserPasswordByEmail", verifyUserPasswordFetcher)

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
  const {
    trigger,
    data,
    error,
    isMutating
  } = useSWRMutation("TwoFactorAuthenticatorUserType", twoFactorAuthenticatorUserTypeFetcher)

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
  const {
    trigger,
    data,
    error,
    isMutating
  } = useSWRMutation("VerifyTwoFactorAuthenticatorTotpCode", verifyTwoFactorAuthenticatorTotpCodeFetcher)

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
    arg: { username: string }
  }) => {
    aborter.current = new AbortController()
    const signal = aborter.current?.signal

    if (!signal) {
      throw new Error("AbortController.signal is undefined")
    }

    return verifyExistUsername(signal, arg.username)
  }
  const {trigger, data, error, isMutating} = useSWRMutation("VerifyExistUsername", verifyExistUsernameFetcher)

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
  const {trigger, data, error, isMutating} = useSWRMutation("RegisterUser", registerUserFetcher)

  return {
    registerUser: (req: RegisterUserRequest) => trigger(req),
    dataRegister: data,
    errorRegister: error,
    isFetchingRegister: isMutating
  }
}

export function useFetchProfileData() {
  const fetchProfileDataFetcher = () => fetchProfileData()
  const { data, error, mutate} = useSWR("useFetchProfileData", fetchProfileDataFetcher)

  return {
    profileData: data,
    profileDataMutate: mutate,
    errorProfileData: error,
  }
}



export function useEnableOrDisable(id: number) {
  const enableOrDisableFetcher = () => enableOrDisableUser({id})
  const {trigger, data, error, isMutating} = useSWRMutation(`EnableOrDisable/${id}`, enableOrDisableFetcher)

  return {
    enableOrDisable: () => trigger(),
    dataEnableOrDisable: data,
    errorEnableOrDisable: error,
    isFetchingEnableOrDisable: isMutating
  }
}

export function useDeleteUser(id: number) {
  const deleteUserFetcher = () => deleteUser({id})
  const {trigger, data, error, isMutating} = useSWRMutation(`DeleteUser/${id}`, deleteUserFetcher)

  return {
    deleteUser: () => trigger(),
    dataDeleteUser: data,
    errorDeleteUser: error,
    isFetchingDeleteUser: isMutating
  }
}
