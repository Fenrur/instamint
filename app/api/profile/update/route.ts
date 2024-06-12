import {
  invalidQueryParameterProblem,
  linkAlreadyUsedProblem,
  notAuthenticatedProblem,
  problem,
  usernameAlreadyUsedProblem,
  userNotFoundProblem
} from "@/http/problem"
import {profileService} from "@/services"
import {auth, getSession} from "@/auth"
// @ts-expect-error TODO fix library not found
import {NextAuthRequest} from "next-auth/lib"
import {NextResponse} from "next/server"


export const POST = auth(async (req: NextAuthRequest) => {
  //Const formData = await req.formData()
  const formData = await req.json()
  const username = formData.username as string
  const bio = formData.bio as string
  const link = formData.link as string
  const imageFile = formData.avatar as string

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
    return problem({...notAuthenticatedProblem, detail: "you need to be authenticated to see this private profile"})
  }

  const myUserAndProfile = await profileService.findByUserUid(session.uid)

  if (!myUserAndProfile) {
    return problem({...userNotFoundProblem, detail: "my user not found"})
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

    const data = (imageFile).replace(/^data:image\/\w+;base64,/, "")
    imageBuffer = Buffer.from(data, "base64")
  }

  const result = await profileService.updateProfileByUid(session.uid, username, bio, link, imageBuffer, imageType)

  return NextResponse.json({uid: result[0].id.toString()})
})

