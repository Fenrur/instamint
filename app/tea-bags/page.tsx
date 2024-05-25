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
import {useFetchNFTs, useFetchUsers, useReportProfile} from "@/repository/hooks"
import React, {useCallback, useEffect, useState} from "react"
import {TeaBagList} from "@/components/Profile/ProfileList"
import InfiniteScroll from "react-infinite-scroll-component"
import {BackgroundLoadingDots} from "@/components/ui/loading-dots"
import {fetchTeaBags} from "@/repository"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogOverlay,
  AlertDialogPortal,
  AlertDialogTitle
} from "@/components/ui/alert-dialog"
import MultiSelect from "@/components/ui/multi-select"
import {teaBagsPageSize} from "@/services/constants"

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

  onDelete?: any;
  onReport?: any;
}

interface Report {
  reportedProfileId: number,
  reason: string
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
  const [reportFormData, setReportFormData] = useState<Report>({
    reportedProfileId: 0,
    reason: ""
  })
  const [teabagsList, setTeabagsList] = useState<TeaBag[]>([])
  const {usersData, usersDataMutate} = useFetchUsers()
  const {nftsData, nftsDataMutate} = useFetchNFTs()
  const {isFetchingReport, reportProfile, errorReport, dataReport} = useReportProfile()
  const [isOpenCreate, setIsOpenCreate] = useState(false)
  const [isOpenReport, setIsOpenReport] = useState(false)
  const [isOpenDelete, setIsOpenDelete] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const [page, setPage] = useState(1)
  const [selectedId, setSelectedId] = useState<number>()
  const handleFormOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {name, value} = e.target
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }))
  }
  const handleTeaBagCreateSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
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
      const res = await fetchTeaBags({page: 1})

      if (res) {
        setTeabagsList([...res])
        setPage(1)
      }

      setIsOpenCreate(false)
    } else {
      toast.error("Error", {description: "Failed to create Tea Bag"})
    }
  }
  const handleReportFormOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {name, value} = e.target
    setReportFormData(prevState => ({
      ...prevState,
      [name]: value
    }))
  }
  const handleReportFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const res = await reportProfile({reportedProfileId: selectedId as number, reason: reportFormData.reason})

    if (res) {
      toast.success("Successfully reported", {description: "The Tea Bag has been deleted."})
      setIsOpenReport(false)
    } else {
      toast.error("Error", {description: "Failed to reported Tea Bag maybe due to already reported"})
    }
  }
  const loadNextPage = useCallback(async () => {
    const res = await fetchTeaBags({page})
    if (res) {
      if (res.length < teaBagsPageSize) {
        setHasMore(false)
      }

      setTeabagsList([...teabagsList, ...res])
      setPage(page + 1)
    }
  }, [page, teabagsList])
  const [init, setInit] = useState(true)

  useEffect(() => {
    if (init) {
      setInit(false)
      void loadNextPage()
    }
  }, [init, loadNextPage])

  async function handleOnClickDelete(id: number) {
    setSelectedId(id)
    setIsOpenDelete(true)
  }

  async function handleOnClickReport(id: number) {
    setSelectedId(id)
    setIsOpenReport(true)
  }

  async function handleOnClickDeleteConfirmation() {
    const response = await fetch(`/api/tea-bag/delete`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({profileId: selectedId as number})
    })

    if (response.ok) {
      setPage(1)
      setTeabagsList(prev => prev.filter(item => item.id !== selectedId))
      setIsOpenDelete(false)
      toast.success("Successfully deleted", {description: "The Tea Bag has been deleted."})
    } else {
      toast.error("Error", {description: "Failed to delete Tea Bag"})
    }
  }

  return (
    <div className="min-h-screen p-6 bg-gray-100 flex items-center justify-center">
      <div className="container max-w-screen-lg mx-auto">
        <div className="bg-white rounded shadow-lg p-4 px-4 md:p-8 mb-6">
          <div className="grid gap-4 gap-y-2 text-sm grid-cols-1 lg:grid-cols-3">

            <Dialog open={isOpenCreate} onOpenChange={setIsOpenCreate}>
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

                  <form onSubmit={handleTeaBagCreateSubmit} className="grid gap-4"
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

            <Dialog open={isOpenReport} onOpenChange={setIsOpenReport}>
              <DialogPortal>
                <DialogOverlay className="DialogOverlay"/>
                <DialogContent className="DialogContent">
                  <DialogTitle className="DialogTitle">Reporting</DialogTitle>
                  <DialogDescription className="DialogDescription">
                    please specify your reason why you want to report this profile
                  </DialogDescription>

                  <form className="grid gap-4" id="reportForm"
                        onSubmit={handleReportFormSubmit}
                        onChange={handleReportFormOnChange}>
                    <Input
                      name="reportedProfileId"
                      id="reportedProfileId"
                      type="hidden"
                      required
                      value={selectedId}
                    />

                    <div className="grid gap-2">
                      <Label htmlFor="link" className={error ? "text-destructive" : ""}>Reason</Label>
                      <Input
                        name="reason"
                        id="reason"
                        type="text"
                        required
                        defaultValue={reportFormData.reason}
                      />
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

            <AlertDialog open={isOpenDelete} onOpenChange={setIsOpenDelete}>
              <AlertDialogPortal>
                <AlertDialogOverlay className="AlertDialogOverlay"/>
                <AlertDialogContent className="AlertDialogContent">
                  <AlertDialogTitle className="AlertDialogTitle">Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription className="AlertDialogDescription">
                    This action cannot be undone. This will permanently delete the account and remove
                    data from servers.
                  </AlertDialogDescription>
                  <div style={{display: "flex", gap: 25, justifyContent: "flex-end"}}>
                    <AlertDialogCancel asChild>
                      <button className="Button mauve">Cancel</button>
                    </AlertDialogCancel>
                    <AlertDialogAction asChild>
                      <button className="button  bg-red-600 hover:bg-red-700"
                              onClick={handleOnClickDeleteConfirmation}>Yes, delete account
                      </button>
                    </AlertDialogAction>
                  </div>
                </AlertDialogContent>
              </AlertDialogPortal>
            </AlertDialog>

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
              <TeaBagList data={teabagsList} onDelete={handleOnClickDelete} onReport={handleOnClickReport}/>
            </InfiniteScroll>}
          </div>
        </div>
      </div>
    </div>
  )
}
