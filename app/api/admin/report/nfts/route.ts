import {NextResponse} from "next/server"
import {
  badSessionProblem,
  invalidQueryParameterProblem,
  notAuthenticatedProblem,
  problem,
  notActivatedProblem
} from "@/http/problem"
import {userService, reportNftService} from "@/services"
import {auth, getSession} from "@/auth"

export const GET = auth(async (req) => {
  const url = req.nextUrl.clone()
  const page = url.searchParams.get("page")

  if (!page) {
    return problem({...invalidQueryParameterProblem, detail: "page query parameter is required"})
  }

  const parsedPage = parseInt(page, 10)

  if (isNaN(parsedPage)) {
    return problem({...invalidQueryParameterProblem, detail: "page query parameter must be a number"})
  }

  if (parsedPage <= 0) {
    return problem({...invalidQueryParameterProblem, detail: "page query parameter must be a minimum 1"})
  }

  const session = getSession(req)

  if (!session) {
    return problem({...notAuthenticatedProblem, detail: "you need to be authenticated to access"})
  }

  const myUser = await userService.findByUid(session.uid)

  if (myUser && myUser.role !== "admin") {
    return problem({...badSessionProblem, detail: "you don't have the right permissions"})
  }

  if (myUser && !myUser.isActivated) {
    return problem({...notActivatedProblem, detail: "your are not enable to access the app"})
  }

  if (myUser && myUser.role === "admin") {
    const result = await reportNftService.findAdminReportNftsPaginatedAndSorted(parsedPage)
    const response = mapReportNftsToResponse(result)

    return NextResponse.json(response)
  }
})

function mapReportNftsToResponse(reportNfts: {
  title: string,
  reason: string,
  user: string,
}[]) {
  return reportNfts.map(({title, reason, user}) => ({
    title,
    reason,
    user
  }))
}
