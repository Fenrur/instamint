"use client"

import {Label} from "@/components/ui/label"
import {Input} from "@/components/ui/input"
import {Button} from "@/components/ui/button"
import {useRouter, useSearchParams} from "next/navigation"
import {z} from "zod"
import {CheckIcon, ThickArrowRightIcon} from "@radix-ui/react-icons"
import Link from "next/link"
import {Separator} from "@/components/ui/separator"
import {Badge} from "@/components/ui/badge"
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar"
import React from "react"
import {verifyUserPassword} from "@/repository"
import {HttpErrorCode} from "@/http/http-error-code"
import {signIn} from "@/auth"

export default function YoCredentialsPage() {
  const searchParams = useSearchParams()
  const router = useRouter()

  const email = searchParams.get("email")

  if (!email || !z.string().email().safeParse(email).success) {
    router.push("/login")
    return
  }

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const password = formData.get("password")
    if (!password) return

    const result = await verifyUserPassword({email, password: String(password)})
    switch (result) {
      case "password_invalid":
        alert("Password is invalid")
        break
      case "email_not_found":
        alert("Email not found")
        break
      case "password_valid":
        const formData = new FormData()
        formData.set("email", email)
        formData.set("password", password)
        // await signIn("credentials", formData)
        break
    }
  }

  return (
    <div className="w-screen h-screen lg:grid lg:min-h-[600px] lg:grid-cols-2 xl:min-h-[800px]">
      <div className="hidden bg-muted lg:block">

      </div>
      <div className="flex items-center justify-center py-12">
        <div className="mx-auto grid w-[350px] gap-6">
          <div className="grid gap-2 text-center">
            <h1 className="text-3xl font-bold">Login</h1>
            <p className="text-balance text-muted-foreground">
              Enter your password below to login to your account
            </p>
          </div>
          <form onSubmit={handleFormSubmit}>
            <div className="grid gap-4">
              <div className="flex items-center gap-4 mb-5">
                <Avatar>
                  <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
                <Badge className="h-5" variant="outline">{email}</Badge>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  name="password"
                  id="password"
                  type="password"
                  required
                />
              </div>
              <Button type="submit" className="w-full">
                Login
                <CheckIcon className="ml-1"/>
              </Button>
            </div>
          </form>
          <div className="text-center text-sm flex flex-col gap-2">
            <Link href="/forgot-password" className="underline">
              Forgot my password?{" "}
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
