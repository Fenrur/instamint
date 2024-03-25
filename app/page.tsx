"use client"

import {Button} from "@/components/ui/button"
import {Label} from "@/components/ui/label"
import {useState} from "react"

export default function Home() {
  const [count, setCount] = useState(0)
  const handleClick = () => {
    setCount(prevState => prevState + 1)
  }

  return (
    <main>
      <Button onClick={handleClick}>
        Click me
      </Button>
      <Label>{count}</Label>
    </main>
  )
}
