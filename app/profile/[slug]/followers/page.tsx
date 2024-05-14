import {GenericFollowsProfilePage} from "../../generic-follows-page"
import {getServerSession} from "@/auth"
import {redirect} from "next/navigation"
import {createRedirectQueryParam} from "@/utils/url"
import {profileService} from "@/services"
import React from "react"

interface FollowsProfilePageProps {
  params: {
    slug: string
  }
}

export default async function FollowersProfilePage(props: FollowsProfilePageProps) {
  const session = await getServerSession()

  if (!session) {
    redirect(`/login${createRedirectQueryParam(`/profile/${props.params.slug}/followers`)}`)
  }

  const userAndProfile = await profileService.findByUserUid(session.uid)

  if (!userAndProfile) {
    redirect(`/login${createRedirectQueryParam(`/profile/${props.params.slug}/followers`)}`)
  }

  if (userAndProfile.profile.username.toLowerCase() === props.params.slug) {
    redirect("/me/followers")
  }

  return (
    <GenericFollowsProfilePage
      type={{onProfile: "other", section: "followers"}}
      username={props.params.slug}
    />
  )
}
