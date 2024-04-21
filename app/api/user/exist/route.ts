import {invalidQueryParameterProblem, problem} from "@/http/problem"
import {existUsernameIgnoreCase} from "@/db/db-service"
import {NextRequest, NextResponse} from "next/server"

export async function GET(req: NextRequest) {
  const username = req.nextUrl.searchParams.get("username")

  if (!username) {
    return problem({...invalidQueryParameterProblem, detail: "Username is required"})
  }

  const exist = await existUsernameIgnoreCase(username)

  return NextResponse.json({exist})
}
