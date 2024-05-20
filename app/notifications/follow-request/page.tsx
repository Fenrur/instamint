import {LoggedLayout} from "@/components/layout/logged-layout"
import {getServerSession} from "@/auth"
import {redirect} from "next/navigation"
import {profileService} from "@/services"
import React from "react"
import {FollowRequestPageContent} from "./csr"

export default async function FollowRequestPage() {
  const session = await getServerSession()

  if (!session) {
    redirect(`/login?redirect=${encodeURIComponent("/notifications")}`)
  }

  const userAndProfile = await profileService.findByUserUid(session.uid)

  if (!userAndProfile) {
    redirect(`/login?redirect=${encodeURIComponent("/notifications")}`)
  }

  return (
    <LoggedLayout
      headerText="Notifications"
      selectedNavigation="notifications"
      username={userAndProfile.profile.username}
      avatarUrl={userAndProfile.profile.avatarUrl}
      navigationHeader={true}
    >
      <main>
        <div className="flex justify-center pt-2">
          <FollowRequestPageContent/>
        </div>
      </main>
    </LoggedLayout>
  )
}
