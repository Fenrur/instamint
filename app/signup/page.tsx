import Link from "next/link"

import {Button} from "@/components/ui/button"
import {Input} from "@/components/ui/input"
import {Label} from "@/components/ui/label"
import {Separator} from "@/components/ui/separator"
import {cn} from "@/lib/utils"
import {useMemo} from "react"
import {RightPanel} from "./right-panel"

export const dynamic = 'force-dynamic'

type SignupPageError = "email_verification_limit_exceeded" | "email_exists"

interface SignupPageProps {
  searchParams: {
    error?: string
  }
}

function parseError(props: SignupPageProps): SignupPageError | null {
  if (props.searchParams.error) {
    const error = props.searchParams.error

    if (error === "email_verification_limit_exceeded") {
      return "email_verification_limit_exceeded"
    }
  }

  return null
}

export default async function SignupPage(props: SignupPageProps) {
  const error = parseError(props)
  const errorMessage = useMemo(() => {
    switch (error) {
      case "email_verification_limit_exceeded":
        return "You have exceeded the limit of email verification requests. Please try again later."

      case "email_exists":
        return "Email already exists. Please try again."
    }
  }, [error])

  return (
    <RightPanel title="Signup" text="Fill below to sign up to your account" width="w-[350px]">
      <form method="post" action="/api/signup">
        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="email" className={error ? "text-destructive" : ""}>Email</Label>
            <Input
              name="email"
              id="email"
              type="email"
              placeholder="myemail@example.com"
              required
            />
            <div hidden={error === null} className={cn("text-sm", error ? "text-destructive" : "")}>{errorMessage}</div>
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
    </RightPanel>
  )
}

