"use client"

import {Button} from "@/components/ui/button"
import {Label} from "@/components/ui/label"
import {useState} from "react"
import {useSession} from "@/auth/session"
import {signOut} from "next-auth/react"
import {useRouter} from "next/navigation"

export default function Home() {
  const [count, setCount] = useState(0)
  const handleClick = () => {
    setCount(prevState => prevState + 1)
  }
  const {status, session} = useSession()
  const router = useRouter()
  const routingToLoginPage = () => {
    router.push("/login")
  }
  const routingToSignupPage = () => {
    router.push("/signup")
  }

  const routingToSearch = () => {
    router.push("/search");
  };

  const routingToMe = () => {
    router.push("/me");
  };

  return (
    <main>
      <div className="flex flex-col gap-4">
        <Button className="w-24" onClick={handleClick}>
          Click me
        </Button>
        <Label>{count}</Label>
        <Button className="w-24" onClick={routingToSignupPage}>
          Signup
        </Button>
        <Button className="w-24" onClick={routingToLoginPage}>
          Login
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
