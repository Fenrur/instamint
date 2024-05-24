import {NextResponse} from "next/server"
import {
  badSessionProblem,
  dontFollowProfileProblem,
  invalidQueryParameterProblem,
  notAuthenticatedProblem,
  problem,
  profileNotFoundProblem,
} from "@/http/problem"
import {followService, nftService, profileService} from "@/services"
import {usernameRegex} from "@/utils/validator"
import {auth, getSession} from "@/auth"
import {DateTime} from "luxon"
import {NftType} from "@/domain/types"
import {StatusCodes} from "http-status-codes"

export const GET = auth(async (req) => {
  const url = req.nextUrl.clone()
  const page = url.searchParams.get("page")
  const targetUsername = url.searchParams.get("username")

  if (!page) {
    return problem({...invalidQueryParameterProblem, detail: "page query parameter is required"})
  }

  const parsedPage = parseInt(page, 10)

  if (isNaN(parsedPage)) {
    return problem({...invalidQueryParameterProblem, detail: "page query parameter must be a number"})
  }

  if (parsedPage <= 0) {
    return problem({...invalidQueryParameterProblem, detail: "page query parameter must be a minimum 1"})
  }

  if (!targetUsername) {
    return problem({...invalidQueryParameterProblem, detail: "username query parameter is required"})
  }

  if (!usernameRegex.test(targetUsername)) {
    return problem({...invalidQueryParameterProblem, detail: "username query parameter is invalid"})
  }

  const targetProfile = await profileService.findByUsername(targetUsername)

  if (!targetProfile) {
    return problem(profileNotFoundProblem)
  }

  if (targetProfile.visibilityType === "public") {
    const result = await nftService
      .findNftsPaginatedAndSorted(
        targetProfile.id,
        parsedPage
      )
    const response = mapNftsToResponse(result)

    return NextResponse.json(response, {status: StatusCodes.OK})
  }

  const session = getSession(req)

  if (!session) {
    return problem({...notAuthenticatedProblem, detail: "you need to be authenticated to see this private profile"})
  }

  const myUserAndProfile = await profileService.findByUserUid(session.uid)

  if (!myUserAndProfile) {
    return problem({...badSessionProblem, detail: "your profile not found from your uid in session"})
  }

  if (myUserAndProfile.profile.id === targetProfile.id) {
    const result = await nftService.findNftsPaginatedAndSorted(targetProfile.id, parsedPage)
    const response = mapNftsToResponse(result)

    return NextResponse.json(response, {status: StatusCodes.OK})
  }

  const followState = await followService.getFollowState(myUserAndProfile.profile.id, targetProfile.id)

  if (followState !== "following") {
    return problem({...dontFollowProfileProblem, detail: `you don't follow @${targetUsername}`})
  }

  const result = await nftService.findNftsPaginatedAndSorted(targetProfile.id, parsedPage)
  const response = mapNftsToResponse(result)

  return NextResponse.json(response, {status: StatusCodes.OK})
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
