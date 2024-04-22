"use server"
import React from "react"
import {ConnectionLayout} from "@/components/layout/connection-layout"

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
