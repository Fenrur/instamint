import React from "react"

export const dynamic = "force-dynamic"

export async function ConnectionLayout({
                                         children,
                                       }: Readonly<{
  children: React.ReactNode,
}>) {
  return (
    <div className="w-screen h-screen lg:grid lg:min-h-[600px] lg:grid-cols-2 xl:min-h-[800px]">
      <div className="hidden bg-muted lg:block">
      </div>
      <div className="flex items-center justify-center py-12">
        {children}
      </div>
    </div>
  )
}
