import {NextResponse} from "next/server"
import {
  problem,
  invalidQueryParameterProblem,
  badSessionProblem,
  notAuthenticatedProblem,
  notActivatedProblem,
  invalidContentTypeProblem,
  invalidBodyProblem,
  userNotFoundProblem
} from "@/http/problem"
import {auth, getSession} from "@/auth"

import {userService, profileService} from "@/services"
import {isContentType} from "@/http/content-type"
import {DeleteUserResponse, DeleteUserRequest} from "@/http/rest/types"

export const DELETE  = auth(async (req) => {
  if (!isContentType(req, "json")) {
    return problem({...invalidContentTypeProblem, detail: "Content-Type must be application/json"})
  }

  const session = getSession(req)

  if (!session) {
    return problem(notAuthenticatedProblem)
  }

  const bodyParsedResult = DeleteUserRequest.safeParse(await req.json())

  if (!bodyParsedResult.success) {
    return problem({...invalidBodyProblem, detail: bodyParsedResult.error.errors})
  }

  const body = bodyParsedResult.data
  const id = body.id
  const myUserAndProfile = await profileService.findByUserUid(session.uid)

  if (!myUserAndProfile) {
    return problem({...badSessionProblem, detail: "your profile not found from your uid in session"})
  }

  if (!myUserAndProfile.isActivated) {
    return problem({...notActivatedProblem, detail: "your are not enable to access the app"})
  }

  if (myUserAndProfile.role !== "admin") {
    return problem({...badSessionProblem, detail: "you don't have the right permissions"})
  }

  if (!id) {
    return problem({...invalidQueryParameterProblem, detail: "id query parameter is required"})
  }

  const result = await userService.deleteUserById(String(id))

  switch(result) {
    case "user_not_found":
      return problem(userNotFoundProblem)

    case "deleted":
      return NextResponse.json({deleted: true} satisfies DeleteUserResponse)
  }
})
