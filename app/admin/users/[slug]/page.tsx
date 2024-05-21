import {userService} from "@/services"
import {UserPage} from './ssr'
import { headers } from "next/headers"

export const dynamic = "force-dynamic"

export default async function AdminUserPage() {
  const headersList = headers()
  const headerUrl = headersList.get('x-url') || ""
  const user = await userService.findWithId(parseInt(headerUrl.slice(-1)))

  return (
    <>
      <UserPage user={user[0]}/>
    </>
  )
}
