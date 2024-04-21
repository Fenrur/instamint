"use server"
import React from "react"

export default async function LayoutLoginPage({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div className="w-screen h-screen lg:grid lg:min-h-[600px] lg:grid-cols-2 xl:min-h-[800px]">
      <div className="hidden bg-muted lg:block">
      </div>
      <div className="flex items-center justify-center py-12">
        <div className="mx-auto grid w-[350px] gap-6">
          <div className="grid gap-2 text-center">
            <h1 className="text-3xl font-bold">Sign up</h1>
            <p className="text-balance text-muted-foreground">
              Fill below to sign up to your account
            </p>
          </div>
          {children}
        </div>
      </div>
    </div>
  )
}
