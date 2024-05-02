import {Separator} from "@/components/ui/separator"
import {HomeIcon, PlusIcon, SearchIcon, SendIcon, UserIcon} from "lucide-react"
import React from "react"
import {SelectedNavigation} from "@/components/section/navigation/index"
import Link from "next/link"

interface NavigationFooterProps {
  className?: string,
  selectedNavigation: SelectedNavigation
}

export function NavigationFooter({className, selectedNavigation}: NavigationFooterProps) {
  return (
    <section className={className}>
      <Separator/>
      <footer className="h-12 flex justify-evenly items-center">
        <Link href="/home">
          <HomeIcon className={selectedNavigation === "home" ? "text-primary" : ""} size={26}/>
        </Link>
        <Link href="/search">
          <SearchIcon className={selectedNavigation === "search" ? "text-primary" : ""} size={26}/>
        </Link>
        <Link href="/new">
          <PlusIcon className={selectedNavigation === "new" ? "text-primary" : ""} size={30}/>
        </Link>
        <Link href="/message">
          <SendIcon className={selectedNavigation === "message" ? "text-primary" : ""} size={24}/>
        </Link>
        <Link href="/me">
          <UserIcon className={selectedNavigation === "own_profile" ? "text-primary" : ""} size={26}/>
        </Link>
      </footer>
    </section>
  )
}
