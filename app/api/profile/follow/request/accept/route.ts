import {auth, getSession} from "@/auth"
import {
  alreadyFollowProfileProblem,
  badSessionProblem,
  cantAcceptYourselfProblem,
  dontRequestProfileProblem,
  invalidBodyProblem,
  invalidContentTypeProblem,
  notAuthenticatedProblem,
  problem,
  profileNotFoundProblem
} from "@/http/problem"
import {AcceptFollowProfileRequest} from "@/http/rest/types"
import {followService, profileService} from "@/services"
import {NextResponse} from "next/server"
import {DateTime} from "luxon"
import {isContentType} from "@/http/content-type"

export const POST = auth(async (req) => {
  if (!isContentType(req, "json")) {
    return problem({...invalidContentTypeProblem, detail: "Content-Type must be application/json"})
  }

  const session = getSession(req)
  const followAt = DateTime.utc()

  if (!session) {
    return problem(notAuthenticatedProblem)
  }

  let parsedBody = null

  try {
    parsedBody = AcceptFollowProfileRequest.parse(await req.json())
  } catch (e: any) {
    return problem({...invalidBodyProblem, detail: e.errors})
  }

  const myUserAndProfile = await profileService.findByUserUid(session.uid)

  if (!myUserAndProfile) {
    return problem({...badSessionProblem, detail: "your profile not found from your uid in session"})
  }

  const targetProfile = await profileService.findByUsername(parsedBody.username)

  if (!targetProfile) {
    return problem({...profileNotFoundProblem, detail: "target profile not fount"})
  }

  const result = await followService.acceptRequestFollow(targetProfile.id, myUserAndProfile.profile.id, followAt)

  switch (result) {
    case "cant_accept_yourself":
      return problem(cantAcceptYourselfProblem)

    case "not_requesting_follow":
      return problem({...dontRequestProfileProblem, detail: `@${parsedBody.username} not request to follow you`})

    case "already_follow":
      return problem(alreadyFollowProfileProblem)

    case "accepted_request_follow":
      return NextResponse.json({accepted: true}, {status: 200})
  }
})
