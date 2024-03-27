import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import {findUserByEmail} from "@/db/db-service"
import {isPasswordValid} from "@/utils/password"
import { env } from "@/env"
import {Session} from "@/auth/types"
// @ts-ignore
import {NextAuthRequest} from "next-auth/lib"

export const { handlers, auth, signIn, signOut} = NextAuth({
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "Credentials",
      credentials: {
        email: {label: "Email", type: "text"},
        password: {label: "Password", type: "password"},
      },
      async authorize(credentials, req) {
        const user = await findUserByEmail(credentials.email as string)
        if (!user) {
          return null
        }

        const isValid = await isPasswordValid(credentials.password as string, user.hashedPassword)

        if (!isValid) {
          return null
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
  }
  // pages: {
  //   signIn: "/login",
  //   newUser: "/signup",
  // }
})

type JWTUser = {
  uid: string,
  id: string
}

export function getSession(req: NextAuthRequest) {
  if (req.auth === null) return null
  try {
    return Session.parse(req.auth)
  } catch (e) {
    return null
  }
}
