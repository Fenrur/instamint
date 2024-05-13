import {Button} from "@/components/ui/button"
import {HomeIcon, MenuIcon, PlusIcon, SearchIcon, SendIcon, UserIcon} from "lucide-react"
import {cn} from "@/lib/utils"
import {Separator} from "@/components/ui/separator"
import React from "react"
import {SelectedNavigation} from "@/components/section/navigation/index"
import Link from "next/link"
import {MintIcon} from "@/components/ui/icons"

interface NavigationLeftSideProps {
  className?: string,
  selectedNavigation: SelectedNavigation
}

export function NavigationLeftSide({className, selectedNavigation}: NavigationLeftSideProps) {
  return (
    <section className={className}>
      <header className="flex h-screen">
        <div className="w-20 flex flex-col items-center justify-between py-8">
          <div className="flex flex-col items-center gap-2">
            <Button className="size-12" variant="ghost" asChild>
              <Link href="/home">
                <HomeIcon className={cn("absolute", selectedNavigation === "home" && "text-primary")} size={26}/>
              </Link>
            </Button>

            <Button className="size-12" variant="ghost" asChild>
              <Link href="/search">
                <SearchIcon className={cn("absolute", selectedNavigation === "search" && "text-primary")} size={26}/>
              </Link>
            </Button>

            <Button className="size-12" variant="ghost" asChild>
              <Link href="/new">
                <PlusIcon className={cn("absolute", selectedNavigation === "new" && "text-primary")} size={30}/>
              </Link>
            </Button>

            <Button className="size-12" variant="ghost" asChild>
              <Link href="/mints">
                <MintIcon className={cn("text-black", "absolute", selectedNavigation === "new" ? "stroke-primary" : "stroke-black dark:stroke-white", "size-7")}/>
              </Link>
            </Button>

            <Button className="size-12" variant="ghost" asChild>
              <Link href="/message">
                <SendIcon className={cn("absolute", selectedNavigation === "message" && "text-primary")} size={24}/>
              </Link>
            </Button>

            <Button className="size-12" variant="ghost" asChild>
              <Link href="/me">
                <UserIcon className={cn("absolute", selectedNavigation === "own_profile" && "text-primary")} size={26}/>
              </Link>
            </Button>
          </div>

          <Button className="size-12" variant="ghost" asChild>
            <Link href="/settings">
              <MenuIcon className={cn("absolute", selectedNavigation === "settings" && "text-primary")} size={26}/>
            </Link>
          </Button>
        </div>
        <Separator orientation="vertical"/>
      </header>
    </section>
  )
}
