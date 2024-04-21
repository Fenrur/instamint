"use client"

import {Label} from "@/components/ui/label"
import {Input} from "@/components/ui/input"
import {Button} from "@/components/ui/button"
import React, {Suspense, useState} from "react"
import {useSignup} from "@/store"
import {Progress} from "@/components/ui/progress"
import {useRouter} from "next/navigation"

type Requirements = "length" | "valid_character" | "unique"

function ContentPage() {
  const router = useRouter()
  const [requirements, setRequirements] = useState<Requirements[]>([])
  const {} = useSignup()
  const [init, setInit] = useState(false)
  const usernameRef = React.useRef<HTMLInputElement>(null)

  const changeRequirements = (username: string) => {
    const length = username.length >= 3 && username.length <= 18
    const validCharacter = /^[a-zA-Z0-9_]+$/.test(username)
    const unique = true

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

  const handleOnChangeUsername = (e: React.ChangeEvent<HTMLInputElement>) => {
    const username = e.target.value

    changeRequirements(username)
  }

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
  }

  return (
    <>
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
          <Progress value={requirements.length / 3 * 100}/>
          <div className="grid gap-1">
            <div hidden={requirements.includes("length")} className="text-sm">- between 3 and 18 characters</div>
            <div hidden={requirements.includes("valid_character")} className="text-sm">- characters valid: letters
              (lower and upper case), numbers and underscore (_)
            </div>
            <div hidden={requirements.includes("unique")} className="text-sm">- unique username</div>
          </div>
          <Button disabled={false} type="submit" className="w-full">
            Validate
          </Button>
        </div>
      </form>
    </>
  )
}

export default function PasswordCredentialsPage() {
  return (
    <Suspense>
      <ContentPage/>
    </Suspense>
  )
}
