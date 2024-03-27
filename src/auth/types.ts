import {z} from "zod"

export const Session = z.object({
  expires: z.string(),
  uid: z.string()
})
export type Session = z.infer<typeof Session>;
