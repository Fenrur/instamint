import {NextResponse} from "next/server"
import {
  invalidQueryParameterProblem,
  linkAlreadyUsedProblem,
  notAuthenticatedProblem,
  problem,
  usernameAlreadyUsedProblem,
  userNotFoundProblem
} from "@/http/problem"
import {profileService, teaBagService} from "@/services"
import {auth, getSession} from "@/auth"
// @ts-expect-error TODO fix library not found
import {NextAuthRequest} from "next-auth/lib"
import {DateTime} from "luxon"

export const POST = auth(async (req: NextAuthRequest) => {
  const data = await req.formData()
  const profileId = Number.parseInt(data.get("profileId") as string, 10)
  const username = data.get("username") as string
  const bio = data.get("bio") as string
  const link = data.get("link") as string
  const nftIds = JSON.parse(data.get("nftIds") as string) as number[]
  const whitelistUserIds = JSON.parse(data.get("whitelistUserIds") as string) as number[]
  const whitelistStart = data.get("whitelistStart") as DateTime
  const whitelistEnd = data.get("whitelistEnd") as DateTime
  const imageFile = data.get("avatar") as string

  if (!profileId) {
    return problem({...invalidQueryParameterProblem, detail: "profileId is required"})
  }

  if (!username) {
    return problem({...invalidQueryParameterProblem, detail: "username is required"})
  }

  if (!bio) {
    return problem({...invalidQueryParameterProblem, detail: "bio is required"})
  }

  if (!link) {
    return problem({...invalidQueryParameterProblem, detail: "link is required"})
  }

  const session = getSession(req)

  if (!session) {
    return problem({...notAuthenticatedProblem, detail: "You need to be authenticated to update this profile"})
  }

  const myUserAndProfile = await profileService.findByUserUid(session.uid)

  if (!myUserAndProfile || myUserAndProfile.profile.id !== profileId) {
    return problem({...userNotFoundProblem, detail: "User profile not found or unauthorized"})
  }

  if (username !== myUserAndProfile.profile.username) {
    const isUsernameAlreadyUsed = await profileService.isUsernameExist(username)

    if (isUsernameAlreadyUsed) {
      return problem({...usernameAlreadyUsedProblem, detail: "username already used"})
    }
  }

  if (link !== myUserAndProfile.profile.link) {
    const isLinkAlreadyUsed = await profileService.isLinkExist(link)

    if (isLinkAlreadyUsed) {
      return problem({...linkAlreadyUsedProblem, detail: "link already used"})
    }
  }

  let imageBuffer = null
  let imageType = null

  if (imageFile) {
    imageType = (imageFile).split(";")[0].split(":")[1].split("/")[1]

    if (!imageType) {
      return problem({...invalidQueryParameterProblem, detail: "Invalid image format"})
    }

    // Convert imageFile to binary data
    const data = (imageFile).replace(/^data:image\/\w+;base64,/, "")
    imageBuffer = Buffer.from(data, "base64")
  }

  const result = await teaBagService.update({
    profileId,
    username,
    bio,
    link,
    nftIds,
    whitelistUserIds,
    whitelistStart,
    whitelistEnd,
  }, imageBuffer, imageType)

  return NextResponse.json(result)
})
