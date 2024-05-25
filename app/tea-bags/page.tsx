"use client"
import {Input} from "@/components/ui/input"
import {Label} from "@/components/ui/label"

import {Button} from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog"
import {DateTime} from "luxon"
import {toast} from "sonner"
import MultiSelect from "@/components/ui/multi-select"
import {useFetchNFTs, useFetchUsers, useReportProfile} from "@/repository/hooks"
import React, {useCallback, useEffect, useState} from "react"
import {TeaBagList} from "@/components/Profile/ProfileList"
import InfiniteScroll from "react-infinite-scroll-component"
import {BackgroundLoadingDots} from "@/components/ui/loading-dots"
import {fetchTeaBags} from "@/repository"

type SignupPageError = "email_verification_limit_exceeded" | "email_exists";

interface SignupPageProps {
  searchParams: {
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


export interface ValueLabel {
  value: number;
  label: string;
}

export interface TeaBag {
  id?: number;
  cooks_count?: number;
  followed_count?: number;
  followers_count?: number;

  username: string;
  bio?: string;
  link: string;
  avatarUrl?: string;
  nftIds?: number[];
  whitelistUserIds?: number[];
  whitelistStart?: DateTime;
  whitelistEnd?: DateTime;
}

export default function TeaBagPage(props: SignupPageProps) {
  const error = parseError(props)
  const [formData, setFormData] = useState<TeaBag>({
    username: "",
    bio: "",
    link: "",
    nftIds: [],
    whitelistUserIds: [],
    whitelistStart: DateTime.now(),
    whitelistEnd: DateTime.now(),
  })
  const [teabagsList, setTeabagsList] = useState<TeaBag[]>([])
  const {usersData, usersDataMutate} = useFetchUsers()
  const {nftsData, nftsDataMutate} = useFetchNFTs()
  const {isFetchingReport, reportProfile, errorReport, dataReport} = useReportProfile()
  const [isOpen, setIsOpen] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const [page, setPage] = useState(1)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const response = await fetch("/api/tea-bag", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(formData)
    })

    if (response.ok) {
      toast.success("Successfully created", {description: "Your Tea Bag has been created."})
      setIsOpen(false)
    } else {
      toast.error("Error", {description: "Failed to create Tea Bag"})
      throw new Error("Failed to create Tea Bag")
    }
  }
  const handleFormOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {name, value} = e.target
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }))
  }

  async function handleOnClickDelete(id: number) {
    try {
      const response = await fetch(`/api/tea-bag/delete?id=${id}`, {
        method: "POST",
      })

      if (response.ok) {
        toast.success("Successfully deleted", {description: "The Tea Bag has been deleted."})
      } else {
        toast.error("Error", {description: "Failed to delete Tea Bag"})
      }
    } catch (error) {
      console.error("Error:", error)
    }
  }

  async function handleOnClickReport(id: number) {
    reportProfile({reportedProfileId: id, reason: "tea-bag"}).then(() => {
      toast.success("Successfully deleted", {description: "The Tea Bag has been deleted."})
    }).catch(() => {
      toast.error("Error", {description: "Failed to delete Tea Bag"})
    })
  }

  function handleOnClickEdite(id: number) {

  }

  const loadNextPage = useCallback(() => {
    void fetchTeaBags({page}).then(res => {
      if (res.length < teabagsList.length) {
        setHasMore(false)
      }

      setTeabagsList([...teabagsList, ...res])

      setPage(page + 1)
    })
  }, [page, teabagsList])
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
  }, [init, loadNextPage])

  return (
    <div className="min-h-screen p-6 bg-gray-100 flex items-center justify-center">
      <div className="container max-w-screen-lg mx-auto">
        <div className="bg-white rounded shadow-lg p-4 px-4 md:p-8 mb-6">
          <div className="grid gap-4 gap-y-2 text-sm grid-cols-1 lg:grid-cols-3">
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
              <DialogTrigger asChild>
                <Button className="Button violet">Create Tea Bag</Button>
              </DialogTrigger>

              <DialogPortal>
                <DialogOverlay className="DialogOverlay"/>
                <DialogContent className="DialogContent">
                  <DialogTitle className="DialogTitle">Add TEA BAG</DialogTitle>
                  <DialogDescription className="DialogDescription">
                    Make changes to your profile here. Click save when you're done.
                  </DialogDescription>

                  <form onSubmit={handleSubmit} className="grid gap-4"
                        onChange={handleFormOnChange}>
                    <div className="grid gap-2">
                      <Label htmlFor="username" className={error ? "text-destructive" : ""}>Username</Label>
                      <Input
                        name="username"
                        id="username"
                        type="text"
                        required
                        defaultValue={formData.username}
                      />
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="link" className={error ? "text-destructive" : ""}>Link</Label>
                      <Input
                        name="link"
                        id="link"
                        type="text"
                        required
                        defaultValue={formData.link}
                      />
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="bio" className={error ? "text-destructive" : ""}>Bio</Label>
                      <textarea
                        name="bio"
                        id="bio"
                        defaultValue={formData.bio}
                      />
                    </div>

                    <div className="grid gap-1">
                      <Label htmlFor="nftIds" className={error ? "text-destructive" : ""}>NFTs list</Label>
                      {nftsData && <MultiSelect name={"nftIds"} onValueChange={(values) => {
                        setFormData(prevState => ({
                          ...prevState,
                          nftIds: values.map(item => Number(item))
                        }))
                      }}
                                                options={nftsData.map(item => ({
                                                  value: item.value.toString(),
                                                  label: item.label
                                                }))}
                                                defaultValue={formData.nftIds.map(item => item.toString())}
                                                placeholder="Select NFTs"/>}
                    </div>

                    <div className="grid gap-1">
                      <Label htmlFor="whitelistUserIds" className={error ? "text-destructive" : ""}>Whitelist
                        Users</Label>
                      {usersData && <MultiSelect name={"whitelistUserIds"} onValueChange={(values) => {
                        setFormData(prevState => ({
                          ...prevState,
                          whitelistUserIds: values.map(item => Number(item))
                        }))
                      }}
                                                 options={usersData.map(item => ({
                                                   value: item.value.toString(),
                                                   label: item.label
                                                 }))}
                                                 defaultValue={formData.whitelistUserIds.map(item => item.toString())}
                                                 placeholder="Users"/>}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="w-full">
                        <Label htmlFor="whitelistStart" className={error ? "text-destructive" : ""}>Whitelist
                          start date</Label>
                        <Input
                          defaultValue={formData.whitelistStart.toString()}
                          name="whitelist.start"
                          id="whitelistStart"
                          type="date"
                          required
                        />
                      </div>

                      <div className="w-full">
                        <Label htmlFor="whitelistEnd" className={error ? "text-destructive" : ""}>Whitelist
                          end date</Label>
                        <Input
                          defaultValue={formData.whitelistEnd.toString()}
                          name="whitelist.end"
                          id="whitelistEnd"
                          type="date"
                          required
                        />
                      </div>
                    </div>

                    <div className="flex justify-around">
                      <Button type="submit" className="w-1/2">
                        Validate
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </DialogPortal>
            </Dialog>

            {teabagsList && <InfiniteScroll

              dataLength={teabagsList.length}
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
              <TeaBagList data={teabagsList}/>
            </InfiniteScroll>}
          </div>
        </div>
      </div>
    </div>
  )
}
