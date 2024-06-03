import {auth, getSession} from "@/auth"
import {isContentType} from "@/http/content-type"
import {
  alreadyMintedNftProblem,
  badSessionProblem, invalidBodyProblem,
  invalidContentTypeProblem, nftNotFoundProblem,
  notAuthenticatedProblem, notMintedNftProblem,
  problem
} from "@/http/problem"
import {MintNftRequest, UnmintNftRequest} from "@/http/rest/types"
import {mintService, profileService} from "@/services"
import {DateTime} from "luxon"
import {NextResponse} from "next/server"
import {StatusCodes} from "http-status-codes"

export const POST = auth(async (req) => {
  if (!isContentType(req, "json")) {
    return problem({...invalidContentTypeProblem, detail: "Content-Type must be application/json"})
  }

  const mintAt = DateTime.utc()
  const session = getSession(req)

  if (!session) {
    return problem(notAuthenticatedProblem)
  }

  const bodyParsedResult = MintNftRequest.safeParse(await req.json())

  if (!bodyParsedResult.success) {
    return problem({...invalidBodyProblem, detail: bodyParsedResult.error.errors})
  }

  const body = bodyParsedResult.data
  const myUserAndProfile = await profileService.findByUserUid(session.uid)

  if (!myUserAndProfile) {
    return problem({...badSessionProblem, detail: "your profile not found from your uid in session"})
  }

  const result = await mintService.mint(body.nftId, myUserAndProfile.profile.id, mintAt)

  switch (result) {
    case "nft_not_found":
      return problem(nftNotFoundProblem)

    case "already_minted":
      return problem(alreadyMintedNftProblem)

    case "minted":
      return NextResponse.json({message: "minted"}, {status: StatusCodes.CREATED})
  }
})

export const DELETE = auth(async (req) => {
  if (!isContentType(req, "json")) {
    return problem({...invalidContentTypeProblem, detail: "Content-Type must be application/json"})
  }

  const session = getSession(req)

  if (!session) {
    return problem(notAuthenticatedProblem)
  }

  const bodyParsedResult = UnmintNftRequest.safeParse(await req.json())

  if (!bodyParsedResult.success) {
    return problem({...invalidBodyProblem, detail: bodyParsedResult.error.errors})
  }

  const body = bodyParsedResult.data
  const myUserAndProfile = await profileService.findByUserUid(session.uid)

  if (!myUserAndProfile) {
    return problem({...badSessionProblem, detail: "your profile not found from your uid in session"})
  }

  const result = await mintService.unmint(body.nftId, myUserAndProfile.profile.id)

  switch (result) {
    case "nft_not_found":
      return problem(nftNotFoundProblem)

    case "not_minted":
      return problem(notMintedNftProblem)

    case "unminted":
      return NextResponse.json({message: "unminted"})
  }
})
