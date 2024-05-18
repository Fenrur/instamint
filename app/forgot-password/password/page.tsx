"use client"

import {Label} from "@/components/ui/label"
import {Input} from "@/components/ui/input"
import {Button} from "@/components/ui/button"
import {useRouter, useSearchParams} from "next/navigation"
import React, {ChangeEvent, Suspense, useEffect, useState} from "react"
import {Progress} from "@/components/ui/progress"
import {usePasswordReset} from "@/store"
import {
  passwordContainsLowercase,
  passwordContainsNumber,
  passwordContainsSpecial,
  passwordContainsUppercase,
  passwordMinimumLength
} from "@/utils/validator"

type Requirements = "length" | "uppercase" | "lowercase" | "number" | "special"
const requirementsEnumSize = 5

function ContentPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [requirements, setRequirements] = useState<Requirements[]>([])
  const {newPassword, setResetId, reset, resetId: currentResetId} = usePasswordReset()
  const [passwordsMatch, setPasswordsMatch] = useState(true)
  const [init, setInit] = useState(false)
  const passwordRef = React.useRef<HTMLInputElement>(null)
  const confirmPasswordRef = React.useRef<HTMLInputElement>(null)
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
    const resetId = searchParams.get("resetId")

    if (!init) {
      if (resetId) {
        setResetId(resetId)

        if (newPassword) {
          const pRef = passwordRef.current

          if (pRef) {
            pRef.value = newPassword
            changeRequirements(newPassword)
          }
        }

        setInit(true)
      } else {
        reset()
        router.push("/forgot-password")
      }
    }
  }, [init, searchParams, router, reset, setInit, passwordRef, setResetId, newPassword])

  const handleOnChangePassword = (e: ChangeEvent<HTMLInputElement>) => {
    const password = e.target.value
    changeRequirements(password)
  }
  const handleOnChangeConfirmPassword = (e: ChangeEvent<HTMLInputElement>) => {
    validatePasswords(passwordRef.current?.value as string, e.target.value)
  }
  const validatePasswords = (password: string, confirmPassword: string) => {
    setPasswordsMatch(password === confirmPassword)
  }

  return (
    <form action={`/api/forgot-password/reset?resetId=${currentResetId}`} method="POST">
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
        <Label htmlFor="confirm-password">Confirm Password</Label>
        <Input
          ref={confirmPasswordRef}
          name="confirm-password"
          id="confirm-password"
          type="password"
          onChange={handleOnChangeConfirmPassword}
          required
          aria-describedby="password-match"
        />
        <Progress value={requirements.length / requirementsEnumSize * 100}/>
        <div className="grid gap-1">
          <div hidden={requirements.includes("length")} className="text-sm">- 8 characters long</div>
          <div hidden={requirements.includes("uppercase")} className="text-sm">- 1 uppercase letter</div>
          <div hidden={requirements.includes("lowercase")} className="text-sm">- 1 lowercase letter</div>
          <div hidden={requirements.includes("number")} className="text-sm">- 1 number letter</div>
          <div hidden={requirements.includes("special")} className="text-sm">- 1 special character
            (#?!@$%^&*-)
          </div>
        </div>
        <div id="password-match" className="text-sm text-red-600" aria-live="polite">
          {!passwordsMatch && <p>Passwords do not match.</p>}
        </div>
        <Button disabled={requirements.length < requirementsEnumSize} type="submit" className="w-full">
          Validate
        </Button>
      </div>
    </form>
  )
}

export default function PasswordResetPage() {
  return (
    <Suspense>
      <ContentPage/>
    </Suspense>
  )
}
