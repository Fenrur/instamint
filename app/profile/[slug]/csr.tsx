"use client"

import React, {useCallback, useEffect, useState} from "react"
import {BackgroundLoadingDots} from "@/components/ui/loading-dots"

import {NftContainer} from "./ssr"
import {NftType} from "@/domain/types"
import InfiniteScroll from "react-infinite-scroll-component"
import {getPaginatedNfts} from "@/repository"
import {toast} from "sonner"
import {useRouter} from "next/navigation"
import {createRedirectQueryParam} from "@/utils/url"
import {DateTime} from "luxon"
import {nftsPageSize} from "@/services/constants"

interface TestButtonProps {
  username: string
}

export function NftsSection({username}: TestButtonProps) {
  const [page, setPage] = useState(1)
  const [nfts, setNfts] = useState<{
    mintCount: number,
    commentCount: number,
    postedAt: DateTime<true>,
    contentUrl: string,
    id: number,
    type: NftType
  }[]>([])
  const [hasMore, setHasMore] = useState(true)
  const [init, setInit] = useState(true)
  const router = useRouter()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const loadNextPage = useCallback(() => {
    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    setTimeout(async () => {
      const paginatedNfts = await getPaginatedNfts(username, page)

      if (typeof paginatedNfts === "string") {
        setHasMore(false)

        switch (paginatedNfts) {
          case "profile_not_found":
            toast.error("Profile not found", {description: "Please try again later."})

            return

          case "not_authenticated":
            router.push(`/login${createRedirectQueryParam(`/profile/${username}`)}`)

            return

          case "dont_follow_profile":

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
  }, [nfts, page, router, username])

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
    <InfiniteScroll
      dataLength={nfts.length}
      next={loadNextPage}
      hasMore={hasMore}
      loader={
        <div className="grid justify-center">
          <BackgroundLoadingDots size={50}/>
        </div>
      }
    >
      <section className={"grid grid-cols-3 gap-0.5"}>
        {
          nfts.map((nft, index) => {
            return (
              <React.Fragment key={index}>
                <NftContainer
                  mints={nft.mintCount.toString()}
                  comments={nft.commentCount.toString()}
                  type={nft.type}
                  url={nft.contentUrl}
                />
              </React.Fragment>
            )
          })
        }
      </section>
    </InfiniteScroll>
  )
}
