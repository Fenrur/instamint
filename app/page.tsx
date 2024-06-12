"use client"

import {Button} from "@/components/ui/button"
import {useSession} from "@/auth/session"
import {useRouter} from "next/navigation"
import {signOut} from "next-auth/react"


export default function Home() {
  const {status, session} = useSession()
  const router = useRouter()
  const routingToLoginPage = () => {
    router.push("/login")
  }
  const routingToSignupPage = () => {
    router.push("/signup")
  }
  const routingToSearch = () => {
    router.push("/search")
  }
  const routingToMe = () => {
    router.push("/me")
  }
  const routingToAdminPage = () => {
    router.push("/admin/home")
  }

  return (
    <main>
      <div className="flex flex-col gap-4">
        <h1 className="text-2xl font-bold">Home - Debug panel, landing page will be integrated soon</h1>
        {status === "authenticated" && <Button className="w-24" onClick={() => {
          router.push("/me")
        }}>My Profile</Button>}
        <Button className="w-24" onClick={routingToSignupPage}>
          Signup
        </Button>
        <Button className="w-24" onClick={routingToLoginPage}>
          Login
        </Button>
        <Button className="w-24" onClick={routingToAdminPage}>
          admin
        </Button>
        <Button className="w-24" onClick={() => signOut()}>
          Logout
        </Button>
        <Button className="w-24" onClick={routingToSearch}>
          Search
        </Button>
        <Button className="w-24" onClick={routingToMe}>
          Me
        </Button>

        <div>{status}</div>
        <div>{session?.uid}</div>
      </div>
    </main>
  )
}
