import {NextRequest, NextResponse} from "next/server"
import {invalidQueryParameterProblem, problem, profileNotFoundProblem} from "@/http/problem"
import {nftService} from "@/services"
import {usernameRegex} from "@/utils/validator"

export async function GET(req: NextRequest) {
  const url = req.nextUrl.clone()
  const page = url.searchParams.get("page")
  const username = url.searchParams.get("username")

  if (page === null) {
    return problem({...invalidQueryParameterProblem, detail: "page is required"})
  }
  const parsedPage = parseInt(page)
  if (isNaN(parsedPage)) {
    return problem({...invalidQueryParameterProblem, detail: "page must be a number"})
  }
  if (parsedPage <= 0) {
    return problem({...invalidQueryParameterProblem, detail: "page must be a minimum 1"})
  }

  if (username === null) {
    return problem({...invalidQueryParameterProblem, detail: "username is required"})
  }
  if (!usernameRegex.test(username)) {
    return problem({...invalidQueryParameterProblem, detail: "username is invalid pattern"})
  }

  const result = await nftService.findNftsPaginatedByUsernameWithMintCountAndCommentCount(username, parsedPage)
  if (result === "profile_not_found") {
    return problem(profileNotFoundProblem)
  }

  const nfts = result.map(({id, contentUrl, mintCount, commentCount, postedAt, type}) => ({
    id,
    contentUrl,
    mintCount,
    commentCount,
    postedAt,
    type
  }))

  return NextResponse.json(nfts)
}
