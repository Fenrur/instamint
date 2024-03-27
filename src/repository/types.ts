import {z} from "zod"

export const VerifyUserPasswordRequest = z.object({
  email: z.string(),
  password: z.string()
})
export type VerifyUserPasswordRequest = z.infer<typeof VerifyUserPasswordRequest>

const VerifyUserPasswordResponse = z.object({
  valid: z.boolean()
})
export type VerifyUserPasswordResponse = z.infer<typeof VerifyUserPasswordResponse>
