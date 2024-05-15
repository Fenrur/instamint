"use client"

import Link from "next/link"

import {cn} from "@/lib/utils"
import {buttonVariants} from "@/components/ui/button"
import React from "react"

interface SidebarNavProps extends React.HTMLAttributes<HTMLElement> {
  items: {
    buttonVariant: any
    href: string
    title: string
  }[]
}

export function SidebarNav({className, items, ...props}: SidebarNavProps) {
  return (
    <nav
      className={cn(
        "flex flex-col space-x-0 space-y-1",
        className
      )}
      {...props}
    >
      {items.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={cn(
            buttonVariants({variant: item.buttonVariant}),
            "hover:bg-transparent hover:underline",
            "justify-start"
          )}
        >
          {item.title}
        </Link>
      ))}
    </nav>
  )
}
