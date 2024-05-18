import React from "react"
import {ReactQueryClientProvider} from "@/components/ReactQueryClientProvider"

export const dynamic = "force-dynamic"

interface ProfilePageProps {
  children: React.ReactNode,
}

export default async function ProfileLayout(props: ProfilePageProps) {

  return (
    <ReactQueryClientProvider>
      {
        props.children
      }
    </ReactQueryClientProvider>
  )
}
