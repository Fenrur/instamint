import {auth, getSession} from "@/auth"
// @ts-expect-error TODO fix library not found
import {NextAuthRequest} from "next-auth/lib"
import {invalidQueryParameterProblem, notAuthenticatedProblem, problem} from "@/http/problem"
import {reportProfileService} from "@/services"
import {NextResponse} from "next/server"

export const POST = auth(async (req: NextAuthRequest) => {
    const formData = await req.formData()
    const username = formData.get("username") as string


    if (!username) {
        return problem({...invalidQueryParameterProblem, detail: "username is required"})
    }

    const session = getSession(req)

    if (!session) {
        return problem({...notAuthenticatedProblem, detail: "you need to be authenticated to see this private profile"})
    }

    const result = await reportProfileService.create(0, 0, "")

    return NextResponse.json(result)
})
