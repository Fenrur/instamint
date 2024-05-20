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
        {children}
      </div>
    </ConnectionLayout>
  )
}
