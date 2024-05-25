import {auth, getSession} from "@/auth"
// @ts-expect-error TODO fix library not found
import {NextAuthRequest} from "next-auth/lib"
import {invalidQueryParameterProblem, notAuthenticatedProblem, problem, userNotFoundProblem} from "@/http/problem"
import {profileService, teaBagService} from "@/services"
import {NextResponse} from "next/server"

export const GET = auth(async (req: NextAuthRequest) => {
  const url = req.nextUrl.clone()
  const page = url.searchParams.get("page") as string

  if (!page) {
    return problem({...invalidQueryParameterProblem, detail: "page is required"})
  }

  const parsedPage = parseInt(page, 10)
  const session = getSession(req)

  if (!session) {
    return problem({...notAuthenticatedProblem, detail: "you need to be authenticated"})
  }

  const result = await teaBagService.getAll(session.uid, parsedPage)

  return NextResponse.json(result)
})

export const POST = auth(async (req: NextAuthRequest) => {
  const data = await req.json()
  const {username, bio, link, nftIds, whitelistUserIds, whitelistStart, whitelistEnd} = data

  if (!username || !bio || !link) {
    return problem({...invalidQueryParameterProblem, detail: "username, bio, and link are required"})
  }

  const session = getSession(req)

  if (!session) {
    return problem({...notAuthenticatedProblem, detail: "You need to be authenticated to create this profile"})
  }

  const myUserAndProfile = await profileService.findByUserUid(session.uid)

  if (!myUserAndProfile) {
    return problem({...userNotFoundProblem, detail: "User profile not found"})
  }


  const result = await teaBagService.create({
    username,
    bio,
    link,
    nftIds,
    whitelistUserIds,
    whitelistStart,
    whitelistEnd,
  })

  return NextResponse.json(result)
})

