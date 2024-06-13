import {Button} from "@/components/ui/button"
import Link from "next/link"
import React from "react"

export function MyUserAuthenticatedDoesntExist() {
  return (
    <section className="grid justify-center mt-10 gap-4">
      <h2 className="text-center font-semibold text-sm">
        Your user that you are logged in does not exist
      </h2>
      <div className="grid text-center text-sm gap-0.5">
        <p>Already have an account ?</p>
        <p>
          <Button className="p-0" variant="link" asChild>
            <Link href={`/login`}>
              login
            </Link>
          </Button>
          {" "} here
        </p>
        <p className="mt-2">You do not have an account ?</p>
        <p>
          <Button className="p-0" variant="link" asChild>
            <Link href={`/signup`}>
              signup
            </Link>
          </Button>
          {" "} here
        </p>
      </div>
    </section>
  )
}
