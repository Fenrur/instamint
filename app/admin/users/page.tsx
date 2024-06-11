import {UsersRow as UsersRowCsr} from "./csr"

export const dynamic = "force-dynamic"

export default async function AdminUserPage() {
  return (
    <>
      <UsersRowCsr />
    </>
  )
}
