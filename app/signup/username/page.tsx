"use client"

import {Label} from "@/components/ui/label"
import {Input} from "@/components/ui/input"
import {Button} from "@/components/ui/button"
import React, {Suspense, useEffect, useState} from "react"
import {useSignup} from "@/store"
import {Progress} from "@/components/ui/progress"
import {useRouter} from "next/navigation"
import {useVerifyExistUsername} from "@/repository/hooks"
import {usernameMaximumLength, usernameMinimumLength, usernameValidCharacter} from "@/utils/validator"
import {RightPanel} from "../right-panel"

type Requirements = "length" | "valid_character" | "unique"
const requirementsEnumSize = 3

function isLength(username: string) {
  return usernameMinimumLength <= username.length && usernameMaximumLength >= username.length
}

function isValidCharacter(username: string) {
  return usernameValidCharacter.test(username)
}

function ContentPage() {
  const router = useRouter()
  const [requirements, setRequirements] = useState<Requirements[]>([])
  const { username, setUsername} = useSignup()
  const [init, setInit] = useState(false)
  const usernameRef = React.useRef<HTMLInputElement>(null)
  const {
    verifyExistUsername,
    abortVerification,
    isFetchingVerification
  } = useVerifyExistUsername()

  useEffect(() => {
    if (!init) {
      if (username) {
        const uRef = usernameRef.current

        if (uRef) {
          uRef.value = username
          // eslint-disable-next-line @typescript-eslint/no-floating-promises
          onUsernameChanged(username)
        }
      }

      setInit(true)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [init, setInit])

  async function onUsernameChanged(username: string) {
    abortVerification()

    const length = isLength(username)
    const validCharacter = isValidCharacter(username)
    let unique = false

    if (length && validCharacter) {
      const result = await verifyExistUsername(username)

      if (result && result.exist !== undefined) {
        unique = !result.exist
      }
    }

    const newRequirements: Requirements[] = []

    if (length) {
      newRequirements.push("length")
    }

    if (validCharacter) {
      newRequirements.push("valid_character")
    }

    if (unique) {
      newRequirements.push("unique")
    }

    setRequirements(newRequirements)
  }

  const handleOnChangeUsername = async (e: React.ChangeEvent<HTMLInputElement>) => {
    await onUsernameChanged(e.target.value)
  }
  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (isFetchingVerification) {
      return
    }

    const username = String(e.currentTarget.username.value)

    setUsername(username)
    router.push("/signup/terms-and-conditions")
  }

  return (
    <RightPanel title="Signup" text="Fill below to sign up to your account" width="w-[350px]">
      <form onSubmit={handleFormSubmit}>
        <div className="grid gap-4">
          <Label htmlFor="username">Username</Label>
          <div className="flex gap-1">
            <Input
              disabled={true}
              name="@"
              value="@"
              className="w-10 bg-gray-50"/>
            <Input
              ref={usernameRef}
              name="username"
              id="username"
              type="username"
              onChange={handleOnChangeUsername}
              required
            />
          </div>
          <Progress value={requirements.length / requirementsEnumSize * 100}/>
          <div className="grid gap-1">
            <div hidden={requirements.includes("length")} className="text-sm">- between 3 and 18 characters</div>
            <div hidden={requirements.includes("valid_character")} className="text-sm">- characters valid: letters
              (lower and upper case), numbers and underscore (_)
            </div>
            <div hidden={requirements.includes("unique")} className="text-sm">- unique username</div>
          </div>
          <Button disabled={requirements.length < requirementsEnumSize} type="submit" className="w-full">
            Validate
          </Button>
        </div>
      </form>
    </RightPanel>
  )
}

export default function UsernameSignupPage() {
  return (
    <Suspense>
      <ContentPage/>
    </Suspense>
  )
}
