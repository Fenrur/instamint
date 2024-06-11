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
import {useFetchUsers, useReportProfile} from "@/repository/hooks"
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
import {cn} from "@/lib/utils"
import {Textarea} from "@/components/ui/textarea"

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
  onUpdate?: any;
}

interface Report {
  reportedProfileId: number,
  reason: string
}

// A function to format the date to YYYY-MM-DD
const formatDate = (date?: Date | string) => {
  if (!date) {
    return null
  }

  const d = new Date(date)
  const month = `0${d.getMonth() + 1}`.slice(-2)
  const day = `0${d.getDate()}`.slice(-2)

  return `${d.getFullYear()}-${month}-${day}`
}


export default function TeaBagPage(props: SignupPageProps) {
  const error = parseError(props)
  const [errors, setErrors] = useState<any>({
    username: "",
    link: ""
  })
  const [formData, setFormData] = useState<TeaBag>({
    username: "",
    bio: "",
    link: "",
    nftIds: [],
    whitelistUserIds: [],
    avatarUrl: "",
    whitelistStart: DateTime.now(),
    whitelistEnd: DateTime.now(),
  })
  const [reportFormData, setReportFormData] = useState<Report>({
    reportedProfileId: 0,
    reason: ""
  })
  const [teabagsList, setTeabagsList] = useState<TeaBag[]>([])
  const {usersData} = useFetchUsers()
  const {reportProfile} = useReportProfile()
  const [isOpenCreate, setIsOpenCreate] = useState(false)
  const [isOpenReport, setIsOpenReport] = useState(false)
  const [isOpenDelete, setIsOpenDelete] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const [page, setPage] = useState(1)
  const [selectedId, setSelectedId] = useState<number>()
  const handleFormOnChange = (e: React.ChangeEvent<HTMLFormElement>) => {
    const {name, value} = e.target
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }))
  }
  const handleTeaBagCreateSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formDataWithImage = new FormData()

    if (selectedId) {
      formDataWithImage.append("profileId", selectedId.toString())
    }

    formDataWithImage.append("username", formData.username)
    formDataWithImage.append("bio", formData.bio as string)
    formDataWithImage.append("link", formData.link)
    formDataWithImage.append("avatar", profileImage as string)
    formDataWithImage.append("nftIds", JSON.stringify(formData.nftIds))
    formDataWithImage.append("whitelistUserIds", JSON.stringify(formData.whitelistUserIds))
    formDataWithImage.append("whitelistStart", formData.whitelistStart as unknown as string)
    formDataWithImage.append("whitelistEnd", formData.whitelistEnd as unknown as string)

    const response = await fetch(selectedId ? "/api/tea-bag/update" : "/api/tea-bag", {
      method: "POST",
      body: formDataWithImage
    })

    if (response.ok) {
      toast.success("Successfully created", {description: "Your Tea Bag has been created."})
      const res = await fetchTeaBags({page: 1})

      if (typeof res !== "string") {
        setErrors({
          username: "",
          link: ""
        })
        setTeabagsList([...res])
        setPage(1)
      } else {
        toast.error("Error", {description: res === "not_authenticated" ? "not authentificated" : "bad session"})
      }

      setIsOpenCreate(false)
    } else {
      const error = await response.json()
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      toast.error(error.title, {description: error.detail})
    }
  }
  const handleReportFormOnChange = (e: React.ChangeEvent<HTMLFormElement>) => {
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
      setSelectedId(undefined)
    } else {
      toast.error("Error", {description: "Failed to reported Tea Bag maybe due to already reported"})
    }
  }
  const loadNextPage = useCallback(async () => {
    const res = await fetchTeaBags({page})

    if (typeof res !== "string") {
      if (res.length < teaBagsPageSize) {
        setHasMore(false)
      }

      setTeabagsList([...teabagsList, ...res])
      setPage(page + 1)
    } else {
      toast.error("Error", {description: res === "not_authenticated" ? "not authentificated" : "bad session"})
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

  async function handleOnClickUpdate(id: number) {
    setSelectedId(id)

    const response = await fetch(`/api/tea-bag/get?id=${id}`)
    const data = await response.json()

    setFormData({
      username: data.username,
      bio: data.bio,
      link: data.link,
      nftIds: data.nftIds,
      avatarUrl: data.avatarUrl,
      whitelistUserIds: data.whitelistUserIds,
      whitelistStart: data.whitelistStart,
      whitelistEnd: data.whitelistEnd
    })

    setIsOpenCreate(true)
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
      setSelectedId(undefined)
      toast.success("Successfully deleted", {description: "The Tea Bag has been deleted."})
    } else {
      toast.error("Error", {description: "Failed to delete Tea Bag"})
    }
  }

  const [profileImage, setProfileImage] = useState<string | null>(null)
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0]

    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setProfileImage(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <div className="min-h-screen p-6 bg-gray-100 flex items-center justify-center">
      <div className="container max-w-screen-lg mx-auto">
        <div className="bg-white rounded shadow-lg p-4 px-4 md:p-8 mb-6">
          <div className="grid gap-4 gap-y-2 text-sm grid-cols-1">

            <Dialog open={isOpenCreate} onOpenChange={setIsOpenCreate}>
              <DialogTrigger asChild>
                <Button className="Button violet w-[200px]">Create tea-bag</Button>
              </DialogTrigger>

              <DialogPortal>
                <DialogOverlay className="DialogOverlay"/>
                <DialogContent className="DialogContent">
                  <DialogTitle className="DialogTitle text-center">TEA BAG</DialogTitle>
                  <DialogDescription className="DialogDescription  text-center">
                    Make changes to this profile here.
                  </DialogDescription>

                  <form onSubmit={handleTeaBagCreateSubmit} className="grid gap-4"
                        onChange={handleFormOnChange}>
                    <div className="flex justify-center items-center flex-col">
                      <div className="rounded-full overflow-hidden border-2 border-gray-300 w-36 h-36">
                        <img
                          alt="Profile Image"
                          src={profileImage ?? formData.avatarUrl}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        id="fileInput"
                        className="hidden"
                      />
                      <label htmlFor="fileInput" className="mt-4 text-blue-500 cursor-pointer underline">
                        Choose avatar
                      </label>
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="username" className={errors.username ? "text-destructive" : ""}>Username</Label>
                      <Input
                        name="username"
                        id="username"
                        type="text"
                        required
                        placeholder="username"
                        defaultValue={formData.username}
                      />
                      <div hidden={errors.username === ""}
                           className={cn("text-sm", errors.username ? "text-destructive" : "")}>{errors.username}</div>
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="link" className={errors.link ? "text-destructive" : ""}>Link</Label>
                      <Input
                        name="link"
                        id="link"
                        type="text"
                        required
                        placeholder="your unique link"
                        defaultValue={formData.link}
                      />
                      <div hidden={errors.link === ""}
                           className={cn("text-sm", errors.link ? "text-destructive" : "")}>{errors.link}</div>
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="bio" className={errors.bio ? "text-destructive" : ""}>Bio</Label>
                      <Textarea
                        placeholder="Tell us a little bit about yourself"
                        className="resize-none"
                        name="bio"
                        id="bio"
                      />
                    </div>

                    <div className="grid gap-1">
                      <Label htmlFor="whitelistUserIds"
                             className={error ? "text-destructive" : ""}>Whitelist
                        Users</Label>
                      {usersData &&
                        <MultiSelect style={{height: 100, overflowY: "scroll",}} name={"whitelistUserIds"}
                                     onValueChange={(values) => {
                                       setFormData(prevState => ({
                                         ...prevState,
                                         whitelistUserIds: values.map(item => Number(item))
                                       }))
                                     }}
                                     options={(typeof usersData !== "string") ? usersData.map(item => ({
                                       value: item.value.toString(),
                                       label: item.label
                                     })) : []}
                                     defaultValue={formData.whitelistUserIds?.filter(item => item).map(item => item.toString())}
                                     placeholder="Users"/>}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="w-full">
                        <Label htmlFor="whitelistStart"
                               className={error ? "text-destructive" : ""}>Whitelist
                          start date</Label>
                        <Input
                          defaultValue={formatDate(formData.whitelistStart as unknown as Date) as string}
                          name="whitelist.start"
                          id="whitelistStart"
                          type="date"
                          required
                        />
                      </div>

                      <div className="w-full">
                        <Label htmlFor="whitelistEnd"
                               className={error ? "text-destructive" : ""}>Whitelist
                          end date</Label>
                        <Input
                          defaultValue={formatDate(formData.whitelistEnd as unknown as Date) as string}
                          name="whitelist.end"
                          id="whitelistEnd"
                          type="date"
                          required
                        />
                      </div>
                    </div>

                    <div className="flex justify-around">
                      <Button
                        variant="default"
                        size="sm"
                        className="mt-2 w-1/2"
                        type="submit">
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
                      <Label htmlFor="link"
                             className={error ? "text-destructive" : ""}>Reason</Label>
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
                  <AlertDialogTitle className="AlertDialogTitle">Are you absolutely
                    sure?</AlertDialogTitle>
                  <AlertDialogDescription className="AlertDialogDescription">
                    This action cannot be undone. This will permanently delete the account and
                    remove
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
              <TeaBagList data={teabagsList}
                          onDelete={handleOnClickDelete}
                          onUpdate={handleOnClickUpdate}
                          onReport={handleOnClickReport}/>
            </InfiniteScroll>}
          </div>
        </div>
      </div>
    </div>
  )
}
