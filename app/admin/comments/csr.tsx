"use client"

import {AdminTable} from "./admin-table"
import React, {useEffect, useState, useCallback} from "react"
import {commentsPageSize} from "@/services/constants"
import {getPaginatedAdminComments} from "@/repository"
import {useRouter} from "next/navigation"
import {BackgroundLoadingDots} from "@/components/ui/loading-dots"

export function CommentsRow() {
  const [page, setPage] = useState(1)
  const [comments, setComments] = useState<{
    id: number,
    commentary: string,
    ownerUsername: string,
    ownerEmail: string
  }[]>([])
  const router = useRouter()
  const [hasMore, setHasMore] = useState(true)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const loadNextPage = useCallback(() => {
    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    setTimeout(async () => {
      const paginatedComments = await getPaginatedAdminComments(page)

      if (typeof paginatedComments === "string") {
        setHasMore(false)

        switch (paginatedComments) {
          case "not_authenticated":
            router.push(`/login`)

            return

          default:
            return
        }
      }

      if (paginatedComments.length < commentsPageSize) {
        setHasMore(false)
      }

      setComments([...comments, ...paginatedComments])
      setPage(page + 1)
    })
  }, [page, router, comments])

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
      <AdminTable comments={comments}/>
      {hasMore && (
        <div className="grid justify-center">
          <BackgroundLoadingDots size={50} />
        </div>
      )}
    </>
  )
}
