import {compare, hash} from "bcryptjs"
import crypto from "crypto"

export async function hashPassword(password: string, pepper: string) {
  const pepperedPassword = crypto.createHmac("sha256", pepper + password).digest().toString("base64")

  return await hash(pepperedPassword, 12)
}

export async function isPasswordValid(password: string, hashedPassword: string, pepper: string) {
  const pepperedPassword = crypto.createHmac("sha256", pepper + password).digest().toString("base64")

  return await compare(pepperedPassword, hashedPassword)
}
