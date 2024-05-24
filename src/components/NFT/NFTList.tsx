"use client"

import React from "react"

import {NftType} from "@/domain/types"
import {DateTime} from "luxon"
import {NftContainer} from "../../../app/profile/[slug]/ssr"


export interface NFTData {
  id: number;
  mintCount: number,
  commentCount: number,
  postedAt: DateTime<true>,
  contentUrl: string,
  type: NftType
}


export function NFTList({data}: { data: NFTData[] }) {
  return (
    <section className={"grid grid-cols-3 gap-0.5"}>
      {
        data.map((nft) => {
          return (
            <React.Fragment key={nft.id}>
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
  )
}
