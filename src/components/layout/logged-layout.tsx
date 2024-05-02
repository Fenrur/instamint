import React from "react"
import {
  SelectedNavigation
} from "@/components/section/navigation"
import {NavigationHeader} from "@/components/section/navigation/navigation-header"
import {NavigationFooter} from "@/components/section/navigation/navigation-footer"
import {NavigationLeftSide} from "@/components/section/navigation/navigation-left-side"

export const dynamic = "force-dynamic"

interface LoggedLayoutProps {
  children: React.ReactNode,
  headerText: string,
  selectedNavigation: SelectedNavigation
}

export async function LoggedLayout({children, headerText, selectedNavigation}: LoggedLayoutProps) {
  return (
    <>
      <div className="mt-11 mb-12 md:mt-0 md:mb-0 md:ml-20">
        {children}
      </div>
      <NavigationLeftSide selectedNavigation={selectedNavigation} className="hidden md:block fixed top-0 z-10 bg-card"/>
      <NavigationHeader className="md:hidden fixed top-0 w-full z-10 bg-card" text={headerText}/>
      <NavigationFooter selectedNavigation={selectedNavigation} className="md:hidden fixed bottom-0 w-full z-10 bg-card"/>
    </>
  )
}
