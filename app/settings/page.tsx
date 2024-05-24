import React from "react"
import {SidebarNav} from "./components/sidebar-nav"


const sidebarNavItems = [
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


export default async function SettingsProfilePage() {
  return (
    <aside className="w-full">
      <SidebarNav items={sidebarNavItems}/>
    </aside>
  )
}
