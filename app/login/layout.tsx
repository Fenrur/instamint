"use server"
import React from "react"
import {ConnectionLayout} from "@/components/layout/connection-layout"

export default async function LayoutLoginPage({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <ConnectionLayout title="Login" text="Fill below to login to your account">
      {children}
    </ConnectionLayout>
  )
}
