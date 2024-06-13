import type {Metadata} from "next"
import {Inter} from "next/font/google"
import "./globals.css"
import React from "react"
import {Toaster} from "@/components/ui/sonner"
import {SessionProvider} from "next-auth/react"
import {cn} from "@/lib/utils"

const inter = Inter({subsets: ["latin"]})

export const metadata: Metadata = {
  title: "Instamint",
  description: "Instamint is a social network for the creative community. Share your work, discover new artists, and connect with other creatives.",
}


export default function RootLayout({
                                     children,
                                   }: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
    <body className={cn(inter.className, "dark")}><Toaster richColors/>
    <SessionProvider>
      {children}
    </SessionProvider>
    </body>
    </html>
  )
}
