import {auth, getSession} from "@/auth"
import {
  badSessionProblem,
  dontRequestProfileProblem,
  invalidBodyProblem,
  invalidContentTypeProblem,
  notAuthenticatedProblem,
  problem,
  profileNotFoundProblem,
  notActivatedProblem
} from "@/http/problem"
import {UnIgnoreProfileRequest} from "@/http/rest/types"
import {followService, profileService} from "@/services"
import {NextResponse} from "next/server"
import {isContentType} from "@/http/content-type"
import {StatusCodes} from "http-status-codes"

export const POST = auth(async (req) => {
  if (!isContentType(req, "json")) {
    return problem({...invalidContentTypeProblem, detail: "Content-Type must be application/json"})
  }

  const session = getSession(req)

  if (!session) {
    return problem(notAuthenticatedProblem)
  }

  const bodyParsedResult = UnIgnoreProfileRequest.safeParse(await req.json())

  if (!bodyParsedResult.success) {
    return problem({...invalidBodyProblem, detail: bodyParsedResult.error.errors})
  }

  const body = bodyParsedResult.data
  const myUserAndProfile = await profileService.findByUserUid(session.uid)

  if (!myUserAndProfile) {
    return problem({...badSessionProblem, detail: "your profile not found from your uid in session"})
  }

  if (!myUserAndProfile.isActivated) {
    return problem({...notActivatedProblem, detail: "your are not enable to access the app"})
  }

  const targetProfile = await profileService.findByUsername(body.username)

  if (!targetProfile) {
    return problem({...profileNotFoundProblem, detail: "target profile not fount"})
  }

  const result = await followService.unIgnoreRequestFollow(myUserAndProfile.profile.id, targetProfile.id)

  switch (result) {
    case "unignored_request_follow":
      return NextResponse.json({unignored: true}, {status: StatusCodes.OK})

    case "not_requesting_follow":
      return problem(dontRequestProfileProblem)
  }
})
