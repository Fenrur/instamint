import React from "react"
import {LoggedLayout} from "@/components/layout/logged-layout"
import {getServerSession} from "@/auth"
import {ConnectionHeader} from "./ssr"
import {Separator} from "@/components/ui/separator"
import {profileService} from "@/services"

export const dynamic = "force-dynamic"

interface ProfilePageProps {
  children: React.ReactNode,
  params: {
    slug: string
  }
}

export default async function ProfileLayout(props: ProfilePageProps) {
  const username = props.params.slug
  const session = await getServerSession()
  const getUserAndProfile = async () => {
    if (session) {
      return await profileService.findByUserUid(session.uid)
    }

    
return null
  }
  const userAndProfile = await getUserAndProfile()

  return (
    <>
      {
        session
          ? <LoggedLayout
            avatarUrl={userAndProfile ? userAndProfile.profile.avatarUrl : ""}
            headerText={username}
            selectedNavigation="search"
            username={userAndProfile ? userAndProfile.profile.username : ""}
            navigationHeader={true}
          >
            {
              props.children
            }
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
