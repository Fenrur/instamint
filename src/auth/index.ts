import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import {findUserByEmail, resetTwoFactorAuthentification} from "@/db/db-service"
import {isPasswordValid} from "@/utils/password"
import { env } from "@/env"
import {Session} from "@/auth/types"
// @ts-ignore
import {NextAuthRequest} from "next-auth/lib"
import {symmetricDecrypt} from "@/utils/crypto"
import {authenticator} from "@/two-factor/otp"

export const { handlers, auth, signIn, signOut} = NextAuth({
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "Credentials",
      credentials: {
        email: {label: "Email", type: "text"},
        password: {label: "Password", type: "password"},
        twoFactorAuthentification: {label: "2Fa", type: "text"}
      },
      async authorize(credentials, req) {
        const user = await findUserByEmail(credentials.email as string)
        if (!user) {
          throw new Error("User not found")
        }

        const isValid = await isPasswordValid(credentials.password as string, user.hashedPassword)

        if (!isValid) {
          throw new Error("Invalid password")
        }

        if (user.twoFactorEnabled) {
          if (credentials.twoFactorAuthentification === null || credentials.twoFactorAuthentification === undefined) {
            throw new Error("Two factor authentification required")
          }

          if (user.twoFactorSecret === null) {
            await resetTwoFactorAuthentification(user.id)
            return {uid: user.uid, email: user.email}
          }

          const secret = symmetricDecrypt(user.twoFactorSecret, env.TOTP_ENCRYPTION_KEY);
          if (secret.length !== 32) {
            console.error(`Two factor secret decryption failed. Expected key with length 32 but got ${secret.length}`);
            throw new Error("Internal Server Error")
          }

          const isValidToken = authenticator().check(String(credentials.twoFactorAuthentification), secret);
          if (!isValidToken) {
            throw new Error("Invalid two factor authentification")
          }
        }

        return {uid: user.uid, email: user.email}
      }
    })
  ],
  theme: {
    logo: "/next.svg",
  },
  secret: env.NEXT_AUTH_SECRET,
  session: {
    strategy: "jwt"
  },
  callbacks: {
    async redirect({ url, baseUrl }) {
      return "/"
    },
    async jwt({token, user}) {
      if (user) {
        const jwtUser = user as JWTUser
        token.uid = jwtUser.uid
      }
      return token
    },
    async session({session, token}) {
      if (token.uid) {
        // @ts-ignore
        session.uid = token.uid;
        // @ts-ignore
        session.user = null
      }

      return session;
    }
  },
  useSecureCookies: env.SECURE_AUTH_COOKIES === "true",
  cookies: {
    sessionToken: {
      name: "instamint.session-token"
    },
    callbackUrl: {
      name: "instamint.callback-url"
    },
    csrfToken: {
      name: "instamint.csrf-token"
    }
  },
  pages: {
    signIn: "/login",
    newUser: "/signup",
  }
})

type JWTUser = {
  uid: string,
  id: string
}

export function getSession(req: NextAuthRequest) {
  if (req.auth === null || req.auth === undefined) return null
  try {
    return Session.parse(req.auth)
  } catch (e) {
    return null
  }
}
