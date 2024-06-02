"use client"
import Link from "next/link"

import {cn} from "@/lib/utils"
import {buttonVariants} from "@/components/ui/button"
import React from "react"

interface SidebarNavProps extends React.HTMLAttributes<HTMLElement> {
}

type ButtonType =
  "link"
  | "default"
  | "destructive"
  | "outline"
  | "secondary"
  | "ghost"
  | "tertiary"
  | null
  | undefined;

const sidebarNavItems: {
  title: string,
  href: string,
  buttonVariant: ButtonType,
}[] = [
  {
    title: "Log out",
    href: "/logout",
    buttonVariant: "outline",
  },
  {
    title: "Change profile",
    href: "/change-profile",
    buttonVariant: "outline",
  }, {
    title: "Switch theme",
    href: "/switch-mode",
    buttonVariant: "outline",
  },
  {
    title: "Settings",
    href: "/settings",
    buttonVariant: "outline",
  },
]

export function SidebarNav({className, ...props}: SidebarNavProps) {
  return (
    <nav
      className={cn(
        "flex flex-col space-y-1",
        className
      )}
      {...props}
    >
      {sidebarNavItems.map((item) => (
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
