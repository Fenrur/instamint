"use client"
import React from "react"
import {MixerHorizontalIcon} from "@radix-ui/react-icons"
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover"
import {PopoverArrow, PopoverPortal} from "@radix-ui/react-popover"
import {SidebarNav} from "../../../app/settings/components/sidebar-nav"
import {MenuIcon} from "lucide-react"


export function SettingsPopover() {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <button className="IconButton p-5" aria-label="Update dimensions">
          <MenuIcon/>
        </button>
      </PopoverTrigger>
      <PopoverPortal>
        <PopoverContent className="PopoverContent" sideOffset={5}>
          <div style={{display: "flex", flexDirection: "column", gap: 10}}>
            <SidebarNav/>
          </div>
          <PopoverArrow className="PopoverArrow"/>
        </PopoverContent>
      </PopoverPortal>
    </Popover>
  )
}
