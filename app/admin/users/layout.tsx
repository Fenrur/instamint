import React from "react"
import {AdminLayout} from "@/components/layout/admin-layout"

export const dynamic = "force-dynamic"

export default async function LayoutAdminUserPage({
                                                children
                                              }: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <AdminLayout>
        <h3 className="w-5/6 mx-auto text-center font-bold text-3xl mt-20">
          Users
          <div className="w-5/6 mt-12 mx-auto">
            {children}
          </div>
        </h3>
      </AdminLayout>
    </>
  )
}
