"use client"

import {Button} from "@/components/ui/button"
import React, {useEffect, useMemo, useState} from "react"
import {cn} from "@/lib/utils"
import {useBottomScrollListener} from "react-bottom-scroll-listener"
import {useFetPaginedNftsByUsername} from "@/hooks"
import {BackgroundLoadingDots, LoadingDots} from "@/components/ui/loading-dots"

import {Ssr} from "./ssr"
import {NftType} from "../../domain/types"
import InfiniteScroll from "react-infinite-scroll-component"
import {getPaginedNftsByUsername} from "@/repository"

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

  useEffect(() => {
    if (init) {
      setInit(false)
      loadNextPage()

      const nftSection = document.getElementById("nfts-section-ssr")
      if (nftSection) {
        nftSection.classList.add("hidden")
      }
    }
  }, [init])

  const loadNextPage = () => {
    setTimeout(async () => {
      const n = await getPaginedNftsByUsername(username, page)
      if (!n) {
        return
      }
      if (!Array.isArray(n)) {
        return
      }

      if (n.length == 0) {
        setHasMore(false)
        return
      }

      setNfts([...nfts, ...n])
      setPage(page + 1)
    })
  }

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
                <Ssr
                  mints={nft.mintCount.toString()}
                  comments={nft.commentCount.toString()}
                  type="image"
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
