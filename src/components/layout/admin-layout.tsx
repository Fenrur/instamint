import React from "react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import {categories} from "@/admin/categories"
import Link from "next/link"

export const dynamic = "force-dynamic"

export async function AdminLayout({
                                         children,
                                       }: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div className="w-screen h-screen flex">
      <ScrollArea className="h-100 w-1/6 border-r-2">
        <div className="p-4">
          <h4 className="mb-4 text-2xl text-center text-primary font-semibold leading-none">Admin</h4>
          {categories.map((category: { name: string, url: string }) => (
            <>
              <div key={category.name} className="text-lg text-center bg-primary rounded">

                <Link href={category.url} className="text-white">
                  {category.name}
                </Link>
              </div>
              <Separator className="my-2"/>
            </>
          ))}
          <div className="text-lg text-center bg-red-600 rounded">

            <Link href="/me" className="text-white">
              quit
            </Link>
          </div>
        </div>
        <Separator className="my-2"/>
      </ScrollArea>
      <div className="w-5/6">
        {children}
      </div>
    </div>
  )
}
