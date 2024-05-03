import {NextResponse} from "next/server"
import {
  dontFollowProfileProblem,
  invalidQueryParameterProblem,
  notAuthenticatedProblem,
  problem,
  profileNotFoundProblem,
  userNotFoundProblem
} from "@/http/problem"
import {followService, nftService, profileService} from "@/services"
import {usernameRegex} from "@/utils/validator"
import {auth, getSession} from "@/auth"
// @ts-expect-error TODO fix library not found
import {NextAuthRequest} from "next-auth/lib"
import {DateTime} from "luxon"
import {NftType} from "../../../domain/types"

export const GET = auth(async (req: NextAuthRequest) => {
  const url = req.nextUrl.clone()
  const page = url.searchParams.get("page") as string | null
  const targetUsername = url.searchParams.get("username") as string | null

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

  if (!targetUsername) {
    return problem({...invalidQueryParameterProblem, detail: "username is required"})
  }

  if (!usernameRegex.test(targetUsername)) {
    return problem({...invalidQueryParameterProblem, detail: "username is invalid pattern"})
  }

  const targetProfile = await profileService.findByUsername(targetUsername)

  if (!targetProfile) {
    return problem(profileNotFoundProblem)
  }

  if (targetProfile.visibilityType === "public") {
    const result = await nftService.findNftsPaginatedByProfileIdWithMintCountAndCommentCount(targetProfile.id, parsedPage)
    const reponse = mapNftsToResponse(result)

    return NextResponse.json(reponse)
  }

  const session = getSession(req)

  if (!session) {
    return problem({...notAuthenticatedProblem, detail: "you need to be authenticated to see this private profile"})
  }

  const myUserAndProfile = await profileService.findByUserUid(session.uid)

  if (!myUserAndProfile) {
    return problem({...userNotFoundProblem, detail: "my user not found"})
  }

  const follow = await followService.getFollow(myUserAndProfile.id, targetProfile.id)

  if (!follow) {
    return problem({...dontFollowProfileProblem, detail: `you don't follow @${targetUsername}`})
  }

  const result = await nftService.findNftsPaginatedByProfileIdWithMintCountAndCommentCount(targetProfile.id, parsedPage)
  const reponse = mapNftsToResponse(result)

  return NextResponse.json(reponse)
})

function mapNftsToResponse(nfts: {
  id: number,
  contentUrl: string,
  mintCount: number,
  commentCount: number,
  postedAt: DateTime<true>,
  type: NftType
}[]) {
  return nfts.map(({id, contentUrl, mintCount, commentCount, postedAt, type}) => ({
    id,
    contentUrl,
    mintCount,
    commentCount,
    postedAt: postedAt.toISO(),
    type
  }))
}
