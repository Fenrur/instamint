import {auth, getSession} from "@/auth"
import {
  badSessionProblem,
  dontRequestProfileProblem,
  invalidBodyProblem,
  invalidContentTypeProblem,
  notAuthenticatedProblem,
  problem,
  profileNotFoundProblem,
  notActivated
} from "@/http/problem"
import {UnIgnoreProfileRequest} from "@/http/rest/types"
import {followService, profileService, userService} from "@/services"
import {NextResponse} from "next/server"
import {isContentType} from "@/http/content-type"

export const POST = auth(async (req) => {
  if (!isContentType(req, "json")) {
    return problem({...invalidContentTypeProblem, detail: "Content-Type must be application/json"})
  }

  const session = getSession(req)

  if (!session) {
    return problem(notAuthenticatedProblem)
  }

  let parsedBody = null

  try {
    parsedBody = UnIgnoreProfileRequest.parse(await req.json())
  } catch (e: any) {
    return problem({...invalidBodyProblem, detail: e.errors})
  }

  const myUserAndProfile = await profileService.findByUserUid(session.uid)

  if (!myUserAndProfile) {
    return problem({...badSessionProblem, detail: "your profile not found from your uid in session"})
  }

  const userActivated = await userService.findByUid(session.uid)

  if (userActivated && !userActivated.isActivated) {
    return problem({...notActivated, detail: "your are not enable to access the app"})
  }

  const targetProfile = await profileService.findByUsername(parsedBody.username)

  if (!targetProfile) {
    return problem({...profileNotFoundProblem, detail: "target profile not fount"})
  }

  const result = await followService.unIgnoreRequestFollow(myUserAndProfile.profile.id, targetProfile.id)

  switch (result) {
    case "unignored_request_follow":
      return NextResponse.json({unignored: true}, {status: 200})

    case "not_requesting_follow":
      return problem(dontRequestProfileProblem)
  }
})
