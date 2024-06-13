import {useSession as useNextAuthSession} from "next-auth/react"
import {Session} from "@/auth/types"

export function useSession() {
  const {data, status, update} = useNextAuthSession()
  const session = Session.safeParse(data)

  return {
    session: session.success ? session.data : null,
    status,
    update
  }
}
