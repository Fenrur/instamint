"use client"

import {AdminTable} from "./admin-table"
import React, {useEffect, useState, useCallback} from "react"
import {usersPageSize} from "@/services/constants"
import {getPaginatedAdminUsers} from "@/repository"
import {useRouter} from "next/navigation"
import {BackgroundLoadingDots} from "@/components/ui/loading-dots"

export function UsersRow() {
  const [page, setPage] = useState(1)
  const [users, setUsers] = useState<{
    id:number,
    email : string,
    isActivated : boolean,
  }[]>([])
  const router = useRouter()
  const [hasMore, setHasMore] = useState(true)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const loadNextPage = useCallback(() => {
    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    setTimeout(async () => {
      const paginatedUsers = await getPaginatedAdminUsers(page)

      if (typeof paginatedUsers === "string") {
        setHasMore(false)

        switch (paginatedUsers) {
          case "not_authenticated":
            router.push(`/login`)

            return

          default:
            return
        }
      }

      if (paginatedUsers.length < usersPageSize) {
        setHasMore(false)
      }

      setUsers([...users, ...paginatedUsers])
      setPage(page + 1)
    })
  }, [page, router, users])

  useEffect(() => {
    const intervalId = setInterval(() => {
      if (hasMore) {
        loadNextPage()
      }
    }, 500)

    return () => {clearInterval(intervalId)}
  }, [loadNextPage, hasMore])

  return (
    <>
      <AdminTable users={users}/>
      {hasMore && (
        <div className="grid justify-center">
          <BackgroundLoadingDots size={50} />
        </div>
      )}
    </>
  )
}
