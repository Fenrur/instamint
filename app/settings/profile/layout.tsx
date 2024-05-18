import React from "react"
import {LoggedLayout} from "@/components/layout/logged-layout"
import {getServerSession} from "@/auth"
import {Separator} from "@/components/ui/separator"
import {profileService} from "@/services"
import {ConnectionHeader} from "../../profile/[slug]/ssr"
import {ReactQueryClientProvider} from "@/components/ReactQueryClientProvider"

export const dynamic = "force-dynamic"

interface ProfilePageProps {
  children: React.ReactNode,
}

export default async function ProfileLayout(props: ProfilePageProps) {
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
          ? <LoggedLayout
            avatarUrl={avatarUrl}
            headerText={username}
            selectedNavigation="own_profile"
            username={username}
            navigationHeader={false}
          >
            <ReactQueryClientProvider>
              {
                props.children
              }
            </ReactQueryClientProvider>
          </LoggedLayout>
          : <>
            <div className="flex justify-center">
              <div className="grid max-w-[940px] w-full">
                <ConnectionHeader username={username} className="max-w-[940px]"/>
              </div>
            </div>
            <Separator/>
            {props.children}
          </>
      }
    </>
  )
}
