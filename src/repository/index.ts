import {
  AcceptAllFollowProfileRequest,
  AcceptFollowProfileRequest,
  DeleteFollowerProfileRequest,
  FollowerProfileStateResponse,
  FollowProfileRequest,
  FollowProfileResponse,
  FollowProfileStateResponse,
  GetPaginedNftsByUsernameResponse,
  IgnoreProfileRequest,
  PaginatedFollowerProfileResponse,
  PaginatedFollowProfileResponse,
  PaginatedRequestersFollowProfileResponse,
  RegisterUserRequest,
  RegisterUserResponse,
  SearchFollowersProfileResponse,
  SearchFollowsProfileResponse,
  TwoFactorAuthenticatorTypeRequest,
  TwoFactorAuthenticatorTypeResponse,
  UnfollowProfileRequest,
  UnfollowProfileResponse,
  VerifyExistUsernameResponse,
  VerifyPasswordRequest,
  VerifyTotpCodeRequest
} from "@/http/rest/types"
import {getErrorCodeFromProblem} from "@/http/problem"
import {ErrorCode} from "@/http/error-code"
import {StatusCodes} from "http-status-codes"
import {ProfileData} from "../../app/settings/profile/page"

export async function myProfile() {
  const res = await fetch("/api/profile/me", {
    method: "GET"
  })

  if (res.status === StatusCodes.OK) {
    return FollowProfileStateResponse.parse(await res.json())
  }

  const errorCode = getErrorCodeFromProblem(await res.json())

  switch (errorCode) {
    case ErrorCode.NOT_AUTHENTICATED:
      return "not_authenticated"
  }

  throw new Error("Undefined error code from server")
}

export async function followProfile(req: FollowProfileRequest) {
  const res = await fetch("/api/profile/follow", {
    method: "POST",
    body: JSON.stringify(req),
    headers: {
      "Content-Type": "application/json"
    },
  })

  if (res.status === StatusCodes.OK) {
    const body = FollowProfileResponse.parse(await res.json())

    return body.type
  }

  const errorCode = getErrorCodeFromProblem(await res.json())

  switch (errorCode) {
    case ErrorCode.INVALID_BODY:
      return "invalid_body"

    case ErrorCode.BAD_SESSION:
      return "bad_session"

    case ErrorCode.PROFILE_NOT_FOUND:
      return "profile_not_found"

    case ErrorCode.NOT_AUTHENTICATED:
      return "not_authenticated"

    case ErrorCode.CANT_FOLLOW_YOURSELF:
      return "cant_follow_yourself"

    case ErrorCode.ALREADY_FOLLOW_PROFILE:
      return "already_follow_profile"

    case ErrorCode.ALREADY_REQUEST_PROFILE:
      return "already_request_profile"
  }

  throw new Error("Undefined error code from server")
}

export async function getPaginatedFollows(username: string, page: number) {
  const url = encodeURI(`/api/profile/follow?username=${username}&page=${page}`)
  const res = await fetch(url, {
    method: "GET"
  })

  if (res.status === StatusCodes.OK) {
    return PaginatedFollowProfileResponse.parse(await res.json())
  }

  const errorCode = getErrorCodeFromProblem(await res.json())

  switch (errorCode) {
    case ErrorCode.INVALID_QUERY_PARAMETER:
      return "invalid_query_parameter"

    case ErrorCode.PROFILE_NOT_FOUND:
      return "profile_not_found"

    case ErrorCode.NOT_AUTHENTICATED:
      return "not_authenticated"

    case ErrorCode.BAD_SESSION:
      return "bad_session"

    case ErrorCode.DONT_FOLLOW_PROFILE:
      return "dont_follow_profile"
  }

  throw new Error("Undefined error code from server")
}

export async function getPaginatedFollowers(username: string, page: number) {
  const url = encodeURI(`/api/profile/follower?username=${username}&page=${page}`)
  const res = await fetch(url, {
    method: "GET"
  })

  if (res.status === StatusCodes.OK) {
    return PaginatedFollowerProfileResponse.parse(await res.json())
  }

  const errorCode = getErrorCodeFromProblem(await res.json())

  switch (errorCode) {
    case ErrorCode.INVALID_QUERY_PARAMETER:
      return "invalid_query_parameter"

    case ErrorCode.PROFILE_NOT_FOUND:
      return "profile_not_found"

    case ErrorCode.NOT_AUTHENTICATED:
      return "not_authenticated"

    case ErrorCode.BAD_SESSION:
      return "bad_session"

    case ErrorCode.DONT_FOLLOW_PROFILE:
      return "dont_follow_profile"
  }

  throw new Error("Undefined error code from server")
}

