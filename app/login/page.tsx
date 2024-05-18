import Link from "next/link"

import {Button} from "@/components/ui/button"
import {Input} from "@/components/ui/input"
import {Label} from "@/components/ui/label"
import {Separator} from "@/components/ui/separator"
import {cn} from "@/lib/utils"
import {useMemo} from "react"
import {createRedirectQueryParam} from "@/utils/url"

export const dynamic = "force-dynamic"

type LoginPageError = "email_not_found"

interface LoginPageProps {
  searchParams: {
    error?: string,
    redirect?: string
  }
}

function parseError(props: LoginPageProps): LoginPageError | null {
  if (props.searchParams.error) {
    const error = props.searchParams.error

    if (error === "email_not_found") {
      return "email_not_found"
    }
  }

  return null
}

export default async function LoginPage(props: LoginPageProps) {
  const error = parseError(props)
  const errorMessage = useMemo(() => {
    switch (error) {
      case "email_not_found":
        return "Email does not exist. Please try again."
    }
  }, [error])

  return (
    <>
      <form method="post" action={props.searchParams.redirect ? `/api/login${createRedirectQueryParam(props.searchParams.redirect)}` : "/api/login"}>
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
            Login
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
        <Separator/>
        <Link href="/forgot-password" className="underline">
          Forgot my password?{" "}
        </Link>
      </div>
    </>
  )
}

