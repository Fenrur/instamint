"use client"

import {AdminTable} from "./admin-table"
import React, {useEffect, useState, useCallback} from "react"
import {nftsPageSize} from "@/services/constants"
import {getPaginatedAdminNfts} from "@/repository"
import {useRouter} from "next/navigation"
import {BackgroundLoadingDots} from "@/components/ui/loading-dots"

export function NftsRow() {
  const [page, setPage] = useState(1)
  const [nfts, setNfts] = useState<{
    id:number,
    title: string,
    owner: string
  }[]>([])
  const router = useRouter()
  const [hasMore, setHasMore] = useState(true)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const loadNextPage = useCallback(() => {
    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    setTimeout(async () => {
      const paginatedNfts = await getPaginatedAdminNfts(page)

      if (typeof paginatedNfts === "string") {
        setHasMore(false)

        switch (paginatedNfts) {
          case "not_authenticated":
            router.push(`/login`)

            return

          default:
            return
        }
      }

      if (paginatedNfts.length < nftsPageSize) {
        setHasMore(false)
      }

      setNfts([...nfts, ...paginatedNfts])
      setPage(page + 1)
    })
  }, [page, router, nfts])

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
      <AdminTable nfts={nfts}/>
      {hasMore && (
        <div className="grid justify-center">
          <BackgroundLoadingDots size={50} />
        </div>
      )}
    </>
  )
}
