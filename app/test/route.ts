import {NextRequest, NextResponse} from "next/server"
import {hashPassword} from "@/utils/password"
import {env} from "@/env"
import {authenticator} from "@/two-factor/otp"
import {symmetricEncrypt} from "@/utils/crypto"

export async function POST(req: NextRequest) {
  const body = await req.json()

  const password = body.password
  const uid = body.uid

  const hashedPassword = await hashPassword(password, env.PEPPER_PASSWORD_SECRET)
  const totpSecret = authenticator().generateSecret(20)
  const totpEncrypt = symmetricEncrypt(totpSecret, env.TOTP_ENCRYPTION_KEY)
  const keyUri = authenticator().keyuri(uid, "Instamint", totpSecret)

  return NextResponse.json({
    password,
    hashedPassword,
    totpSecret,
    totpEncrypt
  })
}
