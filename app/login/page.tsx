"use server"

import Link from "next/link"

import {Button} from "@/components/ui/button"
import {Input} from "@/components/ui/input"
import {Label} from "@/components/ui/label"
import {Separator} from "@/components/ui/separator"
import {ThickArrowRightIcon} from "@radix-ui/react-icons"

export default async function LoginPage() {
  return (
    <div className="w-screen h-screen lg:grid lg:min-h-[600px] lg:grid-cols-2 xl:min-h-[800px]">
      <div className="hidden bg-muted lg:block">
      </div>
      <div className="flex items-center justify-center py-12">
        <div className="mx-auto grid w-[350px] gap-6">
          <div className="grid gap-2 text-center">
            <h1 className="text-3xl font-bold">Login</h1>
            <p className="text-balance text-muted-foreground">
              Enter your email below to login to your account
            </p>
          </div>
          <form method="post" action="/api/login">
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  name="email"
                  id="email"
                  type="email"
                  placeholder="myemail@example.com"
                  required
                />
              </div>
              <Button type="submit" className="w-full">
                Login
                <ThickArrowRightIcon className="ml-1"/>
              </Button>
            </div>
          </form>
          <div className="mt-4 text-center text-sm flex flex-col gap-2">
            <div>
              Don&apos;t have an account?{" "}
              <Link href="/signup" className="underline">
                Sign up
              </Link>
            </div>
            <Separator></Separator>
            <Link href="/forgot-password" className="underline">
              Forgot my password?{" "}
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

