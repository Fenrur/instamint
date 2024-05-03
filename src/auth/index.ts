import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import {isPasswordValid} from "@/utils/password"
import {env} from "@/env"
import {Session} from "@/auth/types"
// @ts-expect-error TODO fix library not found
import {NextAuthRequest} from "next-auth/lib"
import {symmetricDecrypt} from "@/utils/crypto"
import {authenticator} from "@/two-factor/otp"
import {userService} from "@/services"

const {handlers, auth, signIn, signOut} = NextAuth({
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "Credentials",
      credentials: {
        email: {label: "Email", type: "text"},
        password: {label: "Password", type: "password"},
        twoFactorAuthentification: {label: "2Fa", type: "text"}
      },
      async authorize(credentials) {
        const user = await userService.findByEmail(credentials.email as string)

        if (!user) {
          throw new Error("User not found")
        }

        const isValid = await isPasswordValid(credentials.password as string, user.hashedPassword, env.PEPPER_PASSWORD_SECRET)

        if (!isValid) {
          throw new Error("Invalid password")
        }

        if (user.twoFactorEnabled) {
          if (credentials.twoFactorAuthentification === null || credentials.twoFactorAuthentification === undefined) {
            throw new Error("Two factor authentification required")
          }

          if (user.twoFactorSecret === null) {
            await userService.resetTwoFactorAuthentification(user.id)

            return {uid: user.uid, email: user.email}
          }

          const secret = symmetricDecrypt(user.twoFactorSecret, env.TOTP_ENCRYPTION_KEY)

          if (secret.length !== 32) {
            throw new Error("Internal Server Error")
          }

          const isValidToken = authenticator().check(String(credentials.twoFactorAuthentification), secret)

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
      if (url.startsWith("/")) {
        return `${baseUrl}${url}`
      }
      else if (new URL(url).origin === baseUrl) {
        return url
      }

      return baseUrl
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
        // @ts-expect-error checked statement
        session.uid = token.uid
        // @ts-expect-error checked statement
        session.user = null
      }

      return session
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
  },
  trustHost: true
})

type JWTUser = {
  uid: string,
  id: string
}

export function getSession(req: NextAuthRequest) {
  if (!req || !req.auth) {
    return null
  }

  try {
    // @typescript-eslint/no-unsafe-member-access verified
    return Session.parse(req.auth)
  } catch (e) {
    return null
  }
}

async function getServerSession() {
  const authSession = await auth()
  const session = Session.safeParse(authSession)

  return session.success ? session.data : null
}

export {
  handlers,
  auth,
  getServerSession,
  signIn,
  signOut
}
