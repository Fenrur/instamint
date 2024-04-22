import {createEnv} from "@t3-oss/env-nextjs"
import {z} from "zod"

/* eslint-disable camelcase */
export const env = createEnv({
  server: {
    DATABASE_URL: z.string().url(),
    GMAIL_EMAIL: z.string().email(),
    GMAIL_PASS: z.string(),
    NEXT_AUTH_SECRET: z.string(),
    SECURE_AUTH_COOKIES: z.string(),
    TOTP_ENCRYPTION_KEY: z.string(),
    PEPPER_PASSWORD_SECRET: z.string(),
    BASE_URL: z.string().url(),
    CONTACT_EMAIL: z.string().email()
  },
  client: {
  },
  // If you're using Next.js < 13.4.4, you'll need to specify the runtimeEnv manually
  experimental__runtimeEnv: {
  }
})
