import {invalidQueryParameterProblem, problem} from "@/http/problem"
import {NextRequest, NextResponse} from "next/server"
import {userService} from "@/services"

export async function GET(req: NextRequest) {
  const username = req.nextUrl.searchParams.get("username")

  if (!username) {
    return problem({...invalidQueryParameterProblem, detail: "Username is required"})
  }

  const exist = await userService.existUsername(username)

  return NextResponse.json({exist})
}
