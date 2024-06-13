"use client"

import {Button} from "@/components/ui/button"
import {useRouter, useSearchParams} from "next/navigation"
import Link from "next/link"
import {Badge} from "@/components/ui/badge"
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar"
import React, {useEffect} from "react"
import {useLogin} from "@/store"
import {InputOTP, InputOTPGroup, InputOTPSlot} from "@/components/ui/input-otp"
import {REGEXP_ONLY_DIGITS} from "input-otp"
import {z} from "zod"
import {useForm} from "react-hook-form"
import {zodResolver} from "@hookform/resolvers/zod"
import {Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form"
import {useVerifyTwoFactorAuthenticatorTotpCode} from "@/repository/hooks"
import {toast} from "sonner"
import {DefaultLoadingDots} from "@/components/ui/loading-dots"
import {signIn} from "next-auth/react"
import {createRedirectQueryParam} from "@/utils/url"

const FormSchema = z.object({
  pin: z.string().min(6, {
    message: "Your one-time password must be 6 digits.",
  }),
})

export default function TotpCodeLoginPage() {
  const {credentials, resetCredentials} = useLogin()
  const router = useRouter()
  const searchParams = useSearchParams()
  const {verifyTwoFactorAuthenticatorTotpCode, isFetchingVerification, errorVerification} = useVerifyTwoFactorAuthenticatorTotpCode()

  useEffect(() => {
    if (!credentials) {
      const redirect = searchParams.get("redirect")
      router.push(`/login${createRedirectQueryParam(redirect)}`)
    }
  }, [searchParams, credentials, router])

  useEffect(() => {
    if (errorVerification) {
      toast.error("Error verifying your one-time password", {description: "Please try again..."})
    }
  }, [errorVerification])

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      pin: "",
    },
  })
  const handleFormSubmit = async (data: z.infer<typeof FormSchema>) => {
    if (! credentials) {return}

    const redirect = searchParams.get("redirect")
    const result = await verifyTwoFactorAuthenticatorTotpCode({
      email: credentials.email,
      password: credentials.password,
      totpCode: data.pin
    })

    switch (result) {
      case "code_valid":
        resetCredentials()

        if (redirect) {
          await signIn("credentials", {
            email: credentials.email,
            password: credentials.password,
            twoFactorAuthentification: data.pin,
            redirect: true,
            callbackUrl: decodeURI(redirect)
          })
        } else {
          await signIn("credentials", {
            email: credentials.email,
            password: credentials.password,
            twoFactorAuthentification: data.pin,
            redirect: true,
            callbackUrl: "/"
          })
        }

        break

      case "email_not_found":
        router.push(`/login${createRedirectQueryParam(redirect)}`)

        break

      case "password_invalid":
        router.push(`/login${createRedirectQueryParam(redirect)}`)

        break

      case "two_factor_not_enabled":
        router.push(`/login${createRedirectQueryParam(redirect)}`)

        break

      case "two_factor_setup_required":
        router.push(`/login${createRedirectQueryParam(redirect)}`)

        break

      case "invalid_totp_code":
        toast.error("Invalid one-time password", {description: "Please try again..."})

        break
    }
  }

  return (
    <>
      <div className="grid gap-4">
        <div className="flex items-center gap-4 mb-5">
          <Avatar>
            <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn"/>
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <Badge className="h-5" variant="outline">{credentials?.email}</Badge>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleFormSubmit)} className="grid gap-2 space-y-6 justify-center">
            <FormField
              control={form.control}
              name="pin"
              render={({field}) => (
                <FormItem>
                  <FormLabel className="text-center">2FA Code</FormLabel>
                  <FormControl>
                    <InputOTP maxLength={6} {...field} pattern={REGEXP_ONLY_DIGITS}>
                      <InputOTPGroup>
                        <InputOTPSlot className="size-14" index={0}/>
                        <InputOTPSlot className="size-14" index={1}/>
                        <InputOTPSlot className="size-14" index={2}/>
                        <InputOTPSlot className="size-14" index={3}/>
                        <InputOTPSlot className="size-14" index={4}/>
                        <InputOTPSlot className="size-14" index={5}/>
                      </InputOTPGroup>
                    </InputOTP>
                  </FormControl>
                  <FormDescription>
                    Please enter the one-time password from your application.
                  </FormDescription>
                  <FormMessage/>
                </FormItem>
              )}
            />

            <Button disabled={isFetchingVerification} type="submit" className="w-full">
              Validate
              {
                isFetchingVerification ? <div className="ml-1">
                  <DefaultLoadingDots size={12}/>
                </div> : null
              }
            </Button>

          </form>
        </Form>
      </div>
      <div className="text-center text-sm flex flex-col gap-2">
        <Link href="/lost-my-2fa" className="underline">
          Lost my 2 factor authentication code?{" "}
        </Link>
      </div>
    </>
  )
}
