import {auth, getSession} from "@/auth";
import {NextAuthRequest} from "next-auth/lib";
import {notAuthenticatedProblem, problem} from "@/http/problem";
import {nftService} from "@/services";
import {NextResponse} from "next/server";

export const GET = auth(async (req: NextAuthRequest) => {
  const session = getSession(req)

  if (!session) {
    return problem({...notAuthenticatedProblem, detail: "you need to be authenticated"})
  }

  const result = await nftService.getAll()

  return NextResponse.json(result)
})
