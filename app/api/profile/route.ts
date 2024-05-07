import {auth, getSession} from "@/auth"
import {NextAuthRequest} from "next-auth/lib"
import {invalidQueryParameterProblem, notAuthenticatedProblem, problem, userNotFoundProblem} from "@/http/problem"
import {profileService} from "@/services"
import {NextResponse} from "next/server"
import {S3} from "@aws-sdk/client-s3";
import {env} from "@/env"

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
    const formData = await req.formData();
    const username = formData.get("username") as string
    const bio = formData.get("bio") as string
    const link = formData.get("link") as string
    const avatarBase64 = formData.get("avatar") as string


    if (!username) {
        return problem({...invalidQueryParameterProblem, detail: "username is required"})
    }

    if (!bio) {
        return problem({...invalidQueryParameterProblem, detail: "bio is required"})
    }

    if (!link) {
        return problem({...invalidQueryParameterProblem, detail: "link is required"})
    }

    if (!avatarBase64) {
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
    // Decode Base64 to binary
    const avatarBuffer = Buffer.from(avatarBase64, 'base64');


    const avatarUrl = "test.com";
    const result = await profileService.updateProfileByUid(session.uid, username, bio, link, avatarUrl);

    return NextResponse.json(result)
})
