import {auth, getSession} from "@/auth"
import {
  badSessionProblem,
  cantIgnoreYourselfProblem,
  dontRequestProfileProblem,
  invalidBodyProblem,
  invalidContentTypeProblem,
  notAuthenticatedProblem,
  problem,
  profileNotFoundProblem
} from "@/http/problem"
import {IgnoreProfileRequest} from "@/http/rest/types"
import {followService, profileService} from "@/services"
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

  const bodyParsedResult = IgnoreProfileRequest.safeParse(await req.json())
  if (!bodyParsedResult.success) {
    return problem({...invalidBodyProblem, detail: bodyParsedResult.error.errors})
  }

  const body = bodyParsedResult.data
  const myUserAndProfile = await profileService.findByUserUid(session.uid)

  if (!myUserAndProfile) {
    return problem({...badSessionProblem, detail: "your profile not found from your uid in session"})
  }

  const targetProfile = await profileService.findByUsername(body.username)

  if (!targetProfile) {
    return problem({...profileNotFoundProblem, detail: "target profile not fount"})
  }

  const result = await followService.ignoreRequestFollow(targetProfile.id, myUserAndProfile.profile.id)

  switch (result) {
    case "cant_ignore_yourself":
      return problem(cantIgnoreYourselfProblem)

    case "not_requesting_follow":
      return problem({...dontRequestProfileProblem, detail: `@${targetProfile.username} not requesting to follow you`})

    case "ignored_request_follow":
      return NextResponse.json({ignored: true}, {status: 200})
  }
})
