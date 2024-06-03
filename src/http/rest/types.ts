import {z} from "zod"
import {zfd} from "zod-form-data"
import {passwordRegex, usernameRegex} from "@/utils/validator"
import {nftTypeArray, profileVisibilityTypeArray} from "@/domain/types"
import {datetimeIso} from "@/utils/zod"

export const FollowUnfollowProfileRequest = z.object({
  username: zfd.text(z.string())
})

export type FollowUnfollowProfileRequest = z.infer<typeof FollowUnfollowProfileRequest>

export const LoginCredentials = zfd.formData({
  email: zfd.text(z.string().email())
})

export type LoginCredentials = z.infer<typeof LoginCredentials>

export const SignupCredentials = zfd.formData({
  email: zfd.text(z.string().email())
})

export type SignupCredentials = z.infer<typeof SignupCredentials>

export const VerifyPasswordRequest = z.object({
  email: z.string().email("VerifyPasswordRequest.email must be an email."),
  password: z.string()
})

export type VerifyPasswordRequest = z.infer<typeof VerifyPasswordRequest>

export const VerifyPasswordResponse = z.object({
  valid: z.boolean()
})

export type VerifyUserPasswordResponse = z.infer<typeof VerifyPasswordResponse>

export const VerifyTotpCodeRequest = z.object({
  email: z.string().email(),
  password: z.string(),
  totpCode: z.string().min(6, "VerifyTotpCodeRequest.totpCode One-time password must be 6 digits.").max(6, "VerifyTotpCodeRequest.totpCode One-time password must be 6 digits.")
})

export type VerifyTotpCodeRequest = z.infer<typeof VerifyTotpCodeRequest>

export const TwoFactorAuthenticatorTypeRequest = z.object({
  email: z.string().email(),
  password: z.string(),
})

export type TwoFactorAuthenticatorTypeRequest = z.infer<typeof TwoFactorAuthenticatorTypeRequest>

export const TwoFactorAuthenticatorTypeResponse = z.object({
  type: z.enum(["totp", "none"])
})

export type TwoFactorAuthenticatorTypeResponse = z.infer<typeof TwoFactorAuthenticatorTypeResponse>

export const TwoFactorAuthenticatorSetupRequest = z.object({
  password: z.string()
})

export type TwoFactorAuthenticatorSetupRequest = z.infer<typeof TwoFactorAuthenticatorSetupRequest>

export const TwoFactorAuthenticatorSetupResponse = z.object({
  secret: z.string(),
  keyUri: z.string(),
  dataUri: z.string()
})

export type TwoFactorAuthenticatorSetupResponse = z.infer<typeof TwoFactorAuthenticatorSetupResponse>

export const TwoFactorAuthenticatorDisableRequest = z.object({
  password: z.string(),
  totpCode: z.string().min(6, "TwoFactorAuthenticatorDisableRequest.totp One-time password must be 6 digits.").max(6, "TwoFactorAuthenticatorDisableRequest.totp One-time password must be 6 digits.")
})

export const RegisterUserRequest = z.object({
  password: z
    .string()
    .regex(
      passwordRegex,
      "Password must contain at least one uppercase letter, one lowercase letter, one number and 8 characters long"
    ),
  username: z
    .string()
    .regex(
      usernameRegex,
      "Username must contain only letters, numbers, underscores, and be between 3 and 18 characters long."
    ),
  emailVerificationId: z.string().uuid()
})

export type RegisterUserRequest = z.infer<typeof RegisterUserRequest>

export const RegisterUserResponse = z.object({
  uid: z.string(),
})

export type RegisterUserResponse = z.infer<typeof RegisterUserResponse>

export const VerifyExistUsernameResponse = z.object({
  exist: z.boolean()
})

export type VerifyExistUsernameResponse = z.infer<typeof VerifyExistUsernameResponse>

export const GetPaginedNftsByUsernameResponse = z.array(
  z.object({
    id: z.number(),
    contentUrl: z.string(),
    mintCount: z.number(),
    commentCount: z.number(),
    postedAt: datetimeIso(),
    type: z.enum(nftTypeArray)
  })
)

export type GetPaginedNftsByUsernameResponse = z.infer<typeof GetPaginedNftsByUsernameResponse>

export const FollowProfileRequest = z.object({
  username: z.string()
})

export type FollowProfileRequest = z.infer<typeof FollowProfileRequest>

export const FollowProfileResponse = z.object({
  type: z.enum(["followed", "requesting_follow"])
})

export type FollowProfileResponse = z.infer<typeof FollowProfileResponse>

export const UnfollowProfileRequest = z.object({
  username: z.string()
})

export type UnfollowProfileRequest = z.infer<typeof UnfollowProfileRequest>

export const UnfollowProfileResponse = z.object({
  type: z.enum(["unfollowed", "unrequested_follow"])
})

export type UnfollowProfileResponse = z.infer<typeof UnfollowProfileResponse>

export const IgnoreProfileRequest = z.object({
  username: z.string()
})

export type IgnoreProfileRequest = z.infer<typeof IgnoreProfileRequest>

export const UnIgnoreProfileRequest = z.object({
  username: z.string()
})

export type UnIgnoreProfileRequest = z.infer<typeof UnIgnoreProfileRequest>

export const AcceptFollowProfileRequest = z.object({
  username: z.string()
})

export type AcceptFollowProfileRequest = z.infer<typeof AcceptFollowProfileRequest>

