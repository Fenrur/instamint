import {auth, getSession} from "@/auth"
// @ts-expect-error TODO fix library not found
import {NextAuthRequest} from "next-auth/lib"
import {notAuthenticatedProblem, problem} from "@/http/problem"
import {profileService} from "@/services"
import {NextResponse} from "next/server"

export const GET = auth(async (req: NextAuthRequest) => {
  const url = req.nextUrl.clone()
  const id = Number.parseInt(url.searchParams.get("id") as string, 10)
  const session = getSession(req)

  if (!session) {
    return problem({...notAuthenticatedProblem, detail: "you need to be authenticated"})
  }

  const result = await profileService.findTeaBagWithChildDataByProfileId(id)

  return NextResponse.json({...result})
})
