import {z} from "zod"
import {zfd} from "zod-form-data"

export const LoginCredentials = zfd.formData({
  email: zfd.text(z.string().email())
})

export type LoginCredentials = z.infer<typeof LoginCredentials>

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