export const AcceptAllFollowProfileRequest = z.object({
  ignored: z.boolean()
})

export type AcceptAllFollowProfileRequest = z.infer<typeof AcceptAllFollowProfileRequest>

export const DeleteFollowerProfileRequest = z.object({
  username: z.string()
})

export type DeleteFollowerProfileRequest = z.infer<typeof DeleteFollowerProfileRequest>

export const FollowProfileStateResponse = z.object({
  state: z.enum(["requesting_follow", "following", "not_following"])
})

export type FollowProfileStateResponse = z.infer<typeof FollowProfileStateResponse>

export const FollowerProfileStateResponse = z.object({
  state: z.enum(["requesting_follow", "following", "not_following", "ignored_request_follow"])
})

export type FollowerProfileStateResponse = z.infer<typeof FollowerProfileStateResponse>

export const PaginatedRequestersFollowProfileResponse = z.array(z.object({
  requestAt: datetimeIso(),
  isIgnored: z.boolean(),
  profile: z.object({
    username: z.string(),
    displayName: z.string(),
    avatarUrl: z.string(),
  })
}))

export type PaginatedRequestersFollowProfileResponse = z.infer<typeof PaginatedRequestersFollowProfileResponse>

export type PaginatedRequesterFollowProfileElement = z.infer<typeof PaginatedRequestersFollowProfileResponse.element>

export const SearchRequestersFollowProfileResponse = z.array(z.object({
  requestAt: datetimeIso(),
  isIgnored: z.boolean(),
  profile: z.object({
    username: z.string(),
    displayName: z.string(),
    avatarUrl: z.string(),
  })
}))

export type SearchRequestersFollowProfileResponse = z.infer<typeof SearchRequestersFollowProfileResponse>

export const MyProfileResponse = z.object({
  username: z.string(),
  createdAt: datetimeIso(),
  bio: z.string(),
  link: z.string().url().nullable(),
  avatarUrl: z.string().url(),
  canBeSearched: z.boolean(),
  visibilityType: z.enum(profileVisibilityTypeArray),
  location: z.string().nullable(),
  displayName: z.string()
})

export type MyProfileResponse = z.infer<typeof MyProfileResponse>

export const PaginatedFollowProfileResponse = z.array(z.object({
  profile: z.object({
    username: z.string(),
    displayName: z.string(),
    avatarUrl: z.string(),
  }),
  followAt: datetimeIso(),
  followStateTo: z.enum(["following", "requesting_follow", "not_following"]),
  followStateFrom: z.enum(["following", "ignored_request_follow", "requesting_follow", "not_following"])
}))

export type PaginatedFollowProfileResponse = z.infer<typeof PaginatedFollowProfileResponse>

export const PaginatedFollowerProfileResponse = z.array(z.object({
  profile: z.object({
    username: z.string(),
    displayName: z.string(),
    avatarUrl: z.string(),
  }),
  followAt: datetimeIso(),
  followStateTo: z.enum(["following", "requesting_follow", "not_following"]),
  followStateFrom: z.enum(["following", "ignored_request_follow", "requesting_follow", "not_following"])
}))

export type PaginatedFollowerProfileResponse = z.infer<typeof PaginatedFollowerProfileResponse>

export const SearchFollowersProfileResponse = z.array(z.object({
  profile: z.object({
    username: z.string(),
    displayName: z.string(),
    avatarUrl: z.string(),
  }),
  followAt: datetimeIso(),
  followStateTo: z.enum(["following", "requesting_follow", "not_following"]),
  followStateFrom: z.enum(["following", "ignored_request_follow", "requesting_follow", "not_following"])
}))

export type SearchFollowersProfileResponse = z.infer<typeof SearchFollowersProfileResponse>

export const SearchFollowsProfileResponse = z.array(z.object({
  profile: z.object({
    username: z.string(),
    displayName: z.string(),
    avatarUrl: z.string(),
  }),
  followAt: datetimeIso(),
  followStateTo: z.enum(["following", "requesting_follow", "not_following"]),
  followStateFrom: z.enum(["following", "ignored_request_follow", "requesting_follow", "not_following"])
}))

export type SearchFollowsProfileResponse = z.infer<typeof SearchFollowsProfileResponse>

export const MintNftRequest = z.object({
  nftId: z.number(),
})

export type MintNftRequest = z.infer<typeof MintNftRequest>

export const UnmintNftRequest = z.object({
  nftId: z.number(),
})

export type UnmintNftRequest = z.infer<typeof UnmintNftRequest>

export const MintCommentRequest = z.object({
  commentId: z.number(),
})

export type MintCommentRequest = z.infer<typeof MintCommentRequest>

export const UnmintCommentRequest = z.object({
  commentId: z.number(),
})

export type UnmintCommentRequest = z.infer<typeof UnmintCommentRequest>

export const PaginatedCommentElement = z.object({
  commentId: z.number().int().min(0),
  commentary: z.string(),
  commentedAt: datetimeIso(),
  commenterAvatarUrl: z.string(),
  commenterUsername: z.string(),
  mintCommentCount: z.number().int().min(0),
  replyCount: z.number().int().min(0),
  minted: z.boolean(),
})

export type PaginatedCommentElement = z.infer<typeof PaginatedCommentElement>

export const PaginatedCommentsResponse = z.array(PaginatedCommentElement)

export type PaginatedCommentsResponse = z.infer<typeof PaginatedCommentsResponse>
