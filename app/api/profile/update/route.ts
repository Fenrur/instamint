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
import path from "path"
import fs from "fs"
import {NextResponse} from "next/server"


export const POST = auth(async (req: NextAuthRequest) => {
  const formData = await req.formData()
  const username = formData.get("username") as string
  const bio = formData.get("bio") as string
  const link = formData.get("link") as string
  const imageFile = formData.get("avatar") as FormDataEntryValue


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

  const isUsernameAlreadyUsed = await profileService.isUsernameExist(username)

  if (isUsernameAlreadyUsed) {
    return problem({...usernameAlreadyUsedProblem, detail: "username already used"})
  }

  const isLinkAlreadyUsed = await profileService.isLinkExist(link)

  if (isLinkAlreadyUsed) {
    return problem({...linkAlreadyUsedProblem, detail: "link already used"})
  }

  let avatarUrl = null

  if (!imageFile) {
    const imageType = (imageFile).split(";")[0].split(":")[1].split("/")[1]

    if (!imageType) {
      return problem({...invalidQueryParameterProblem, detail: "Invalid image format"})
    }

    // Convert imageFile to binary data
    const data = (imageFile).replace(/^data:image\/\w+;base64,/, "")
    const imageBuffer = Buffer.from(data, "base64")
    // Set the path where the image will be saved
    const filePath = path.join(process.cwd(), "public", "uploads", `${username}.${imageType}`)

    // Write the image data to the file
    fs.writeFileSync(filePath, imageBuffer)
    // Construct the avatar URL
    avatarUrl = `/uploads/${username}.${imageType}`
  }

  const result = await profileService.updateProfileByUid(session.uid, username, bio, link, avatarUrl ?? myUserAndProfile.profile.avatarUrl)

  return NextResponse.json(result)
})

