import {NextRequest, NextResponse} from "next/server"
import {createUser, findUserByEmail} from "@/db/db-service"
import {z} from "zod"
import {randomUUID} from "node:crypto"
import {password} from "@/utils/regex"
import {isContentType} from "@/http/content-type"
import {invalidContentTypeProblem, problem} from "@/http/problem"

const Body = z.object({
  email: z.string().email(),
  password: z
    .string()
    .regex(
      password,
      "Password must contain at least one uppercase letter, one lowercase letter, and one number"
    ),
})

export const POST = async (req: NextRequest) => {
  if (!isContentType(req, "json")) {
    return problem({...invalidContentTypeProblem, detail: "Content-Type must be application/json"})
  }

  const body = await req.json()

  let parsedBody = null

  try {
    parsedBody = Body.parse(body)
  } catch (e: any) {
    return NextResponse.json({ message: e.errors }, { status: 400 })
  }

  const user = await findUserByEmail(parsedBody.email)

  if (user) {
    return NextResponse.json({ message: "Email is already in use" }, { status: 400 })
  }

  const uid = randomUUID()
  const createdUser = await createUser(uid, parsedBody.email, parsedBody.password)

  if (!createdUser) {
    return NextResponse.json({ message: "Failed to create user" }, { status: 500 })
  }

  return NextResponse.json({ message: "User created successfully", data: {uid, email: parsedBody.email} }, { status: 200 })
}
