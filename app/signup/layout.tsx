import React from "react"
import {ConnectionLayout} from "@/components/layout/connection-layout"

export const dynamic = 'force-dynamic'

export default async function LayoutLoginPage({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <ConnectionLayout title="Signup" text="Fill below to sign up to your account">
      {children}
    </ConnectionLayout>
  )
}
