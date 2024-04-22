"use server"

import Link from "next/link"

import {Button} from "@/components/ui/button"
import {Input} from "@/components/ui/input"
import {Label} from "@/components/ui/label"
import {Separator} from "@/components/ui/separator"
import {ThickArrowRightIcon} from "@radix-ui/react-icons"

export default async function LoginPage() {
  return (
    <>
      <div className="text-center text-sm">
        <Link href="/login" className="underline">
          click here to login
        </Link>
      </div>
    </>
  )
}

