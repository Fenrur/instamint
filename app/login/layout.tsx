import React from "react"
import {ConnectionLayout} from "@/components/layout/connection-layout"

export const dynamic = "force-dynamic"

export default async function LayoutLoginPage({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <ConnectionLayout>
      <div className="mx-auto grid w-[350px] gap-6">
        <div className="grid gap-2 text-center">
          <h1 className="text-3xl font-bold">Login</h1>
          <p className="text-balance text-muted-foreground">
            Fill below to login to your account
          </p>
        </div>
        {children}
      </div>
    </ConnectionLayout>
  )
}
