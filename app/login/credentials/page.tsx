"use client"

import {Label} from "@/components/ui/label"
import {Input} from "@/components/ui/input"
import {Button} from "@/components/ui/button"
import {useRouter, useSearchParams} from "next/navigation"
import {z} from "zod"
import Link from "next/link"
import {Badge} from "@/components/ui/badge"
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar"
import React, {Suspense, useEffect, useState} from "react"
import {useLogin} from "@/store"
import {useTwoFactorAuthenticatorUserType, useVerifyUserPasswordByEmail} from "@/repository/hooks"
import {signIn} from "next-auth/react"
import {toast} from "sonner"
import {DefaultLoadingDots} from "@/components/ui/loading-dots"
import {createRedirectQueryParam} from "@/utils/url"

function useVerifyPasswordAndGetTwoFactorAuthenticatorType() {
  const {verifyUserPassword, isFetchingVerification, errorVerification} = useVerifyUserPasswordByEmail()
  const {twoFactorAuthenticatorUserType, isFetchingTwoFactor, errorTwoFactor} = useTwoFactorAuthenticatorUserType()
  const [isFetching, setIsFetching] = useState(false)
  const [error, setError] = useState<any | null>(null)

  useEffect(() => {
    if (isFetchingVerification || isFetchingTwoFactor) {
      setIsFetching(true)
    } else {
      setIsFetching(false)
    }
  }, [isFetchingVerification, isFetchingTwoFactor])

  useEffect(() => {
    if (errorVerification || errorTwoFactor) {
      setError(errorVerification || errorTwoFactor)
    }
  }, [errorVerification, errorTwoFactor])

  return {
    trigger: async (req: { email: string, password: string }) => {
      const [verify, twoFactorType] = await Promise.all([verifyUserPassword(req), twoFactorAuthenticatorUserType(req)])

      if (verify === "email_not_found" || twoFactorType === "email_not_found") {
        return "email_not_found"
      }

      if (verify === "password_invalid" || twoFactorType === "password_invalid") {
        return "password_invalid"
      }

      return twoFactorType
    },
    isFetching,
    error
  }
}

function ContentPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const {trigger, isFetching, error} = useVerifyPasswordAndGetTwoFactorAuthenticatorType()
  const {setCredentials, resetCredentials} = useLogin()

  useEffect(() => {
    if (error) {
      toast.error("Error verifying your password", {description: "Please try again..."})
    }
  }, [error])

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const email = searchParams.get("email")
    const redirect = searchParams.get("redirect")

    if (!email) {
      return
    }

    const formData = new FormData(e.currentTarget)
    const passwordFormData = formData.get("password")

    if (!passwordFormData) {
      return
    }

    const password = String(passwordFormData)
    const result = await trigger({email, password})

    if (result === "email_not_found") {
      router.push(`/login${createRedirectQueryParam(redirect)}`)

      return
    }

    if (result === "password_invalid") {
      toast.error("Invalid password", {description: "Please try again..."})

      return
    }

    if (result.type === "totp") {
      setCredentials({
        email,
        password
      })
      router.push(`/login/totp${createRedirectQueryParam(redirect)}`)

      return
    }

    resetCredentials()

    if (redirect) {
      await signIn("credentials", {
        email,
        password,
        redirect: true,
        callbackUrl: decodeURI(redirect)
      })
    } else {
      await signIn("credentials", {
        email,
        password,
        redirect: true,
        callbackUrl: "/"
      })
    }
  }

  useEffect(() => {
    if (error) {
      toast.error("Error verifying your password", {description: "Please try again..."})
    }
  }, [error])

  useEffect(() => {
    const email = searchParams.get("email")
    const redirect = searchParams.get("redirect")

    if (!email || !z.string().email().safeParse(email).success) {
      router.push(`/login${createRedirectQueryParam(redirect)}`)
    }
  }, [searchParams, router])

  return (
    <>
      <form onSubmit={handleFormSubmit}>
        <div className="grid gap-4">
          <div className="flex items-center gap-4 mb-5">
            <Avatar>
              <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn"/>
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <Badge className="h-5" variant="outline">{searchParams.get("email")}</Badge>
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
          <Button disabled={isFetching} type="submit" className="w-full">
            Login
            {
              isFetching ? <div className="ml-1">
                <DefaultLoadingDots size={12}/>
              </div> : null
            }
          </Button>
        </div>
      </form>
      <div className="text-center text-sm flex flex-col gap-2">
        <Link href="/forgot-password" className="underline">
          Forgot my password?{" "}
        </Link>
      </div>
    </>
  )
}

export default function PasswordCredentialsLoginPage() {
  return (
    <Suspense>
      <ContentPage/>
    </Suspense>
  )
}
