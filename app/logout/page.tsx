"use client"

import {useEffect} from "react"
import {signOut} from "next-auth/react"

const LogoutPage = () => {
    useEffect(() => {
      void signOut({redirect: false}).then(() => {
        window.location.href = "/login"
      })
    }, [])

    return (
        <div>
            Logging out...
        </div>
    )
}

export default LogoutPage
