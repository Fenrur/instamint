import React from "react"
import {ConnectionLayout} from "@/components/layout/connection-layout"

export const dynamic = 'force-dynamic'

export default async function LayoutLoginPage({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <ConnectionLayout title="Signup completed !" text="You have received an email confirming your registration">
      {children}
    </ConnectionLayout>
  )
}
