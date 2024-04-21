import {NextRequest, NextResponse} from "next/server"
import {createUser, findUserByEmail} from "@/db/db-service"
import {z} from "zod"
import {isContentType} from "@/http/content-type"
import {invalidContentTypeProblem, problem} from "@/http/problem"
import {password} from "@/utils/regex"
import {DateTime} from "luxon"

const Body = z.object({
  email: z.string().email(),
  password: z
    .string()
    .regex(
      password,
      "Password must contain at least one uppercase letter, one lowercase letter, one number and 8 characters long"
    ),
})

export const POST = async (req: NextRequest) => {
  if (!isContentType(req, "json")) {
    return problem({...invalidContentTypeProblem, detail: "Content-Type must be application/json"})
  }

  const createdAt = DateTime.now()
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

  const uid = await createUser(parsedBody.email, parsedBody.password, createdAt)

  if (!uid) {
    return NextResponse.json({ message: "Failed to create user" }, { status: 500 })
  }

  return NextResponse.json({ message: "User created successfully", data: {uid, email: parsedBody.email} }, { status: 200 })
}
