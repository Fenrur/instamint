"use client"

import {RoleType} from "@/domain/types"
import React, {useState} from "react"
import {Button} from "@/components/ui/button"
import {Input} from "@/components/ui/input"
import {Label} from "@/components/ui/label"

interface UserSectionProps {
  user: {
    isActivated: boolean,
    email: string
    id: number,
    role: RoleType
  }
}

export function UserPage({user}: UserSectionProps) {
  const [checked, setChecked] = useState(user.isActivated)

  const checkClick = () => {
    setChecked(!checked)
  }

  return (
    <>
      <form method="post" action={`/api/admin/users/user?id=${user.id}`}>
        <Label htmlFor="enabled">Enabled</Label>
        <Input
          name="enabled"
          id="enabled"
          type="checkbox"
          checked={checked}
          onClick={() => (checkClick())}
        />
        <Button type="submit" className="w-1/3 h-12 mt-12 bg-primary">
          Submit
        </Button>
      </form>
    </>
  )
}
