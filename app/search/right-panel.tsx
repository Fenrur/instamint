import React from "react"
import {cn} from "@/lib/utils"

interface RightPanelProps {
  title: string
  width: string
  children: React.ReactNode
  className?: string
}

export function RightPanel(props: RightPanelProps) {
  return (
    <div className={cn("mx-auto grid gap-6", props.width, props.className)}>
      <div className="grid gap-2 text-center">
        <h1 className="text-3xl font-bold hidden md:block">{props.title}</h1>
      </div>
      {props.children}
    </div>
  )
}