export async function unfollowProfile(req: UnfollowProfileRequest) {
  const res = await fetch("/api/profile/follow", {
    method: "DELETE",
    body: JSON.stringify(req),
    headers: {
      "Content-Type": "application/json"
    },
  })

  if (res.status === StatusCodes.OK) {
    const body = UnfollowProfileResponse.parse(await res.json())

    return body.type
  }

  const errorCode = getErrorCodeFromProblem(await res.json())

  switch (errorCode) {
    case ErrorCode.NOT_AUTHENTICATED:
      return "not_authenticated"

    case ErrorCode.INVALID_BODY:
      return "invalid_body"

    case ErrorCode.BAD_SESSION:
      return "bad_session"

    case ErrorCode.PROFILE_NOT_FOUND:
      return "profile_not_found"

    case ErrorCode.CANT_UNFOLLOW_YOURSELF:
      return "cant_unfollow_yourself"

    case ErrorCode.DONT_FOLLOW_PROFILE:
      return "dont_follow_profile"
  }

  throw new Error("Undefined error code from server")
}

export async function getFollowProfileState(username: string) {
  const url = encodeURI(`/api/profile/follow/state?username=${username}`)
  const res = await fetch(url, {
    method: "GET"
  })

  if (res.status === StatusCodes.OK) {
    const body = FollowProfileStateResponse.parse(await res.json())


    return body.state
  }

  const errorCode = getErrorCodeFromProblem(await res.json())

  switch (errorCode) {
    case ErrorCode.NOT_AUTHENTICATED:
      return "not_authenticated"

    case ErrorCode.INVALID_QUERY_PARAMETER:
      return "invalid_query_parameter"

    case ErrorCode.PROFILE_NOT_FOUND:
      return "profile_not_found"

    case ErrorCode.BAD_SESSION:
      return "bad_session"
  }
}

export async function getFollowerProfileState(username: string) {
  const url = encodeURI(`/api/profile/follower/state?username=${username}`)
  const res = await fetch(url, {
    method: "GET"
  })

  if (res.status === StatusCodes.OK) {
    const body = FollowerProfileStateResponse.parse(await res.json())


    return body.state
  }

  const errorCode = getErrorCodeFromProblem(await res.json())

  switch (errorCode) {
    case ErrorCode.NOT_AUTHENTICATED:
      return "not_authenticated"

    case ErrorCode.INVALID_QUERY_PARAMETER:
      return "invalid_query_parameter"

    case ErrorCode.PROFILE_NOT_FOUND:
      return "profile_not_found"

    case ErrorCode.BAD_SESSION:
      return "bad_session"
  }
}

export async function deleteFollowerProfile(req: DeleteFollowerProfileRequest) {
  const res = await fetch("/api/profile/follower", {
    method: "DELETE",
    body: JSON.stringify(req),
    headers: {
      "Content-Type": "application/json"
    },
  })

  if (res.status === StatusCodes.OK) {
    return "deleted"
  }

  const errorCode = getErrorCodeFromProblem(await res.json())

  switch (errorCode) {
    case ErrorCode.NOT_AUTHENTICATED:
      return "not_authenticated"

    case ErrorCode.INVALID_BODY:
      return "invalid_body"

    case ErrorCode.BAD_SESSION:
      return "bad_session"

    case ErrorCode.PROFILE_NOT_FOUND:
      return "profile_not_found"

    case ErrorCode.CANT_DELETE_FOLLOWER_YOURSELF:
      return "cant_delete_yourself"

    case ErrorCode.DONT_FOLLOW_PROFILE:
      return "dont_follow_profile"
  }
}

