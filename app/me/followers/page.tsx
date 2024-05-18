import {profileService} from "@/services"
import {redirect} from "next/navigation"
import {createRedirectQueryParam} from "@/utils/url"
import {GenericFollowsProfilePage} from "../../profile/generic-follows-page"
import React from "react"
import {getServerSession} from "@/auth"

export default async function MyFollowersProfilePage() {
  const session = await getServerSession()

  if (!session) {
    redirect(`/login${createRedirectQueryParam(`/me/followers`)}`)
  }

  const userAndProfile = await profileService.findByUserUid(session.uid)

  if (!userAndProfile) {
    redirect(`/login${createRedirectQueryParam(`/me/followers`)}`)
  }

  return (
    <GenericFollowsProfilePage
      type={{onProfile: "me", section: "followers"}}
      username={userAndProfile.profile.username}
    />
  )
}
