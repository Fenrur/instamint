"use client"

import {AdminTable} from "./admin-table"
import React, {useEffect, useState, useCallback} from "react"
import {reportsPageSize} from "@/services/constants"
import {getPaginatedAdminReports} from "@/repository"
import {useRouter} from "next/navigation"
import {BackgroundLoadingDots} from "@/components/ui/loading-dots"

export function ReportsRow() {
  const [page, setPage] = useState(1)
  const [reports, setReports] = useState<{
    type: string,
    element: string,
    reason: string,
    user: string,
  }[]>([])
  const router = useRouter()
  const [hasMore, setHasMore] = useState(true)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const loadNextPage = useCallback(() => {
    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    setTimeout(async () => {
      const paginatedReports = await getPaginatedAdminReports(page)

      if (typeof paginatedReports === "string") {
        setHasMore(false)

        switch (paginatedReports) {
          case "not_authenticated":
            router.push(`/login`)

            return

          default:
            return
        }
      }

      if (paginatedReports) {
        if (paginatedReports.length < reportsPageSize) {
          setHasMore(false)
        }

        setReports([...reports, ...paginatedReports])
        setPage(page + 1)
      }
    })
  }, [page, router, reports])

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
      <AdminTable reports={reports}/>
      {hasMore && (
        <div className="grid justify-center">
          <BackgroundLoadingDots size={50} />
        </div>
      )}
    </>
  )
}
