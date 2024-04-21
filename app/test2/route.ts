import {NextRequest, NextResponse} from "next/server"
import {hashPassword} from "@/utils/password"
import { env } from "@/env"

export async function POST(req: NextRequest) {
  const body = await req.json()
  const hashedPassword = await hashPassword(body.password, env.PEPPER_PASSWORD_SECRET)
  return NextResponse.json({hashedPassword})
}
