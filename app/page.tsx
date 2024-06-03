"use client"

import {Button} from "@/components/ui/button"
import {useSession} from "@/auth/session"
import {signOut} from "next-auth/react"
import {useRouter} from "next/navigation"

export default function Home() {
  const {status, session} = useSession()
  const router = useRouter()
  const routingToLoginPage = () => {
    router.push("/login")
  }
  const routingToSignupPage = () => {
    router.push("/signup")
  }
  const routingToAdminUserPage = () => {
    router.push("/admin/users")
  }

  return (
    <main>
      <div className="flex flex-col gap-4">
        <h1 className="text-2xl font-bold">Home - Debug panel, landing page will be integrated soon</h1>
        { status === "authenticated" && <Button className="w-24" onClick={() => { router.push("/me") }}>My Profile</Button> }
        <Button className="w-24" onClick={routingToSignupPage}>
          Signup
        </Button>
        <Button className="w-24" onClick={routingToLoginPage}>
          Login
        </Button>
        <Button className="w-24" onClick={routingToAdminUserPage}>
          admin users
        </Button>
        <Button className="w-24" onClick={() => signOut()}>
          Logout
        </Button>
        <div>{status}</div>
        <div>{session?.uid}</div>
      </div>
    </main>
  )
}
