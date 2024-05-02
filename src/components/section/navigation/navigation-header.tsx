"use client"

import {ChevronLeft} from "lucide-react"
import {Separator} from "@/components/ui/separator"
import React from "react"

interface NavigationHeaderProps {
  text: string,
  className?: string
}

export function NavigationHeader({text, className}: NavigationHeaderProps) {
  return (
    <section className={className}>
      <header className="h-11 flex items-center px-3">
        <div onClick={() => window.history.back()} className="w-8 cursor-pointer">
          <ChevronLeft width="34" height="34" strokeWidth={1.5}/>
        </div>
        <h1 className="flex-grow text-center text-sm font-semibold">
          {text}
        </h1>
        <div className="w-8">

        </div>
      </header>
      <Separator></Separator>
    </section>
  )
}
