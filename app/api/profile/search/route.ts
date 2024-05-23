import {NextResponse} from "next/server"
import {profileService} from "@/services"
import {auth} from "@/auth"
// @ts-ignore
import {NextAuthRequest} from "next-auth/lib"

export const GET = auth(async (req: NextAuthRequest) => {
  const url = req.nextUrl.clone()
  const page = url.searchParams.get("page") as number
  const query = url.searchParams.get("query") as string
  const location = url.searchParams.get("location") as string

  /*  if (!page) {
      return problem({...invalidQueryParameterProblem, detail: "page is required"});
    }
    const parsedPage = parseInt(page, 10)
    if (isNaN(parsedPage)) {
      return problem({...invalidQueryParameterProblem, detail: "page must be a number"});
    }
    if (parsedPage <= 0) {
      return problem({...invalidQueryParameterProblem, detail: "page must be a minimum 1"});
    }
  */
  /*  const session = getSession(req)
    if (!session) {
      return problem({...notAuthenticatedProblem, detail: "you need to be authenticated to see this private profile"})
    }

    const myUserAndProfile = await profileService.findByUserUid(session.uid)
    if (!myUserAndProfile) {
      return problem({...userNotFoundProblem, detail: "my user not found"})
    }
  */

  const result = await profileService.findUsersOrTeaPaginatedByUsernameOrLocation(query, location, page)

  return NextResponse.json(result)
})


