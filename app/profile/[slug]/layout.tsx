import React from "react"
import {LoggedLayout} from "@/components/layout/logged-layout"
import {getServerSession} from "@/auth"

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
          : props.children
      }
    </>
  )
}
