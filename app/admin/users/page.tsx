import {userService} from "@/services"
import {UsersRow as UsersRowCsr} from "./csr"
import {UsersRow as UsersRowSsr} from "./ssr"
import {
  TableCell,
  TableRow,
  Table,
  TableHeader,
} from "@/components/ui/table"

export const dynamic = "force-dynamic"

const error_message = "user_not_found"
type AdminUserPageError = "user_not_found"

interface AdminUserPageProps {
  searchParams: {
    error?: string
  }
}

export default async function AdminUserPage(props: AdminUserPageProps ) {
  const users = await userService.findUsersPaginatedAndSorted(1)

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow className="flex justify-around">
            <TableCell className="text-primary ml-16">Email</TableCell>
            <TableCell className="text-primary ml-12">Enabled</TableCell>
            <TableCell className="text-primary">Update</TableCell>
          </TableRow>
        </TableHeader>
      </Table>
      <UsersRowSsr users={users}/>
      <UsersRowCsr />
    </>
  )
}
