"use client"

import {Input} from "@/components/ui/input"
import {Label} from "@/components/ui/label"
import React, {useCallback, useEffect, useState} from "react"
import {RightPanel} from "./right-panel"
import {NFTData, NFTList} from "@/components/NFT/NFTList"
import {debounce} from "next/dist/server/utils"
import {TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs"
import {Tabs} from "@radix-ui/react-tabs"
import {ProfileData, ProfileList} from "@/components/Profile/ProfileList"
import {getPaginatedNftsWithSearch, getPaginatedUsersWithSearch} from "@/repository"
import {nftsPageSize, profilePageSize} from "@/services/constants"
import {BackgroundLoadingDots} from "@/components/ui/loading-dots"
import InfiniteScroll from "react-infinite-scroll-component"
import {Slider} from "@/components/ui/slider"

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
  const [init, setInit] = useState(true)
  useEffect(() => {
    if (init) {
      setInit(false)
      void loadNextPage()

      const nftSection = document.getElementById("nfts-section-ssr")

      if (nftSection) {
        nftSection.classList.add("hidden")
      }
    }
  }, [init, loadNextPage])

  function onTabChange(value: string) {
    const x = value === "nfts"
    setIsNfts(x)
    fetchData(query, location, priceRange, page)
    setPage(1)
    setHasMore(true)
  }

  // State to manage the visibility of the advanced options
  const [showAdvanced, setShowAdvanced] = useState(false)
  // Function to toggle the advanced options visibility
  const toggleAdvancedOptions = () => {
    setShowAdvanced(!showAdvanced)
  }

  return (
    <RightPanel title="Search" text="you can search what you want" width="w-full">
      <div className="flex items-center justify-center px-20">
        <Tabs defaultValue="nfts" className="flex flex-col max-w-[940px] justify-center w-full"
              onValueChange={value => {
                onTabChange(value)
              }}>
          <div className="md:grid lg:grid-cols-4 md:grid-cols-1 gap-1 items-center justify-center align-middle">
            <div className="lg:col-span-3">
              <Label htmlFor="query">Keyword</Label>
              <Input
                name="query"
                id="query"
                type="text"
                className="h-10 border mt-1 rounded px-4 w-full bg-gray-50"
                onChange={handleQueryChange}
              />
            </div>
            <TabsList className="lg:col-span-1 flex h-10 mt-7">
              <TabsTrigger className="w-1/2 text-center"
                           value="nfts">
                NFTs
              </TabsTrigger>
              <TabsTrigger className="w-1/2 text-center"
                           value="profiles">

                Users
              </TabsTrigger>
            </TabsList>

            <div className="text-center col-span-4">
              <div className="text-end ">
                <button onClick={toggleAdvancedOptions} className="mt-4">
                  {showAdvanced ? "▲" : "▼"} Advanced Options
                </button>
              </div>

              {showAdvanced && (
                <div className="flex lg:flex-row md:flex-col sm:flex-col text-start justify-center  gap-2">
                  <div className="md:w-full lg:w-1/2">
                    <Label htmlFor="location">Location</Label>
                    <Input
                      name="location"
                      id="location"
                      type="text"
                      className="h-10 border mt-1 rounded px-4 w-full bg-gray-50"
                      onChange={handleLocationChange}
                    />
                  </div>

                  <div className="md:w-full lg:w-1/2 mt-5">
                    <Label htmlFor="price">Price</Label>
                    <Slider
                      defaultValue={priceRange}
                      onValueChange={handlePriceChange}
                    />
                  </div>
                </div>
              )}
            </div>

          </div>

          <div className="mt-4 justify-center text-center">
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
              <InfiniteScroll
                dataLength={profilesList.length}
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
                <ProfileList data={profilesList}/>
              </InfiniteScroll>
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </RightPanel>
  )
}
