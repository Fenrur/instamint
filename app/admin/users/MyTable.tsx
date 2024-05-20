import {
  TableCell,
  TableRow,
  Table,
  TableBody,
} from "@/components/ui/table"
import {RoleType} from "@/domain/types"
import {CheckIcon} from "@/components/ui/icons"
import Link from "next/link"
import {Button} from "@/components/ui/button"

interface UsersSectionProps {
  users: {
    isActivated: boolean,
    email: string
    id: number,
    role: RoleType
  }[]
}

export function MyTable({users}:UsersSectionProps) {
  return (
    <Table>
      <TableBody>
        {users.map((user) => (
            <TableRow className="h-16 flex justify-around items-center" key={user.id}>
              <TableCell>{user.email}</TableCell>
            {user.isActivated ? (
              <TableCell><CheckIcon/></TableCell>
            ) : (
              <TableCell></TableCell>
            )}
<TableCell><Link href={`/admin/users/${user.id}` }><Button className="ml-16 h-8 w-16 bg-primary">Update</Button></Link></TableCell>
          </TableRow>))}
      </TableBody>

    </Table>
  )
}
