import {auth, getSession} from "@/auth"
import {isContentType} from "@/http/content-type"
import {
  alreadyMintedCommentProblem,
  badSessionProblem,
  commentNotFoundProblem,
  dontFollowProfileProblem,
  invalidBodyProblem,
  invalidContentTypeProblem,
  notAuthenticatedProblem,
  notMintedCommentProblem,
  problem,
  profileNotFoundProblem
} from "@/http/problem"
import {MintCommentRequest, UnmintCommentRequest} from "@/http/rest/types"
import {followService, mintCommentService, profileService} from "@/services"
import {DateTime} from "luxon"
import {NextResponse} from "next/server"
import {StatusCodes} from "http-status-codes"

export const POST = auth(async (req) => {
  if (!isContentType(req, "json")) {
    return problem({...invalidContentTypeProblem, detail: "Content-Type must be application/json"})
  }

  const mintAt = DateTime.utc()
  const session = getSession(req)

  if (!session) {
    return problem(notAuthenticatedProblem)
  }

  const bodyParsedResult = MintCommentRequest.safeParse(await req.json())

  if (!bodyParsedResult.success) {
    return problem({...invalidBodyProblem, detail: bodyParsedResult.error.errors})
  }

  const body = bodyParsedResult.data
  const myUserAndProfile = await profileService.findByUserUid(session.uid)

  if (!myUserAndProfile) {
    return problem({...badSessionProblem, detail: "your profile not found from your uid in session"})
  }

  const showOnProfile = await profileService.findByCommentId(body.commentId)

  if (showOnProfile === "no_profile") {
    return problem(profileNotFoundProblem)
  }

  if (showOnProfile.visibilityType === "public") {
    const result = await mintCommentService.mint(body.commentId, myUserAndProfile.profile.id, mintAt)

    switch (result) {
      case "comment_not_found":
        return problem(commentNotFoundProblem)

      case "already_minted":
        return problem(alreadyMintedCommentProblem)

      case "minted":
        return NextResponse.json({message: "minted"}, {status: StatusCodes.CREATED})
    }
  }

  const followState = await followService.getFollowState(myUserAndProfile.profile.id, showOnProfile.id)

  if (followState === "following") {
    const result = await mintCommentService.mint(body.commentId, myUserAndProfile.profile.id, mintAt)

    switch (result) {
      case "comment_not_found":
        return problem(commentNotFoundProblem)

      case "already_minted":
        return problem(alreadyMintedCommentProblem)

      case "minted":
        return NextResponse.json({message: "minted"}, {status: StatusCodes.CREATED})
    }
  }

  return problem({...dontFollowProfileProblem, detail: "You must follow the profile to mint this comment"})
})

export const DELETE = auth(async (req) => {
  if (!isContentType(req, "json")) {
    return problem({...invalidContentTypeProblem, detail: "Content-Type must be application/json"})
  }

  const session = getSession(req)

  if (!session) {
    return problem(notAuthenticatedProblem)
  }

  const bodyParsedResult = UnmintCommentRequest.safeParse(await req.json())

  if (!bodyParsedResult.success) {
    return problem({...invalidBodyProblem, detail: bodyParsedResult.error.errors})
  }

  const body = bodyParsedResult.data
  const myUserAndProfile = await profileService.findByUserUid(session.uid)

  if (!myUserAndProfile) {
    return problem({...badSessionProblem, detail: "your profile not found from your uid in session"})
  }

  const showOnProfile = await profileService.findByCommentId(body.commentId)

  if (showOnProfile === "no_profile") {
    return problem(profileNotFoundProblem)
  }

  if (showOnProfile.visibilityType === "public") {
    const result = await mintCommentService.unmint(body.commentId, myUserAndProfile.profile.id)

    switch (result) {
      case "comment_not_found":
        return problem(commentNotFoundProblem)

      case "not_minted":
        return problem(notMintedCommentProblem)

      case "unminted":
        return NextResponse.json({message: "unminted"})
    }
  }

  const followState = await followService.getFollowState(myUserAndProfile.profile.id, showOnProfile.id)

  if (followState === "following") {
    const result = await mintCommentService.unmint(body.commentId, myUserAndProfile.profile.id)

    switch (result) {
      case "comment_not_found":
        return problem(commentNotFoundProblem)

      case "not_minted":
        return problem(notMintedCommentProblem)

      case "unminted":
        return NextResponse.json({message: "unminted"})
    }
  }

  return problem({...dontFollowProfileProblem, detail: "You must follow the profile to unmint this comment"})
})
