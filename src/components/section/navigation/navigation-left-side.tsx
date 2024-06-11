import {Button} from "@/components/ui/button"
import {BellIcon, HomeIcon, MenuIcon, PlusIcon, SearchIcon, SendIcon, UserIcon} from "lucide-react"
import {cn} from "@/lib/utils"
import {Separator} from "@/components/ui/separator"
import React from "react"
import {SelectedNavigation} from "@/components/section/navigation/index"
import Link from "next/link"
import {MintIcon} from "@/components/ui/icons"
import {Tooltip, TooltipContent, TooltipProvider, TooltipTrigger} from "@/components/ui/tooltip"
import {getServerSession} from "@/auth"
import {profileService} from "@/services"

interface NavigationLeftSideProps {
  className?: string,
  selectedNavigation: SelectedNavigation,
  username: string,
  avatarUrl: string,
}

export async function NavigationLeftSide({className, selectedNavigation, username, avatarUrl}: NavigationLeftSideProps) {
  const session = await getServerSession()
  let admin = <></>

  if (session) {
    const userAndProfile = await profileService.findByUserUid(session.uid)

    if (userAndProfile && userAndProfile.role === "admin") {
      admin = <TooltipProvider delayDuration={300}>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button className="size-12" variant="ghost" asChild>
              <Link href="/admin/home">
                <UserIcon className={cn("absolute", selectedNavigation === "home" && "text-primary")} size={26}/>
              </Link>
            </Button>
          </TooltipTrigger>
          <TooltipContent side="right" asChild>
            <div>Admin page</div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    }
  }

  return (
    <section className={className}>
      <header className="flex h-screen">
        <div className="w-20 flex flex-col items-center justify-between py-8">
          <div className="flex flex-col items-center gap-2">

            {admin}

            <TooltipProvider delayDuration={300}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button className="size-12" variant="ghost" asChild>
                    <Link href="/home">
                      <HomeIcon className={cn("absolute", selectedNavigation === "home" && "text-primary")} size={26}/>
                    </Link>
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="right" asChild>
                  <div>Home</div>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider delayDuration={300}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button className="size-12" variant="ghost" asChild>
                    <Link href="/search">
                      <SearchIcon className={cn("absolute", selectedNavigation === "search" && "text-primary")}
                                  size={26}/>
                    </Link>
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="right" asChild>
                  <div>Search</div>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider delayDuration={300}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button className="size-12" variant="ghost" asChild>
                    <Link href="/mints">
                      <MintIcon
                        className={cn("text-black", "absolute", selectedNavigation === "new" ? "stroke-primary" : "stroke-black dark:stroke-white", "size-7")}/>
                    </Link>
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="right" asChild>
                  <div>Mints</div>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider delayDuration={300}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button className="size-12" variant="ghost" asChild>
                    <Link href="/messages">
                      <SendIcon className={cn("absolute", selectedNavigation === "messages" && "text-primary")}
                                size={24}/>
                    </Link>
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="right" asChild>
                  <div>Messages</div>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider delayDuration={300}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button className="size-12" variant="ghost" asChild>
                    <Link href="/notifications">
                      <BellIcon
                        className={cn("absolute", (selectedNavigation === "notifications" || selectedNavigation === "notifications-follow-request") && "text-primary")}
                        size={26}/>
                    </Link>
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="right" asChild>
                  <div>Notifications</div>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider delayDuration={300}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button className="size-12" variant="ghost" asChild>
                    <Link href="/new">
                      <PlusIcon className={cn("absolute", selectedNavigation === "new" && "text-primary")} size={30}/>
                    </Link>
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="right" asChild>
                  <div>New</div>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider delayDuration={300}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button className="size-12" variant="ghost" asChild>
                    <Link href="/me">
                      <img
                        className={cn("rounded-full border-2 absolute size-8", selectedNavigation === "own_profile" && "border-primary")}
                        crossOrigin="anonymous"
                        draggable={false}
                        src={avatarUrl}
                        alt={`profile avatar of ${username}`}
                      />
                    </Link>
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="right" asChild>
                  <div>Profile · {username}</div>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

          </div>

          <TooltipProvider delayDuration={300}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button className="size-12" variant="ghost" asChild>
                  <Link href="/settings">
                    <MenuIcon className={cn("absolute", selectedNavigation === "settings" && "text-primary")}
                              size={26}/>
                  </Link>
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right" asChild>
                <div>Settings</div>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <Separator orientation="vertical"/>
      </header>
    </section>
  )
}
