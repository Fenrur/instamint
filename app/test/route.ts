import {NextRequest, NextResponse} from "next/server"
import {isPasswordValid} from "@/utils/password"
import {env} from "@/env"

export async function POST(req: NextRequest) {
  const body = await req.json()
  const hashedPassword = body.hashedPassword
  const password = body.password
  return NextResponse.json({valid: await isPasswordValid(password, hashedPassword, env.PEPPER_PASSWORD_SECRET)})
}
