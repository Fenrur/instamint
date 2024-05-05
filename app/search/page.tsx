"use client"

import {Input} from "@/components/ui/input"
import {Label} from "@/components/ui/label"
import React, {useEffect, useState} from "react"
import {RightPanel} from "./right-panel"
import {NFTData, NFTList} from "@/components/NFT/NFTList"
import {Slider} from "@/components/ui/slider"
import {debounce} from "next/dist/server/utils"
import {TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs"
import {Tabs} from "@radix-ui/react-tabs"
import {ProfileData, ProfileList} from "@/components/Profile/ProfileList"

type SignupPageError = "email_verification_limit_exceeded" | "email_exists";

interface SignupPageProps {
  searchParams: {
    key: string;
    price_min: string;
    price_max: string;
    location: string;
    error?: SignupPageError;
  };
}

function parseError(props: SignupPageProps): SignupPageError | null {
  const error = props.searchParams.error

  if (error === "email_verification_limit_exceeded") {
    return "email_verification_limit_exceeded"
  }

  
return null
}

const debounceTime = 300

export default function SignupPage(props: SignupPageProps) {
  const error = parseError(props)
  const [query, setQuery] = useState("")
  const [location, setLocation] = useState("")
  const [priceRange, setPriceRange] = React.useState<number[]>([1, 100])
  const [nftsList, setNftsList] = useState<NFTData[]>(new Array<NFTData>())
  const [profilesList, setProfilesList] = useState<ProfileData[]>(new Array<ProfileData>())
  const [isNfts, setIsNfts] = useState<boolean>(true)
  const handleQueryChange = debounce((event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value)
  }, debounceTime)
  const handleLocationChange = debounce((event: React.ChangeEvent<HTMLInputElement>) => {
    setLocation(event.target.value)
  }, debounceTime)
  const handlePriceChange = debounce((newValue: number[]) => {
    setPriceRange([newValue[0], newValue[1]])
  }, debounceTime)

  useEffect(() => {
    const fetchNftsData = async () => {
      try {
        const queryParams = new URLSearchParams({
          query,
          minPrice: priceRange[0].toString(),
          maxPrice: priceRange[1].toString(),
          location
        })
        const response = await fetch(`/api/nft/search?${queryParams.toString()}`)

        if (!response.ok) {
          throw new Error("Failed to fetch data")
        }

        const responseData = await response.json() as NFTData[]
        setNftsList(responseData)
      } catch (error) {
        console.error("Error fetching data:", error)
      }
    }
    const fetchUsersData = async () => {
      try {
        const queryParams = new URLSearchParams({
          query,
          location
        })
        const response = await fetch(`/api/profile/search?${queryParams.toString()}`)

        if (!response.ok) {
          throw new Error("Failed to fetch data")
        }

        const responseData = await response.json() as ProfileData[]
        setProfilesList(responseData)
      } catch (error) {
        console.error("Error fetching data:", error)
      }
    }

    if (isNfts) {
      fetchNftsData()
    } else {
      fetchUsersData()
    }
  }, [query, priceRange, location, isNfts])

  return (
    <RightPanel title="Search" text="you can serach what you want" width="w-[350px]">
      <div className="grid gap-4">
        <div className="grid gap-2">
          <Label htmlFor="query" className={error ? "text-destructive" : ""}>Query</Label>
          <Input
            name="query"
            id="query"
            type="text"
            onChange={handleQueryChange}
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="location" className={error ? "text-destructive" : ""}>Location</Label>
          <Input
            name="location"
            id="location"
            type="text"
            onChange={handleLocationChange}
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="price" className={error ? "text-destructive" : ""}>Price</Label>
          <Slider
            defaultValue={priceRange}
            onValueChange={handlePriceChange}
          />
        </div>
      </div>

      <Tabs defaultValue="nfts">
        <TabsList>
          <TabsTrigger value="nfts" onClick={() => { setIsNfts(true) }}>Nfts</TabsTrigger>
          <TabsTrigger value="documents" onClick={() => { setIsNfts(false) }}>Users</TabsTrigger>
        </TabsList>

        <div>
          <TabsContent value="nfts">
            <NFTList data={nftsList}/>
          </TabsContent>
          <TabsContent value="documents">
            <ProfileList data={profilesList}/>
          </TabsContent>
        </div>
      </Tabs>

    </RightPanel>
  )
}
