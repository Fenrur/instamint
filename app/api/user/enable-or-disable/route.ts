import {NextResponse} from "next/server"
import {
  problem,
  badSessionProblem,
  notAuthenticatedProblem,
  notActivatedProblem,
  invalidBodyProblem,
  invalidContentTypeProblem,
  userNotFoundProblem
} from "@/http/problem"
import {auth, getSession} from "@/auth"

import {userService, profileService} from "@/services"
import {EnableOrDisableRequest, EnableOrDisableResponse} from "@/http/rest/types"
import {isContentType} from "@/http/content-type"

export const PATCH  = auth(async (req) => {
  if (!isContentType(req, "json")) {
      return problem({...invalidContentTypeProblem, detail: "Content-Type must be application/json"})
  }

  const session = getSession(req)

  if (!session) {
    return problem({...notAuthenticatedProblem, detail: "User is not authenticated"})
  }

  const bodyParsedResult = EnableOrDisableRequest.safeParse(await req.json())

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

  const result = await userService.enableOrDisable(id)

  switch (result) {
    case "user_not_found":
      return problem(userNotFoundProblem)

    case "disabled":
      return NextResponse.json({type: "disabled"} satisfies EnableOrDisableResponse)

    case "enabled":
      return NextResponse.json({type: "enabled"} satisfies EnableOrDisableResponse)
  }
})
