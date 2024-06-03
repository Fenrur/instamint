import {Metadata} from "next"
import {Separator} from "@/components/ui/separator"
import {LoggedLayout} from "@/components/layout/logged-layout"
import React from "react"
import {getServerSession} from "@/auth"
import {profileService} from "@/services"
import {ConnectionHeader} from "../profile/[slug]/ssr"

export const metadata: Metadata = {
  title: "Settings",
  description: "instamint settings page",
}

interface SettingsPageProps {
  children: React.ReactNode,
}

export default async function SettingsLayout({children}: SettingsPageProps) {
  const session = await getServerSession()
  const getUserAndProfile = async () => {
    if (session) {
      return await profileService.findByUserUid(session.uid)
    }

    return null
  }
  const userAndProfile = await getUserAndProfile()
  const username = userAndProfile?.profile.username || ""
  const avatarUrl = userAndProfile?.profile.avatarUrl || ""

  return (
    <>
      {
        session
          ? <LoggedLayout headerText={""}
                          selectedNavigation={"settings"}
                          username={username}
                          avatarUrl={avatarUrl}
                          navigationHeader={false}>
            <div className="p-5 md:p-10 md:pb-16">
              <div className="space-y-6">
                <h2 className="text-2xl font-bold tracking-tight">Settings</h2>
              </div>
              <Separator className="my-6"/>
              {children}
            </div>

          </LoggedLayout> : <>
            <div className="flex justify-center">
              <div className="grid max-w-[940px] w-full">
                <ConnectionHeader username={username} className="max-w-[940px]"/>
              </div>
            </div>
            <Separator/>
            {children}
          </>
      }
    </>
  )
}
