import {auth, getSession} from "@/auth"
// @ts-expect-error
import {NextAuthRequest} from "next-auth/lib"
import {invalidQueryParameterProblem, notAuthenticatedProblem, problem, userNotFoundProblem} from "@/http/problem"
import {profileService} from "@/services"
import {NextResponse} from "next/server"
import fs from "fs"
import path from "path"

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

  if (!imageFile) {
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

  const imageType = (imageFile as string).split(";")[0].split(":")[1].split("/")[1]

  if (!imageType) {
    return problem({...invalidQueryParameterProblem, detail: "Invalid image format"})
  }

  // Convert imageFile to binary data
  const data = (imageFile as string).replace(/^data:image\/\w+;base64,/, "")
  const imageBuffer = Buffer.from(data, "base64")
  // Set the path where the image will be saved
  const filePath = path.join(process.cwd(), "public", "uploads", `${username}.${imageType}`)

  // Write the image data to the file
  fs.writeFileSync(filePath, imageBuffer)

  // Construct the avatar URL
  const avatarUrl = `/uploads/${username}.${imageType}`
  const result = await profileService.updateProfileByUid(session.uid, username, bio, link, avatarUrl)

  return NextResponse.json(result)
})
