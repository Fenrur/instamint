"use client"

import {useSearchParams} from "next/navigation"

export default function LoginPage() {
  const searchParams = useSearchParams()

  return (
    <>
      <div className="text-sm">We have sent you a verification email at <b>{searchParams.get("email")}</b></div>
    </>
  )
}

