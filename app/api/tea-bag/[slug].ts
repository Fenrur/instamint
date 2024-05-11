import {auth, getSession} from "@/auth"
import {NextAuthRequest} from "next-auth/lib"
import {notAuthenticatedProblem, problem} from "@/http/problem"
import {nftService, profileService} from "@/services"
import {NextResponse} from "next/server"

export const GET = auth(async (req: NextAuthRequest) => {
    const session = getSession(req)

    if (!session) {
        return problem({...notAuthenticatedProblem, detail: "you need to be authenticated"})
    }

    const {slug} = req.query as { slug: number }
    const profile = await profileService.findByProfileId(slug)
    const nfts = await nftService.findByProfileId(slug)

    return NextResponse.json({profile, nfts})
})
