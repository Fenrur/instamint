import {profileService} from "@/services"
import {redirect} from "next/navigation"
import {createRedirectQueryParam} from "@/utils/url"
import {GenericFollowsProfilePage} from "../../profile/generic-follows-page"
import React from "react"
import {getServerSession} from "@/auth"

export default async function MyFollowsProfilePage() {
  const session = await getServerSession()

  if (!session) {
    redirect(`/login${createRedirectQueryParam(`/me/follows`)}`)
  }

  const userAndProfile = await profileService.findByUserUid(session.uid)

  if (!userAndProfile) {
    redirect(`/login${createRedirectQueryParam(`/me/follows`)}`)
  }

  return (
    <GenericFollowsProfilePage
      type={{onProfile: "me", section: "follows"}}
      username={userAndProfile.profile.username}
    />
  )
}
