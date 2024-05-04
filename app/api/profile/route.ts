import {auth, getSession} from "@/auth"
import {NextAuthRequest} from "next-auth/lib"
import {invalidQueryParameterProblem, notAuthenticatedProblem, problem, userNotFoundProblem} from "@/http/problem"
import {profileService} from "@/services"
import {NextResponse} from "next/server"

export const GET = auth(async (req: NextAuthRequest) => {
    const session = getSession(req)

    if (!session) {
        return problem({...notAuthenticatedProblem, detail: "you need to be authenticated to see this private profile"})
    }

    const myUserAndProfile = await profileService.findByUserUid(session.uid)

    if (!myUserAndProfile) {
        return problem({...userNotFoundProblem, detail: "my user not found"})
    }

    const result = await profileService.findByUserUid(session.uid)

    return NextResponse.json(result)
})

export const POST = auth(async (req: NextAuthRequest) => {
    const url = req.nextUrl.clone()
    const username = url.searchParams.get("username") as string
    const bio = url.searchParams.get("bio") as string
    const link = url.searchParams.get("link") as string
    const avatar = url.searchParams.get("avatar") as string


    if (!username) {
        return problem({...invalidQueryParameterProblem, detail: "username is required"})
    }

    if (!bio) {
        return problem({...invalidQueryParameterProblem, detail: "bio is required"})
    }

    if (!link) {
        return problem({...invalidQueryParameterProblem, detail: "link is required"})
    }

    if (!avatar) {
        return problem({...invalidQueryParameterProblem, detail: "avatar is required"})
    }

    const session = getSession(req)

    if (!session) {
        return problem({...notAuthenticatedProblem, detail: "you need to be authenticated to see this private profile"})
    }

    const myUserAndProfile = await profileService.findByUserUid(session.uid)

    if (!myUserAndProfile) {
        return problem({...userNotFoundProblem, detail: "my user not found"})
    }

    //TODO: upload the image to s3 and get the url
    const avatarUrl = "https://api.dicebear.com/8.x/pixel-art/svg?seed=alexis"
    const result = await profileService.updateProfileByUid(session.uid, username, bio, link, avatarUrl)

    return NextResponse.json(result)
})
