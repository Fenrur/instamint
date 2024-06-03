import React from "react"
import {AdminLayout} from "@/components/layout/admin-layout"
import {getServerSession} from "@/auth"
import {redirect} from "next/navigation"
import {createRedirectQueryParam} from "@/utils/url"
import {profileService} from "@/services"

export const dynamic = "force-dynamic"

export default async function LayoutAdminUserPage({
                                                children
                                              }: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerSession()

  if (!session) {
    redirect(`/login${createRedirectQueryParam(`/admin/users`)}`)
  }

  const userAndProfile = await profileService.findByUserUid(session.uid)

  if (!userAndProfile) {
    redirect(`/login${createRedirectQueryParam(`/admin/users`)}`)
  }

  if (userAndProfile.role !== "admin") {
    redirect(`/`)
  }

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