export async function acceptRequestFollowProfile(req: AcceptFollowProfileRequest) {
  const res = await fetch("/api/profile/follow/request/accept", {
    method: "POST",
    body: JSON.stringify(req),
    headers: {
      "Content-Type": "application/json"
    },
  })

  if (res.status === StatusCodes.OK) {
    return "accepted"
  }

  const errorCode = getErrorCodeFromProblem(await res.json())

  switch (errorCode) {
    case ErrorCode.NOT_AUTHENTICATED:
      return "not_authenticated"

    case ErrorCode.PROFILE_NOT_FOUND:
      return "profile_not_found"

    case ErrorCode.BAD_SESSION:
      return "bad_session"

    case ErrorCode.INVALID_BODY:
      return "invalid_body"

    case ErrorCode.CANT_ACCEPT_YOURSELF:
      return "cant_accept_yourself"

    case ErrorCode.DONT_FOLLOW_PROFILE:
      return "dont_follow_profile"

    case ErrorCode.DONT_REQUEST_PROFILE:
      return "dont_request_profile"

    case ErrorCode.ALREADY_FOLLOW_PROFILE:
      return "already_follow_profile"
  }

  throw new Error("Undefined error code from server")
}

export async function ignoreRequestFollowProfile(req: IgnoreProfileRequest) {
  const res = await fetch("/api/profile/follow/request/ignore", {
    method: "POST",
    body: JSON.stringify(req),
    headers: {
      "Content-Type": "application/json"
    },
  })

  if (res.status === StatusCodes.OK) {
    return "ignored"
  }

  const errorCode = getErrorCodeFromProblem(await res.json())

  switch (errorCode) {
    case ErrorCode.NOT_AUTHENTICATED:
      return "not_authenticated"

    case ErrorCode.PROFILE_NOT_FOUND:
      return "profile_not_found"

    case ErrorCode.BAD_SESSION:
      return "bad_session"

    case ErrorCode.INVALID_BODY:
      return "invalid_body"

    case ErrorCode.CANT_IGNORE_YOURSELF:
      return "cant_ignore_yourself"

    case ErrorCode.DONT_FOLLOW_PROFILE:
      return "dont_follow_profile"
  }

  throw new Error("Undefined error code from server")
}

export async function getPaginatedRequestersFollowProfile(page: number, ignored: boolean) {
  const url = encodeURI(`/api/profile/follow/request?page=${page}&ignored=${ignored}`)
  const res = await fetch(url, {
    method: "GET"
  })

  if (res.status === StatusCodes.OK) {
    return PaginatedRequestersFollowProfileResponse.parse(await res.json())
  }

  const errorCode = getErrorCodeFromProblem(await res.json())

  switch (errorCode) {
    case ErrorCode.NOT_AUTHENTICATED:
      return "not_authenticated"

    case ErrorCode.INVALID_QUERY_PARAMETER:
      return "invalid_query_parameter"

    case ErrorCode.BAD_SESSION:
      return "bad_session"
  }

  throw new Error("Undefined error code from server")
}

export async function acceptAllRequestFollowProfile(req: AcceptAllFollowProfileRequest) {
  const res = await fetch("/api/profile/follow/request/accept/all", {
    method: "PUT",
    body: JSON.stringify(req),
    headers: {
      "Content-Type": "application/json"
    },
  })

  if (res.status === StatusCodes.OK) {
    return "accepted_all"
  }

  const errorCode = getErrorCodeFromProblem(await res.json())

  switch (errorCode) {
    case ErrorCode.NOT_AUTHENTICATED:
      return "not_authenticated"

    case ErrorCode.BAD_SESSION:
      return "bad_session"

    case ErrorCode.INVALID_BODY:
      return "invalid_body"
  }

  throw new Error("Undefined error code from server")
}

export async function ignoreAllRequestFollowProfile() {
  const res = await fetch("/api/profile/follow/request/ignore/all", {
    method: "PUT",
  })

  if (res.status === StatusCodes.OK) {
    return "ignored_all"
  }

  const errorCode = getErrorCodeFromProblem(await res.json())

  switch (errorCode) {
    case ErrorCode.NOT_AUTHENTICATED:
      return "not_authenticated"

    case ErrorCode.BAD_SESSION:
      return "bad_session"
  }

  throw new Error("Undefined error code from server")
}

