"use server"

import Link from "next/link"

export default async function SignupCompletedPage() {
  return (
    <>
      <div className="text-center text-sm">
        <Link href="/login" className="underline">
          click here to login
        </Link>
      </div>
    </>
  )
}

