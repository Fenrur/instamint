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
          <h1 className="text-3xl font-bold">Reset password</h1>
          <p className="text-balance text-muted-foreground">
            Enter the email address associated with your account and we will send you a link to reset your
            password
          </p>
        </div>
        {children}
      </div>
    </ConnectionLayout>
  )
}
