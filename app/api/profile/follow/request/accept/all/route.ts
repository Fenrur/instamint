import {auth, getSession} from "@/auth"
import {DateTime} from "luxon"
import {
  badSessionProblem,
  invalidBodyProblem,
  invalidContentTypeProblem,
  notAuthenticatedProblem,
  problem
} from "@/http/problem"
import {followService, profileService} from "@/services"
import {AcceptAllFollowProfileRequest} from "@/http/rest/types"
import {NextResponse} from "next/server"
import {isContentType} from "@/http/content-type"

export const PUT = auth(async (req) => {
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
    parsedBody = AcceptAllFollowProfileRequest.parse(await req.json())
  } catch (e: any) {
    return problem({...invalidBodyProblem, detail: e.errors})
  }

  const myUserAndProfile = await profileService.findByUserUid(session.uid)

  if (!myUserAndProfile) {
    return problem({...badSessionProblem, detail: "your profile not found from your uid in session"})
  }

  await followService.acceptAllRequestFollows(myUserAndProfile.profile.id, followAt, parsedBody.ignored)

  return NextResponse.json({acceptedAll: true}, {status: 200})
})
