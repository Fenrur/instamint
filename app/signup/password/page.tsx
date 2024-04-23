"use client"

import {Label} from "@/components/ui/label"
import {Input} from "@/components/ui/input"
import {Button} from "@/components/ui/button"
import {useRouter, useSearchParams} from "next/navigation"
import React, {Suspense, useEffect, useState} from "react"
import {Progress} from "@/components/ui/progress"
import {useSignup} from "@/store"
import {
  passwordContainsLowercase,
  passwordContainsNumber, passwordContainsSpecial,
  passwordContainsUppercase,
  passwordMinimumLength
} from "@/utils/validator"
import {RightPanel} from "../right-panel"

type Requirements = "length" | "uppercase" | "lowercase" | "number" | "special"
const requirementsEnumSize = 5

function ContentPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [requirements, setRequirements] = useState<Requirements[]>([])
  const {password: signupPassword, setPassword: setSignupPassword, setVid, reset, vid: currentVid} = useSignup()
  const [init, setInit] = useState(false)
  const passwordRef = React.useRef<HTMLInputElement>(null)
  const changeRequirements = (password: string) => {
    const length = password.length >= passwordMinimumLength
    const uppercase = passwordContainsUppercase.test(password)
    const lowercase = passwordContainsLowercase.test(password)
    const number = passwordContainsNumber.test(password)
    const special = passwordContainsSpecial.test(password)
    const newRequirements: Requirements[] = []

    if (length) {
      newRequirements.push("length")
    }

    if (uppercase) {
      newRequirements.push("uppercase")
    }

    if (lowercase) {
      newRequirements.push("lowercase")
    }

    if (number) {
      newRequirements.push("number")
    }

    if (special) {
      newRequirements.push("special")
    }

    setRequirements(newRequirements)
  }

  useEffect(() => {
    const vid = searchParams.get("vid")

    if (!init) {
      if (vid) {
        setVid(vid)

        if (signupPassword) {
          const pRef = passwordRef.current

          if (pRef) {
            pRef.value = signupPassword
            changeRequirements(signupPassword)
          }
        }

        setInit(true)
      } else {
        reset()
        router.push("/signup")
      }
    }
  }, [init, searchParams, router, signupPassword, setVid, reset, currentVid, setInit, passwordRef])

  const handleOnChangePassword = (e: React.ChangeEvent<HTMLInputElement>) => {
    const password = e.target.value

    changeRequirements(password)
  }
  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setSignupPassword(String(e.currentTarget.password.value))
    router.push("/signup/username")
  }

  return (
    <RightPanel title="Signup" text="Fill below to sign up to your account" width="w-[350px]">
      <form onSubmit={handleFormSubmit}>
        <div className="grid gap-4">
          <Label htmlFor="password">Password</Label>
          <Input
            ref={passwordRef}
            name="password"
            id="password"
            type="password"
            onChange={handleOnChangePassword}
            required
          />
          <Progress value={requirements.length / requirementsEnumSize * 100}/>
          <div className="grid gap-1">
            <div hidden={requirements.includes("length")} className="text-sm">- 8 characters long</div>
            <div hidden={requirements.includes("uppercase")} className="text-sm">- 1 uppercase letter</div>
            <div hidden={requirements.includes("lowercase")} className="text-sm">- 1 lowercase letter</div>
            <div hidden={requirements.includes("number")} className="text-sm">- 1 number letter</div>
            <div hidden={requirements.includes("special")} className="text-sm">- 1 special character (#?!@$%^&*-)</div>
          </div>
          <Button disabled={requirements.length < requirementsEnumSize} type="submit" className="w-full">
            Validate
          </Button>
        </div>
      </form>
    </RightPanel>
  )
}

export default function PasswordSignupPage() {
  return (
    <Suspense>
      <ContentPage/>
    </Suspense>
  )
}
