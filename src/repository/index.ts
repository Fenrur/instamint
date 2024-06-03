import {
  AcceptAllFollowProfileRequest,
  AcceptFollowProfileRequest,
  CommentNftRequest,
  DeleteFollowerProfileRequest,
  DeleteUserRequest,
  EnableOrDisableRequest,
  EnableOrDisableResponse,
  FollowerProfileStateResponse,
  FollowProfileRequest,
  FollowProfileResponse,
  FollowProfileStateResponse,
  GetPaginatedUsersResponse,
  GetPaginedNftsByUsernameResponse,
  IgnoreProfileRequest,
  MintCommentRequest,
  MintNftRequest,
  PaginatedCommentsResponse,
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
  UnmintCommentRequest,
  UnmintNftRequest,
  VerifyExistUsernameResponse,
  VerifyPasswordRequest,
  VerifyTotpCodeRequest
} from "@/http/rest/types"
import {getErrorCodeFromProblem} from "@/http/problem"
import {ErrorCode} from "@/http/error-code"
import {StatusCodes} from "http-status-codes"
import {ProfileData} from "@/components/Profile/ProfileList"

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

export async function deleteUser(req: DeleteUserRequest) {
  const url = encodeURI(`/api/user/delete`)
  const res = await fetch(url, {
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

    case ErrorCode.USER_NOT_FOUND:
      return "my_user_not_found"

    case ErrorCode.BAD_SESSION:
      return "bad_session"

    case ErrorCode.NOT_ACTIVATED:
      return "not_activated"

    case ErrorCode.INVALID_BODY:
      return "invalid_body"

    case ErrorCode.INVALID_CONTENT_TYPE:
      return "invalid_content-type"
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

export async function getPaginatedUsers(page: number) {
  const url = encodeURI(`/api/admin/users?page=${page}`)
  const res = await fetch(url, {
    method: "GET"
  })

  if (res.status === StatusCodes.OK) {
    return GetPaginatedUsersResponse.parse(await res.json())
  }

  const errorCode = getErrorCodeFromProblem(await res.json())

  switch (errorCode) {
    case ErrorCode.INVALID_QUERY_PARAMETER:
      return "invalid_query_parameter"

    case ErrorCode.NOT_AUTHENTICATED:
      return "not_authenticated"

    case ErrorCode.USER_NOT_FOUND:
      return "my_user_not_found"

    case ErrorCode.BAD_SESSION:
      return "bad_session"
  }

  throw new Error("Undefined error code from server")
}

export async function enableOrDisableUser(req: EnableOrDisableRequest) {
  const url = encodeURI(`/api/user/enable-or-disable`)
  const res = await fetch(url, {
    method: "PATCH",
    body: JSON.stringify(req),
    headers: {
      "Content-Type": "application/json"
    },
  })

  if (res.status === StatusCodes.OK) {
    const response = EnableOrDisableResponse.parse(await res.json())

    return response.type
  }

  const errorCode = getErrorCodeFromProblem(await res.json())

  switch (errorCode) {
    case ErrorCode.NOT_AUTHENTICATED:
      return "not_authenticated"

    case ErrorCode.USER_NOT_FOUND:
      return "my_user_not_found"

    case ErrorCode.BAD_SESSION:
      return "bad_session"

    case ErrorCode.NOT_ACTIVATED:
      return "not_activated"

    case ErrorCode.INVALID_BODY:
      return "invalid_body"

    case ErrorCode.INVALID_CONTENT_TYPE:
      return "invalid_content-type"
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

    case ErrorCode.NOT_ACTIVATED:
      return "not_activated"
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

export async function getPaginatedNftsWithSearch(query: string, location: string, priceRange: number[], page: number) {
  const queryParams = new URLSearchParams({
    query,
    minPrice: priceRange[0].toString(),
    maxPrice: priceRange[1].toString(),
    location,
    page: page.toString()
  })

  return await fetch(`/api/nft/search?${queryParams.toString()}`)
}

export async function getPaginatedUsersWithSearch(query: string, location: string, page: number) {
  const queryParams = new URLSearchParams({
    query,
    location,
    page: page.toString()
  })

  return await fetch(`/api/profile/search?${queryParams.toString()}`)
}


export async function fetchProfileData(): Promise<ProfileData> {
  const res = await fetch("/api/profile/me")

  if (res.status === StatusCodes.CREATED) {
    return await res.json() as ProfileData
  }

  return {id: 0, avatarUrl: "", bio: "", link: "", username: ""}
}

export async function mintNft(req: MintNftRequest) {
  const res = await fetch("/api/nft/mint", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(req)
  })

  if (res.status === StatusCodes.CREATED) {
    return "minted"
  }

  const errorCode = getErrorCodeFromProblem(await res.json())

  switch (errorCode) {
    case ErrorCode.NOT_AUTHENTICATED:
      return "not_authenticated"

    case ErrorCode.INVALID_BODY:
      return "invalid_body"

    case ErrorCode.BAD_SESSION:
      return "bad_session"

    case ErrorCode.ALREADY_MINTED_NFT:
      return "already_minted"

    case ErrorCode.NFT_NOT_FOUND:
      return "nft_not_found"

    case ErrorCode.DONT_FOLLOW_PROFILE:
      return "dont_follow_profile"
  }

  throw new Error(`Undefined error code from server ${errorCode}`)
}

export async function unmintNft(req: UnmintNftRequest) {
  const res = await fetch("/api/nft/mint", {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(req)
  })

  if (res.status === StatusCodes.OK) {
    return "unminted"
  }

  const errorCode = getErrorCodeFromProblem(await res.json())

  switch (errorCode) {
    case ErrorCode.NOT_AUTHENTICATED:
      return "not_authenticated"

    case ErrorCode.INVALID_BODY:
      return "invalid_body"

    case ErrorCode.BAD_SESSION:
      return "bad_session"

    case ErrorCode.NOT_MINTED_NFT:
      return "not_minted"

    case ErrorCode.NFT_NOT_FOUND:
      return "nft_not_found"

    case ErrorCode.DONT_FOLLOW_PROFILE:
      return "dont_follow_profile"
  }

  throw new Error(`Undefined error code from server ${errorCode}`)
}

export async function mintComment(req: MintCommentRequest) {
  const res = await fetch("/api/nft/comment/mint", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(req)
  })

  if (res.status === StatusCodes.CREATED) {
    return "minted"
  }

  const errorCode = getErrorCodeFromProblem(await res.json())

  switch (errorCode) {
    case ErrorCode.NOT_AUTHENTICATED:
      return "not_authenticated"

    case ErrorCode.INVALID_BODY:
      return "invalid_body"

    case ErrorCode.BAD_SESSION:
      return "bad_session"

    case ErrorCode.ALREADY_MINTED_COMMENT:
      return "already_minted"

    case ErrorCode.COMMENT_NOT_FOUND:
      return "nft_not_found"

    case ErrorCode.DONT_FOLLOW_PROFILE:
      return "dont_follow_profile"
  }

  throw new Error(`Undefined error code from server ${errorCode}`)
}

export async function unmintComment(req: UnmintCommentRequest) {
  const res = await fetch("/api/nft/comment/mint", {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(req)
  })

  if (res.status === StatusCodes.OK) {
    return "unminted"
  }

  const errorCode = getErrorCodeFromProblem(await res.json())

  switch (errorCode) {
    case ErrorCode.NOT_AUTHENTICATED:
      return "not_authenticated"

    case ErrorCode.INVALID_BODY:
      return "invalid_body"

    case ErrorCode.BAD_SESSION:
      return "bad_session"

    case ErrorCode.NOT_MINTED_COMMENT:
      return "not_minted"

    case ErrorCode.COMMENT_NOT_FOUND:
      return "nft_not_found"

    case ErrorCode.DONT_FOLLOW_PROFILE:
      return "dont_follow_profile"
  }

  throw new Error(`Undefined error code from server ${errorCode}`)
}

export async function getPaginatedComments(nftId: number, page: number) {
  const url = encodeURI(`/api/nft/comment?nftId=${nftId}&page=${page}`)
  const res = await fetch(url, {
    method: "GET"
  })

  if (res.status === StatusCodes.OK) {
    return PaginatedCommentsResponse.parse(await res.json())
  }

  const errorCode = getErrorCodeFromProblem(await res.json())

  switch (errorCode) {
    case ErrorCode.INVALID_QUERY_PARAMETER:
      return "invalid_query_parameter"

    case ErrorCode.NFT_NOT_FOUND:
      return "nft_not_found"

    case ErrorCode.NOT_AUTHENTICATED:
      return "not_authenticated"

    case ErrorCode.BAD_SESSION:
      return "bad_session"

    case ErrorCode.DONT_FOLLOW_PROFILE:
      return "dont_follow_profile"
  }

  throw new Error(`Undefined error code from server ${errorCode}`)
}

export async function getPaginatedReplyComments(commentId: number, page: number) {
  const url = encodeURI(`/api/nft/comment?commentId=${commentId}&page=${page}`)
  const res = await fetch(url, {
    method: "GET"
  })

  if (res.status === StatusCodes.OK) {
    return PaginatedCommentsResponse.parse(await res.json())
  }

  const errorCode = getErrorCodeFromProblem(await res.json())

  switch (errorCode) {
    case ErrorCode.INVALID_QUERY_PARAMETER:
      return "invalid_query_parameter"

    case ErrorCode.COMMENT_NOT_FOUND:
      return "comment_not_found"

    case ErrorCode.NOT_AUTHENTICATED:
      return "not_authenticated"

    case ErrorCode.BAD_SESSION:
      return "bad_session"

    case ErrorCode.DONT_FOLLOW_PROFILE:
      return "dont_follow_profile"
  }

  throw new Error(`Undefined error code from server ${errorCode}`)
}

export async function createComment(req: CommentNftRequest) {
  const res = await fetch("/api/nft/comment", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(req)
  })

  if (res.status === StatusCodes.CREATED) {
    return "created"
  }

  const errorCode = getErrorCodeFromProblem(await res.json())

  switch (errorCode) {
    case ErrorCode.NOT_AUTHENTICATED:
      return "not_authenticated"

    case ErrorCode.INVALID_BODY:
      return "invalid_body"

    case ErrorCode.BAD_SESSION:
      return "bad_session"

    case ErrorCode.COMMENT_NOT_FOUND:
      return "comment_not_found"

    case ErrorCode.NFT_NOT_FOUND:
      return "nft_not_found"
  }

  throw new Error(`Undefined error code from server ${errorCode}`)
}
