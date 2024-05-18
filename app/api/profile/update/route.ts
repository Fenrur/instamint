import {invalidQueryParameterProblem, notAuthenticatedProblem, problem, userNotFoundProblem} from "@/http/problem"
import {profileService} from "@/services"
import {auth, getSession} from "@/auth"
// @ts-expect-error
import {NextAuthRequest} from "next-auth/lib"

export const POST = auth(async (req: NextAuthRequest) => {
  const url = req.nextUrl.clone()
  const username = url.searchParams.get("username") as string
  const bio = url.searchParams.get("bio") as string
  const uniqueLink = url.searchParams.get("uniqueLink") as string

  if (!username) {
    return problem({...invalidQueryParameterProblem, detail: "username is required"})
  }

  if (!bio) {
    return problem({...invalidQueryParameterProblem, detail: "bio is required"})
  }

  if (!uniqueLink) {
    return problem({...invalidQueryParameterProblem, detail: "uniqueLink is required"})
  }

  const session = getSession(req)

  if (!session) {
    return problem({...notAuthenticatedProblem, detail: "you need to be authenticated to see this private profile"})
  }

  const myUserAndProfile = await profileService.findByUserUid(session.uid)

  if (!myUserAndProfile) {
    return problem({...userNotFoundProblem, detail: "my user not found"})
  }

  //Const result = await profileService.findUsersOrTeaPaginatedByUsernameOrLocation(, 1);

  //return NextResponse.json(result)
})

export const GET = auth(async (req: NextAuthRequest) => {
  const url = req.nextUrl.clone()
  const username = url.searchParams.get("username") as string
  const bio = url.searchParams.get("bio") as string
  const uniqueLink = url.searchParams.get("uniqueLink") as string

  if (!username) {
    return problem({...invalidQueryParameterProblem, detail: "username is required"})
  }

  if (!bio) {
    return problem({...invalidQueryParameterProblem, detail: "bio is required"})
  }

  if (!uniqueLink) {
    return problem({...invalidQueryParameterProblem, detail: "uniqueLink is required"})
  }

  const session = getSession(req)

  if (!session) {
    return problem({...notAuthenticatedProblem, detail: "you need to be authenticated to see this private profile"})
  }

  const myUserAndProfile = await profileService.findByUserUid(session.uid)

  if (!myUserAndProfile) {
    return problem({...userNotFoundProblem, detail: "my user not found"})
  }

  //Const result = await profileService.findUsersOrTeaPaginatedByUsernameOrLocation(, 1);

  //return NextResponse.json(result)
})


