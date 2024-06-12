import {auth, getSession} from "@/auth"
// @ts-expect-error TODO fix library not found
import {NextAuthRequest} from "next-auth/lib"
import {invalidQueryParameterProblem, notAuthenticatedProblem, problem} from "@/http/problem"
import {profileService, reportProfileService} from "@/services"
import {NextResponse} from "next/server"
import {ReportProfileRequest} from "@/http/rest/types"
import {StatusCodes} from "http-status-codes"

export const POST = auth(async (req: NextAuthRequest) => {
  const formData = ReportProfileRequest.parse(await req.json())
  const reportedProfileId = formData.reportedProfileId
  const reason = formData.reason

  if (!reportedProfileId) {
    return problem({...invalidQueryParameterProblem, detail: "reportedProfileId is required"})
  }

  const session = getSession(req)

  if (!session) {
    return problem({...notAuthenticatedProblem, detail: "you need to be authenticated to see this private profile"})
  }

  const myUserAndProfile = await profileService.findByUserUid(session.uid)

  if (!myUserAndProfile) {
    return problem({...notAuthenticatedProblem, detail: "user profile not found"})
  }

  const result = await reportProfileService.create(myUserAndProfile.id, reportedProfileId, reason)

  return NextResponse.json(Boolean(result), {status: StatusCodes.OK})
})
