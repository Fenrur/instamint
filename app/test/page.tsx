"use client"

import {BackgroundLoadingDots} from "@/components/ui/loading-dots"
import {PlusIcon} from "lucide-react"

export default async function TestPage() {
  return (
    <>
      <div className="text-blue-700 dark:text-red-400">
        ok
      </div>
      <BackgroundLoadingDots size={50}/>
    </>
  )
}
