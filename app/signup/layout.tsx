"use server"
import React from "react"
import {ConnectionLayout} from "@/components/layout/connection-layout"

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
