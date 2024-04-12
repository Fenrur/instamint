import {useSession as useNextAuthSession} from "next-auth/react"
import {Session} from "@/auth/types"

export function useSession() {
  const {data, status, update} = useNextAuthSession()

  return {
    data: data as Session|null,
    status,
    update
  }
}
