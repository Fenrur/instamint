"use client"

import {Input} from "@/components/ui/input"
import {Label} from "@/components/ui/label"
import React, {useCallback, useState} from "react"
import {RightPanel} from "./right-panel"
import {NFTData, NFTList} from "@/components/NFT/NFTList"
import {Slider} from "@/components/ui/slider"
import {debounce} from "next/dist/server/utils"
import {TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs"
import {Tabs} from "@radix-ui/react-tabs"
import {ProfileData, ProfileList} from "@/components/Profile/ProfileList"
import {getPaginatedNftsWithSearch, getPaginatedUsersWithSearch} from "@/repository"
import {nftsPageSize, profilePageSize} from "@/services/constants"
import {BackgroundLoadingDots} from "@/components/ui/loading-dots"
import InfiniteScroll from "react-infinite-scroll-component"

const debounceTime = 300

export default function SignupPage() {
  const [query, setQuery] = useState("")
  const [location, setLocation] = useState("")
  const [priceRange, setPriceRange] = React.useState<number[]>([1, 100])
  const [nftsList, setNftsList] = useState<NFTData[]>(new Array<NFTData>())
  const [profilesList, setProfilesList] = useState<ProfileData[]>(new Array<ProfileData>())
  const [isNfts, setIsNfts] = useState<boolean>(true)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const handleQueryChange = debounce((event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value)
    fetchData(event.target.value, location, priceRange, page)
  }, debounceTime)
  const handleLocationChange = debounce((event: React.ChangeEvent<HTMLInputElement>) => {
    setLocation(event.target.value)
    fetchData(query, event.target.value, priceRange, page)
  }, debounceTime)
  const handlePriceChange = debounce((newValue: number[]) => {
    setPriceRange([newValue[0], newValue[1]])
    fetchData(query, location, newValue, page)
  }, debounceTime)
  const fetchData = (query: string, location: string, priceRange: number[], page: number) => {
    if (isNfts) {
      void fetchNftsData(query, location, priceRange, page).then(res => {
        setNftsList([...res])
      })
    } else {
      void fetchUsersData(query, location, page).then(res => {
        setProfilesList([...res])
      })
    }

    setPage(1)
  }
  const fetchUsersData = async (query: string, location: string, page: number) => {
    return await getPaginatedUsersWithSearch(query, location, page)
  }
  const fetchNftsData = async (query: string, location: string, priceRange: number[], page: number) => {
    return await getPaginatedNftsWithSearch(query, location, priceRange, page)
  }
  const loadNextPage = useCallback(async () => {
    if (isNfts) {
      const paginatedNfts = await fetchNftsData(query, location, priceRange, page)

      if (paginatedNfts.length < nftsPageSize) {
        setHasMore(false)
      }

      setNftsList([...nftsList, ...paginatedNfts])
    } else {
      const paginatedUsers = await fetchUsersData(query, location, page)

      if (paginatedUsers.length < profilePageSize) {
        setHasMore(false)
      }

      setProfilesList([...profilesList, ...paginatedUsers])
    }

    setPage(page + 1)
  }, [isNfts, page, query, location, priceRange, nftsList, profilesList])


  return (
    <RightPanel title="Search" text="you can search what you want" width="w-full">
      <div className="min-h-screen p-6 bg-gray-100 flex items-center justify-center">
        <div className="container max-w-screen-lg mx-auto">
          <div className="bg-white rounded shadow-lg p-4 px-4 md:p-8 mb-6">
            <div className="grid gap-4 gap-y-2 text-sm grid-cols-1 lg:grid-cols-3">
              <div className="text-gray-600">
                <p className="font-medium text-lg">Search Parameters</p>
                <p>Fill out the fields below to search.</p>
              </div>

              <div className="lg:col-span-2">
                <div className="grid gap-4 gap-y-2 text-sm grid-cols-1 md:grid-cols-2">
                  <div className="md:col-span-1">
                    <Label htmlFor="query">Query</Label>
                    <Input
                      name="query"
                      id="query"
                      type="text"
                      className="h-10 border mt-1 rounded px-4 w-full bg-gray-50"
                      onChange={handleQueryChange}
                    />
                  </div>

                  <div className="md:col-span-1">
                    <Label htmlFor="location">Location</Label>
                    <Input
                      name="location"
                      id="location"
                      type="text"
                      className="h-10 border mt-1 rounded px-4 w-full bg-gray-50"
                      onChange={handleLocationChange}
                    />
                  </div>

                  <div className="md:col-span-2">
                    <Label htmlFor="price">Price</Label>
                    <Slider
                      defaultValue={priceRange}
                      onValueChange={handlePriceChange}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6">
              <Tabs defaultValue="nfts">
                <TabsList className="flex w-full">
                  <TabsTrigger className="w-1/2 text-center"
                               value="nfts" onClick={() => {
                    setIsNfts(true)
                  }}
                  >
                    NFTs
                  </TabsTrigger>
                  <TabsTrigger className="w-1/2 text-center"
                               value="profiles" onClick={() => {
                    setIsNfts(false)
                  }}>
                    Users
                  </TabsTrigger>
                </TabsList>

                <div className="mt-4">
                  <TabsContent value="nfts">
                    <InfiniteScroll
                      dataLength={nftsList.length}
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
                      <NFTList data={nftsList}/>
                    </InfiniteScroll>
                  </TabsContent>
                  <TabsContent value="profiles">
                    <ProfileList data={profilesList}/>
                  </TabsContent>
                </div>
              </Tabs>
            </div>
          </div>
        </div>
      </div>
    </RightPanel>
  )
}
