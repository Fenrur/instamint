"use client"

import {AdminTable} from "./admin-table"
import React, {useEffect, useState, useCallback} from "react"
import {usersPageSize} from "@/services/constants"
import {getPaginatedUsers} from "@/repository"
import {useRouter} from "next/navigation"
import InfiniteScroll from "react-infinite-scroll-component"
import {BackgroundLoadingDots} from "@/components/ui/loading-dots"

export function UsersRow() {
  const [page, setPage] = useState(1)
  const [users, setUsers] = useState<{
    id:number,
    email : string,
    isActivated : boolean,
  }[]>([])
  const [init, setInit] = useState(true)
  const router = useRouter()
  const [hasMore, setHasMore] = useState(true)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const loadNextPage = useCallback(() => {
    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    setTimeout(async () => {
      const paginatedUsers = await getPaginatedUsers(page)

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
    if (init) {
      setInit(false)
      loadNextPage()
    }
  }, [init, users, loadNextPage])

  return (
      <InfiniteScroll
        dataLength={users.length}
        next={loadNextPage}
        hasMore={hasMore}
        loader={
          <div className="grid justify-center ">
            {
              <BackgroundLoadingDots size={50}/>
            }
          </div>
        }
      >
        <AdminTable users={users}/>
      </InfiniteScroll>
  )
}
