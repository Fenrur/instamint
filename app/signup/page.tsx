"use server"

import Link from "next/link"

import {Button} from "@/components/ui/button"
import {Input} from "@/components/ui/input"
import {Label} from "@/components/ui/label"
import {Separator} from "@/components/ui/separator"

export default async function LoginPage() {
  return (
    <>
      <form method="post" action="/api/signup">
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
            Sign up
          </Button>
        </div>
      </form>
      <div className="mt-4 text-center text-sm flex flex-col gap-2">
        <div>
          You have an account?{" "}
          <Link href="/login" className="underline">
            Login
          </Link>
        </div>
        <Separator></Separator>
        <Link href="/forgot-password" className="underline">
          Forgot my password?{" "}
        </Link>
      </div>
    </>
  )
}

