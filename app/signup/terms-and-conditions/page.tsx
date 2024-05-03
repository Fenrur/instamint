"use client"

import {Button} from "@/components/ui/button"
import React, {Suspense, useEffect, useState} from "react"
import {useSignup} from "@/store"
import {useRouter} from "next/navigation"
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "@/components/ui/card"
import {Checkbox} from "@/components/ui/checkbox"
import {ScrollArea} from "@/components/ui/scroll-area"
import {CheckedState} from "@radix-ui/react-checkbox"
import {useRegisterUser} from "@/repository/hooks"
import {DefaultLoadingDots} from "@/components/ui/loading-dots"
import {toast} from "sonner"
import {RightPanel} from "../right-panel"

function ContentPage() {
  const router = useRouter()
  const [init, setInit] = useState(false)
  const [checked, setChecked] = useState(true)
  const {vid, password, username, accept, setAccept, reset} = useSignup()
  const {isFetchingRegister, registerUser, dataRegister} = useRegisterUser()

  useEffect(() => {
    if (!init) {
      if (!vid) {
        router.push("/signup/")

        return
      }

      if (!password) {
        router.push("/signup/password")

        return
      }

      if (!username) {
        router.push("/signup/username")

        return
      }

      setChecked(accept)
      setInit(true)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [init])

  useEffect(() => {
    if (dataRegister) {
      switch (dataRegister) {
        case "email_verification_not_found":
          toast.error("Email verification not found", {description: "Please signup from the beginning."})

          break

        case "email_verification_already_verified":
          toast.error("Email verification already verified", {description: "Please signup from the beginning."})

          break

        case "email_verification_expired":
          toast.error("Email verification expired", {description: "Please signup from the beginning."})

          break

        case "email_already_used":
          toast.error("Email already used", {description: "Please signup from the beginning."})

          break

        case "username_already_used":
          toast.error("Username already used", {description: "Please signup from the beginning."})

          break

        default:
          reset()
          router.push("/signup-completed")

          break
      }
    }
  }, [dataRegister, reset, router])

  const handleOnAccept = (e: CheckedState) => {
    if (e === "indeterminate") {
      return
    }

    setChecked(e)
  }
  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!checked) {
      return
    }

    setAccept(true)

    if (vid && username && password) {
      await registerUser({emailVerificationId: vid, username, password})
    }
  }

  return (
    <RightPanel title="Signup" text="Fill below to sign up to your account" width="w-[500px]">
      <Card>
        <CardHeader>
          <CardTitle>Terms & Conditions</CardTitle>
          <CardDescription>
            Please read the following terms and conditions carefully before proceeding.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-96">
            <div className="grid gap-4">
              <div className="text-sm">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et
                dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
                aliquip
                ex
                ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu
                fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia
                deserunt
                mollit anim id est laborum.
                Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium,
                totam
                rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt
                explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia
                consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui
                dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora
                incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum
                exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis
                autem
                vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum
                qui
                dolorem eum fugiat quo voluptas nulla pariatur?
              </div>

              <div className="grid text-sm">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et
                dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
                aliquip
                ex
                ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu
                fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia
                deserunt
                mollit anim id est laborum.
                Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium,
                totam
                rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt
                explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia
                consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui
                dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora
                incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum
                exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis
                autem
                vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum
                qui
                dolorem eum fugiat quo voluptas nulla pariatur?
              </div>
            </div>

          </ScrollArea>
        </CardContent>
        <form onSubmit={handleFormSubmit}>
          <CardFooter className="flex justify-between">
            <div className="flex items-center space-x-2">
              <Checkbox onCheckedChange={handleOnAccept} id="terms"/>
              <label
                htmlFor="terms"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Accept terms and conditions
              </label>
            </div>
            <Button
              type="submit"
              disabled={!checked || isFetchingRegister}>
              Continue
              {
                isFetchingRegister ? <div className="ml-1">
                  <DefaultLoadingDots size={12}/>
                </div> : null
              }
            </Button>
          </CardFooter>
        </form>
      </Card>
    </RightPanel>
  )
}

export default function TermsAndConditionsPage() {
  return (
    <Suspense>
      <ContentPage/>
    </Suspense>
  )
}
