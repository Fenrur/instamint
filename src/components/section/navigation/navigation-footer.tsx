import {Separator} from "@/components/ui/separator"
import {HomeIcon, MenuIcon, PlusIcon, SearchIcon, SendIcon, UserIcon} from "lucide-react"
import React from "react"
import {SelectedNavigation} from "@/components/section/navigation/index"
import Link from "next/link"
import {cn} from "@/lib/utils"

interface NavigationFooterProps {
    className?: string,
    selectedNavigation: SelectedNavigation,
  username: string,
  avatarUrl: string,
}

export function NavigationFooter({className, selectedNavigation, username, avatarUrl}: NavigationFooterProps) {
    return (
        <section className={className}>
            <Separator/>
            <footer className="h-12 flex justify-evenly items-center">
                <Link href="/home">
                    <HomeIcon className={cn(selectedNavigation === "home" && "text-primary")} size={26}/>
                </Link>
                <Link href="/search">
                    <SearchIcon className={cn(selectedNavigation === "search" && "text-primary")} size={26}/>
                </Link>
                <Link href="/new">
                    <PlusIcon className={cn(selectedNavigation === "new" && "text-primary")} size={30}/>
                </Link>
                <Link href="/messages">
                    <SendIcon className={cn(selectedNavigation === "messages" && "text-primary")} size={24}/>
                </Link>
                <Link className="grid items-center" href="/me">
          <img
            className={cn("rounded-full border-2 absolute size-8", selectedNavigation === "own_profile" && "border-primary")}
            crossOrigin="anonymous"
            draggable={false}
            src={avatarUrl}
            alt={`profile avatar of ${username}`}
          />
                    <UserIcon className={selectedNavigation === "own_profile" ? "text-primary" : ""} size={26}/>
                </Link>
                <Link href="/settings">
                    <MenuIcon className={selectedNavigation === "settings" ? "text-primary": ""} size={26}/>
                </Link>

            </footer>
        </section>
    )
}
