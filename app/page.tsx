"use client"

import {useEffect, useState} from "react"
import {useSession} from "@/auth/session"
import {useRouter} from "next/navigation"

export default function Home() {
    const [count, setCount] = useState(0)
    const handleClick = () => {
        setCount(prevState => prevState + 1)
    }

    const {status, session} = useSession()
    const router = useRouter()

    useEffect(() => {
        if (status === "authenticated") {
            router.push("/settings")
        } else {
            router.push("/login")
        }
    }, [status]);

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
        <></>
    )
}
