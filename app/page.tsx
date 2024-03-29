"use client"

import {Button} from "@/components/ui/button"
import {Label} from "@/components/ui/label"
import {useEffect, useState} from "react"
import {useSession} from "@/auth/session"

export default function Home() {
  const [count, setCount] = useState(0)
  const handleClick = () => {
    setCount(prevState => prevState + 1)
  }

  const {status, data} = useSession()

  useEffect(() => {
    data?.uid
  }, [data])

  return (
    <main>
      <Button onClick={handleClick}>
        Click me
      </Button>
      <Label>{count}</Label>
      <div>{status}</div>
    </main>
  )
}
