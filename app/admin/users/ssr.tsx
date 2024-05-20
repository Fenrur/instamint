import {RoleType} from "@/domain/types"

interface UsersSectionProps {
  users: {
    isActivated: boolean,
    email: string,
    id: number,
    role: RoleType
  }[]
}
import {MyTable} from "./MyTable"
export function UsersRow({users}:UsersSectionProps) {
  return (
    <>
      <>
      <MyTable users={users}/>
      </>
    </>
  )
}
