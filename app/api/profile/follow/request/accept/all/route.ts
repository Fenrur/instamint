import {auth, getSession} from "@/auth"
import {DateTime} from "luxon"
import {
  badSessionProblem,
  invalidBodyProblem,
  invalidContentTypeProblem,
  notAuthenticatedProblem,
  problem,
  notActivatedProblem
} from "@/http/problem"
import {followService, profileService} from "@/services"
import {AcceptAllFollowProfileRequest} from "@/http/rest/types"
import {NextResponse} from "next/server"
import {isContentType} from "@/http/content-type"
import {StatusCodes} from "http-status-codes"

export const PUT = auth(async (req) => {
  if (!isContentType(req, "json")) {
    return problem({...invalidContentTypeProblem, detail: "Content-Type must be application/json"})
  }

  const session = getSession(req)
  const followAt = DateTime.utc()

  if (!session) {
    return problem(notAuthenticatedProblem)
  }

  const bodyParsedResult = AcceptAllFollowProfileRequest.safeParse(await req.json())

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

  await followService.acceptAllRequestFollows(myUserAndProfile.profile.id, followAt, body.ignored)

  return NextResponse.json({acceptedAll: true}, {status: StatusCodes.OK})
})
