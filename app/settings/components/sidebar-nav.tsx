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
    title: "TEA BAGs list",
    href: "/tea-bags",
    buttonVariant: "secondary",
  },
  {
    title: "Reset password",
    href: "/forgot-password",
    buttonVariant: "secondary",
  },
  {
    title: "Reset email",
    href: "/reset-email",
    buttonVariant: "secondary",
  },
  {
    title: "Log out",
    href: "/logout",
    buttonVariant: "secondary",
  },
  {
    title: "Edite profile",
    href: "/settings/profile",
    buttonVariant: "outline",
  }, {
    title: "Delete account",
    href: "/delete-account",
    buttonVariant: "destructive",
  },
]

export function SidebarNav({className, ...props}: SidebarNavProps) {
  return (
    <nav
      className={cn(
        "flex flex-col space-x-0 space-y-1",
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
