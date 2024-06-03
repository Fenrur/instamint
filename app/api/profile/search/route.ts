import {NextResponse} from "next/server"
import {profileService} from "@/services"
import {auth, getSession} from "@/auth"
// @ts-expect-error TODO fix library not found
import {NextAuthRequest} from "next-auth/lib"
import {invalidQueryParameterProblem, notAuthenticatedProblem, problem, userNotFoundProblem} from "@/http/problem"

export const GET = auth(async (req: NextAuthRequest) => {
  const url = req.nextUrl.clone()
  const page = url.searchParams.get("page") as string
  const query = url.searchParams.get("query") as string
  const location = url.searchParams.get("location") as string

  if (!page) {
    return problem({...invalidQueryParameterProblem, detail: "page is required"})
  }

  const parsedPage = parseInt(page, 10)

  if (isNaN(parsedPage)) {
    return problem({...invalidQueryParameterProblem, detail: "page must be a number"})
  }

  if (parsedPage <= 0) {
    return problem({...invalidQueryParameterProblem, detail: "page must be a minimum 1"})
  }

  const session = getSession(req)

  if (!session) {
    return problem({...notAuthenticatedProblem, detail: "you need to be authenticated to see this private profile"})
  }

  const myUserAndProfile = await profileService.findByUserUid(session.uid)

  if (!myUserAndProfile) {
    return problem({...userNotFoundProblem, detail: "my user not found"})
  }


  const result = await profileService.findUsersOrTeaPaginatedByUsernameOrLocation(query, location, parsedPage)

  return NextResponse.json(result)
})


