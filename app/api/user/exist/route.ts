import {invalidQueryParameterProblem, problem} from "@/http/problem"
import {NextRequest, NextResponse} from "next/server"
import {profileService} from "@/services"
import {StatusCodes} from "http-status-codes"

export async function GET(req: NextRequest) {
  const username = req.nextUrl.searchParams.get("username")

  if (!username) {
    return problem({...invalidQueryParameterProblem, detail: "Username is required"})
  }

  const exist = await profileService.existUsername(username)

  return NextResponse.json({exist}, {status: StatusCodes.OK})
}