export async function searchRequesterProfile(signal: AbortSignal, usernameSearched: string, ignored: boolean) {
  const url = encodeURI(`/api/profile/follow/request/search?searchedUsername=${usernameSearched}&ignored=${ignored}`)
  const res = await fetch(url, {
    method: "GET",
    signal
  })

  if (res.status === StatusCodes.OK) {
    return PaginatedRequestersFollowProfileResponse.parse(await res.json())
  }

  const errorCode = getErrorCodeFromProblem(await res.json())

  switch (errorCode) {
    case ErrorCode.NOT_AUTHENTICATED:
      return "not_authenticated"

    case ErrorCode.INVALID_QUERY_PARAMETER:
      return "invalid_query_parameter"

    case ErrorCode.BAD_SESSION:
      return "bad_session"
  }

  throw new Error("Undefined error code from server")
}

export async function searchFollowsProfile(signal: AbortSignal, username: string, searchedUsername: string) {
  const url = encodeURI(`/api/profile/follow/search?targetProfileUsername=${username}&searchedUsername=${searchedUsername}`)
  const res = await fetch(url, {
    method: "GET",
    signal
  })

  if (res.status === StatusCodes.OK) {
    return SearchFollowsProfileResponse.parse(await res.json())
  }

  const errorCode = getErrorCodeFromProblem(await res.json())

  switch (errorCode) {
    case ErrorCode.INVALID_QUERY_PARAMETER:
      return "invalid_query_parameter"

    case ErrorCode.PROFILE_NOT_FOUND:
      return "profile_not_found"

    case ErrorCode.NOT_AUTHENTICATED:
      return "not_authenticated"

    case ErrorCode.BAD_SESSION:
      return "bad_session"

    case ErrorCode.DONT_FOLLOW_PROFILE:
      return "dont_follow_profile"
  }

  throw new Error("Undefined error code from server")
}

export async function searchFollowersProfile(signal: AbortSignal, username: string, searchedUsername: string) {
  const url = encodeURI(`/api/profile/follower/search?targetProfileUsername=${username}&searchedUsername=${searchedUsername}`)
  const res = await fetch(url, {
    method: "GET",
    signal
  })

  if (res.status === StatusCodes.OK) {
    return SearchFollowersProfileResponse.parse(await res.json())
  }

  const errorCode = getErrorCodeFromProblem(await res.json())

  switch (errorCode) {
    case ErrorCode.INVALID_QUERY_PARAMETER:
      return "invalid_query_parameter"

    case ErrorCode.PROFILE_NOT_FOUND:
      return "profile_not_found"

    case ErrorCode.NOT_AUTHENTICATED:
      return "not_authenticated"

    case ErrorCode.BAD_SESSION:
      return "bad_session"

    case ErrorCode.DONT_FOLLOW_PROFILE:
      return "dont_follow_profile"
  }

  throw new Error("Undefined error code from server")
}

export async function getPaginatedNfts(username: string, page: number) {
  const url = encodeURI(`/api/profile/nft?username=${username}&page=${page}`)
  const res = await fetch(url, {
    method: "GET"
  })

  if (res.status === StatusCodes.OK) {
    return GetPaginedNftsByUsernameResponse.parse(await res.json())
  }

  const errorCode = getErrorCodeFromProblem(await res.json())

  switch (errorCode) {
    case ErrorCode.INVALID_QUERY_PARAMETER:
      return "invalid_query_parameter"

    case ErrorCode.PROFILE_NOT_FOUND:
      return "profile_not_found"

    case ErrorCode.NOT_AUTHENTICATED:
      return "not_authenticated"

    case ErrorCode.USER_NOT_FOUND:
      return "my_user_not_found"

    case ErrorCode.DONT_FOLLOW_PROFILE:
      return "dont_follow_profile"
  }

  throw new Error("Undefined error code from server")
}

export async function verifyUserPassword(req: VerifyPasswordRequest) {
  const res = await fetch("/api/auth/verify/password", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(req)
  })

  if (res.status === StatusCodes.OK) {
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

  if (res.status === StatusCodes.OK) {
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

  if (res.status === StatusCodes.OK) {
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
  const url = encodeURI(`/api/user/exist?username=${username}`)
  const res = await fetch(url, {
    method: "GET",
    signal
  })

  if (res.status === StatusCodes.OK) {
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

  if (res.status === StatusCodes.CREATED) {
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


export async function getProfileData() {
  const res = await fetch("/api/profile/me")

  if (res.status === StatusCodes.CREATED) {
    return await res.json()
  }

  return {avatarUrl: "", bio: "", link: "", username: ""}
}
