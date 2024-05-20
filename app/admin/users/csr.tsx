"use client"

import React, {useEffect, useState} from "react"
import {usersPageSize} from "@/services/constants"
import {getPaginatedUsers} from "@/repository"
import {useRouter} from "next/navigation"
import {RoleType} from "@/domain/types"
import InfiniteScroll from "react-infinite-scroll-component"
import {BackgroundLoadingDots} from "@/components/ui/loading-dots"
import {MyTable} from "./MyTable"

export function UsersRow() {
  const [page, setPage] = useState(2)
  const [users, setUsers] = useState<{
    id:number,
    email : string,
    isActivated : boolean,
    role: RoleType
  }[]>([])
  const [init, setInit] = useState(true)
  const router = useRouter()
  const [hasMore, setHasMore] = useState(true)
  const loadNextPage = () => {
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
  }

  useEffect(() => {
    if (init) {
      setInit(false)
      loadNextPage()

      const nftSection = document.getElementById("nfts-section-ssr")

      if (nftSection) {
        nftSection.classList.add("hidden")
      }
    }
  }, [init, loadNextPage])

  return (
    <>
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
        <MyTable users={users}/>
      </InfiniteScroll>
    </>
  )
}
