import React from "react"
import {
  SelectedNavigation
} from "@/components/section/navigation"
import {NavigationHeader} from "@/components/section/navigation/navigation-header"
import {NavigationFooter} from "@/components/section/navigation/navigation-footer"
import {NavigationLeftSide} from "@/components/section/navigation/navigation-left-side"
import {cn} from "@/lib/utils"

export const dynamic = "force-dynamic"

interface LoggedLayoutProps {
  children: React.ReactNode,
  headerText: string,
  selectedNavigation: SelectedNavigation,
  username: string,
  avatarUrl: string,
  navigationHeader: boolean,
}

export async function LoggedLayout({children, headerText, selectedNavigation, username, avatarUrl, navigationHeader}: LoggedLayoutProps) {
  return (
    <>
      <div className={cn("mb-12 md:mb-0 md:ml-20", navigationHeader && "mt-11 md:mt-0")}>
        {children}
      </div>
      <NavigationLeftSide avatarUrl={avatarUrl} username={username} selectedNavigation={selectedNavigation} className="hidden md:block fixed top-0 z-10 bg-card"/>
      {
        navigationHeader &&
          <NavigationHeader className="md:hidden fixed top-0 w-full z-10 bg-card" text={headerText}/>
      }
      <NavigationFooter avatarUrl={avatarUrl} username={username} selectedNavigation={selectedNavigation} className="md:hidden fixed bottom-0 w-full z-10 bg-card"/>
    </>
  )
}
