import React from "react"
import {LoggedLayout} from "@/components/layout/logged-layout"
import {getServerSession} from "@/auth"
import {ConnectionHeader} from "./ssr"
import {Separator} from "@/components/ui/separator"

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

  return (
    <>
      {
        session
          ? <LoggedLayout headerText={username} selectedNavigation={"search"}>{props.children}</LoggedLayout>
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
