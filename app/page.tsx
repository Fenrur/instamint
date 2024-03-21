"use client"

import {Button} from "@/components/ui/button";
import {Label} from "@/components/ui/label";
import {useState} from "react";
import {env} from "@/env";

export default function Home() {
  const [count, setCount] = useState(0)

  return (
    <main>
      <Button onClick={() => setCount(prevState => prevState + 1)}>
        Click me
      </Button>
      <Label>{count}</Label>
    </main>
  );
}
