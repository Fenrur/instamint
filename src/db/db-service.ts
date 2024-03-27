import {db} from "@/db/db-client"
import {hashPassword, isPasswordValid} from "@/utils/password"
import {user} from "@/db/schema"
import {UUID} from "crypto"

export function findUserByEmail(email: string) {
  return db.query.user.findFirst({
    columns: {
      uid: true,
      email: true,
      hashedPassword: true
    },
    where: (user, { eq }) => (eq(user.email, email)),
  })
}

export async function createUser(uid: UUID, email: string, password: string) {
  const hashedPassword = await hashPassword(password)
  return db.insert(user).values({email, hashedPassword, uid})
}

type VerifyUserPasswordResult = "valid" | "invalid" | "email_not_found";

export async function verifyUserPassword(email: string, password: string): Promise<VerifyUserPasswordResult> {
  const user = await findUserByEmail(email)
  if (!user) {
    return "email_not_found"
  }

  if (await isPasswordValid(password, user.hashedPassword)) {
    return "valid"
  } else {
    return "invalid"
  }
}
