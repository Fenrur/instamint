import {auth, getSession} from "@/auth"
import {
  badSessionProblem,
  commentNotFoundProblem,
  dontFollowProfileProblem,
  invalidBodyProblem,
  invalidContentTypeProblem,
  invalidQueryParameterProblem,
  nftNotFoundProblem,
  notAuthenticatedProblem,
  problem,
  profileNotFoundProblem
} from "@/http/problem"
import {commentService, followService, profileService} from "@/services"
import {NextResponse} from "next/server"
import {CommentNftRequest, PaginatedCommentsResponse} from "@/http/rest/types"
import {isContentType} from "@/http/content-type"
import {DateTime} from "luxon"
import {StatusCodes} from "http-status-codes"

export const POST = auth(async (req) => {
  if (!isContentType(req, "json")) {
    return problem({...invalidContentTypeProblem, detail: "only application/json is supported"})
  }

  const session = getSession(req)
  const commentAt = DateTime.utc()

  if (!session) {
    return problem(notAuthenticatedProblem)
  }

  const bodyParsedResult = CommentNftRequest.safeParse(await req.json())

  if (!bodyParsedResult.success) {
    return problem({...invalidBodyProblem, detail: bodyParsedResult.error.errors})
  }

  const body = bodyParsedResult.data
  const myUserAndProfile = await profileService.findByUserUid(session.uid)

  if (!myUserAndProfile) {
    return problem({...badSessionProblem, detail: "your profile not found from your uid in session"})
  }

  if (body.type === "comment_nft") {
    const result = await commentService.createComment(body.nftId, myUserAndProfile.profile.id, commentAt, body.commentary)

    if (result === "nft_not_found") {
      return problem({...nftNotFoundProblem, detail: "nftId is not valid"})
    }

    return NextResponse.json({success: true}, {status: StatusCodes.CREATED})
  }

  const result = await commentService.createReplyComment(body.nftId, myUserAndProfile.profile.id, commentAt, body.commentary, body.commentId)

  if (result === "comment_not_found") {
    return problem({...commentNotFoundProblem, detail: "commentId is not valid"})
  }

  return NextResponse.json({success: true}, {status: StatusCodes.CREATED})
})

export const GET = auth(async (req) => {
  const session = getSession(req)
  const url = req.nextUrl.clone()
  const page = url.searchParams.get("page")
  const nftId = url.searchParams.get("nftId")
  const commentId = url.searchParams.get("commentId")

  if (!session) {
    return problem(notAuthenticatedProblem)
  }

  if (!page) {
    return problem({...invalidQueryParameterProblem, detail: "page is required"})
  }

  const parsedPage = parseInt(page, 10)

  if (isNaN(parsedPage)) {
    return problem({...invalidQueryParameterProblem, detail: "page must be a number"})
  }

  if (parsedPage < 1) {
    return problem({...invalidQueryParameterProblem, detail: "page must be greater than or equal to 1"})
  }

  const myUserAndProfile = await profileService.findByUserUid(session.uid)

  if (!myUserAndProfile) {
    return problem({...badSessionProblem, detail: "your profile not found from your uid in session"})
  }

  const parsedNftId = nftId ? parseInt(nftId, 10) : undefined
  const parsedCommentId = commentId ? parseInt(commentId, 10) : undefined

  if (parsedNftId && !isNaN(parsedNftId)) {
    const showOnProfile = await profileService.findByNftId(parsedNftId)

    if (showOnProfile === "no_profile") {
      return problem(profileNotFoundProblem)
    }

    if (showOnProfile.visibilityType === "public") {
      const result: PaginatedCommentsResponse = await commentService.findCommentsPaginatedAndSorted(parsedNftId, myUserAndProfile.profile.id, parsedPage)

      return NextResponse.json(result)
    }

    const followState = await followService.getFollowState(myUserAndProfile.profile.id, showOnProfile.id)

    if (followState === "following") {
      const result: PaginatedCommentsResponse = await commentService.findCommentsPaginatedAndSorted(parsedNftId, myUserAndProfile.profile.id, parsedPage)

      return NextResponse.json(result)
    }

    return problem({...dontFollowProfileProblem, detail: "you must follow the profile to see the comments"})
  } else if (parsedCommentId && !isNaN(parsedCommentId)) {
    const showOnProfile = await profileService.findByCommentId(parsedCommentId)

    if (showOnProfile === "no_profile") {
      return problem(profileNotFoundProblem)
    }

    if (showOnProfile.visibilityType === "public") {
      const result: PaginatedCommentsResponse = await commentService.findReplyCommentsPaginatedAndSorted(parsedCommentId, myUserAndProfile.profile.id, parsedPage)

      return NextResponse.json(result)
    }

    const followState = await followService.getFollowState(myUserAndProfile.profile.id, showOnProfile.id)

    if (followState === "following") {
      const result: PaginatedCommentsResponse = await commentService.findReplyCommentsPaginatedAndSorted(parsedCommentId, myUserAndProfile.profile.id, parsedPage)

      return NextResponse.json(result)
    }

    return problem({...dontFollowProfileProblem, detail: "you must follow the profile to see the comments"})
  }

  return problem({...invalidQueryParameterProblem, detail: "nftId or commentId is required"})
})
