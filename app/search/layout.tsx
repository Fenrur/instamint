import React from "react"
import {LoggedLayout} from "@/components/layout/logged-layout"

export const dynamic = "force-dynamic"


interface SearchPageProps {
  children: React.ReactNode,
  params: {
    slug: string
  }
}

export default async function LayoutSearchPage(props: SearchPageProps) {
  const username = props.params.slug;

  return (
    <LoggedLayout headerText={username} selectedNavigation={"search"}>
      {props.children}
    </LoggedLayout>
  )
}
