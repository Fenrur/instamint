"use client"

import React, {useEffect, useState} from "react"
import {BackgroundLoadingDots} from "@/components/ui/loading-dots"

import {NftContainer} from "./ssr"
import {NftType} from "../../domain/types"
import InfiniteScroll from "react-infinite-scroll-component"
import {getPaginedNftsByUsername} from "@/repository"
import {toast} from "sonner"
import {useRouter} from "next/navigation"
import {createRedirectQueryParam} from "@/utils/url"

interface TestButtonProps {
  username: string
}

export function NftsSection({username}: TestButtonProps) {
  const [page, setPage] = useState(1)
  const [nfts, setNfts] = useState<{
    mintCount: number,
    commentCount: number,
    postedAt: string,
    contentUrl: string,
    id: number,
    type: NftType
  }[]>([])
  const [hasMore, setHasMore] = useState(true)
  const [init, setInit] = useState(true)
  const router = useRouter()
  const loadNextPage = () => {
    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    setTimeout(async () => {
      const n = await getPaginedNftsByUsername(username, page)

      if (!n) {
        return
      }

      if (!Array.isArray(n)) {
        switch (n) {
          case "profile_not_found":
            toast.error("Profile not found", {description: "Please try again later."})

            return

          case "not_authenticated":
            router.push(`/login${createRedirectQueryParam(username)}`)

            return

          case "dont_follow_profile":
            router.refresh()

            return

          default:
            return
        }
      }

      if (n.length === 0) {
        setHasMore(false)

        return
      }

      setNfts([...nfts, ...n])
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
    <InfiniteScroll
      dataLength={nfts.length}
      next={loadNextPage}
      hasMore={hasMore}
      loader={
        <div className="grid justify-center">
          {
            <BackgroundLoadingDots size={50}/>
          }
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
