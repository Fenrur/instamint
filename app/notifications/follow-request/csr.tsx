"use client"

import {Button} from "@/components/ui/button"
import {Input} from "@/components/ui/input"
import {DateTime} from "luxon"
import {Separator} from "@/components/ui/separator"
import React, {useEffect, useMemo, useState} from "react"
import {PaginatedRequesterFollowProfileElement,} from "@/http/rest/types"
import {getPaginatedRequestersFollowProfile} from "@/repository"
import {useRouter} from "next/navigation"
import {createRedirectQueryParam} from "@/utils/url"
import {toast} from "sonner"
import InfiniteScroll from "react-infinite-scroll-component"
import {BackgroundLoadingDots} from "@/components/ui/loading-dots"
import {
  useAcceptAllIgnoredRequestFollowProfile,
  useAcceptAllRequestFollowProfile,
  useAcceptFollowProfile,
  useIgnoreAllRequestFollowProfile,
  useIgnoreFollowProfile,
  useSearchIgnoredRequesterProfile,
  useSearchRequesterProfile
} from "@/repository/hooks"
import Link from "next/link"
import {followRequestIgnoredPageSize, followRequestPageSize} from "@/services/constants"

type RequestType = "request" | "ignored"

interface RowProps {
  username: string,
  avatarUrl: string,
  requestFollowAt: DateTime<true>,
  type: RequestType,
  onAccept: () => void,
  onIgnore: () => void
}

function Row({username, avatarUrl, requestFollowAt, type, onAccept, onIgnore}: RowProps) {
  const {ignoreFollowProfile, isFetchingIgnore} = useIgnoreFollowProfile(username)
  const {acceptFollowProfile, isFetchingAccept} = useAcceptFollowProfile(username)
  const disabled = useMemo(
    () => isFetchingIgnore || isFetchingAccept,
    [isFetchingIgnore, isFetchingAccept]
  )
  const handleIgnore = async () => {
    await ignoreFollowProfile()
    onIgnore()
  }
  const handleAccept = async () => {
    await acceptFollowProfile()
    onAccept()
  }

  return (
    <div className="h-16 flex items-center justify-between gap-2 hover:bg-light-selection px-5 rounded-md">
      <Link href={`/profile/${username}`} className="h-full grid items-center">
        <div className="size-12">
          <img
            className="rounded-full border-2 flex-grow-0"
            crossOrigin="anonymous"
            draggable={false}
            src={avatarUrl}
            alt={`avatar profile's ${username}`}
          />
        </div>
      </Link>
      <Link href={`/profile/${username}`} className="flex-grow text-sm h-full grid items-center">
        <div className="max-w-60">
          <span className="font-semibold">{username} </span>
          <span className="font-normal text-gray-500">
            {requestFollowAt.toRelative({
              style: "short",
              locale: "en"
            })}
          </span>
        </div>
      </Link>
      <div className="flex gap-2">
        <Button disabled={disabled} onClick={handleAccept} className="h-8">Confirm</Button>
        {type === "request" &&
          <Button disabled={disabled} onClick={handleIgnore} className="h-8" variant="tertiary">Ignore</Button>}
      </div>
    </div>
  )
}

type Mode = "viewing" | "searching"

interface Data {
  requestAt: DateTime<true>,
  isIgnored: boolean,
  profile: {
    username: string,
    displayName: string,
    avatarUrl: string
  }
}

function equals(a: Data, b: Data) {
  return a.profile.username.toLowerCase() === b.profile.username.toLowerCase()
}

export function FollowRequestPageContent() {
  const [requesters, setRequesters] = useState<Data[]>([])
  const [ignoredRequesters, setIgnoredRequesters] = useState<Data[]>([])
  const [pageRequester, setPageRequester] = useState(1)
  const [pageIgnoredRequester, setPageIgnoredRequester] = useState(1)
  const [hasMoreRequester, setHasMoreRequester] = useState(true)
  const [hasMoreIgnoredRequester, setHasMoreIgnoredRequester] = useState(true)
  const [viewingRequesters, setViewingRequesters] = useState<Data[]>([])
  const [viewingIgnoredRequesters, setViewingIgnoredRequesters] = useState<Data[]>([])
  const [searchedRequesters, setSearchedRequesters] = useState<Data[]>([])
  const [searchedIgnoredRequesters, setSearchedIgnoredRequesters] = useState<Data[]>([])
  const [sectionRequestersMode, setSectionRequestersMode] = useState<Mode>("viewing")
  const [sectionIgnoredRequestersMode, setSectionIgnoredRequestersMode] = useState<Mode>("viewing")
  const [init, setInit] = useState(true)
  const router = useRouter()
  const {acceptAllRequestFollowProfile, isFetchingAcceptAll} = useAcceptAllRequestFollowProfile()
  const {acceptAllIgnoredRequestFollowProfile, isFetchingAcceptAllIgnored} = useAcceptAllIgnoredRequestFollowProfile()
  const {ignoreAllRequestFollowProfile, isFetchingIgnoreAll} = useIgnoreAllRequestFollowProfile()
  const {searchRequesterProfile, abortSearch} = useSearchRequesterProfile()
  const {searchIgnoredRequesterProfile, abortSearchIgnored} = useSearchIgnoredRequesterProfile()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const loadNextPageRequests = () => {
    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    setTimeout(async () => {
      const pagedRequesters = await getPaginatedRequestersFollowProfile(pageRequester, false)

      if (typeof pagedRequesters === "string") {
        setHasMoreRequester(false)

        switch (pagedRequesters) {
          case "not_authenticated":
            router.push(`/login${createRedirectQueryParam("/notifications/follow-request")}`)

            break

          case "bad_session":
            router.push(`/login${createRedirectQueryParam("/notifications/follow-request")}`)

            break

          case "invalid_query_parameter":
            toast.error("Invalid query parameter", {description: "Please try again later."})

            break
        }

        return
      }

      if (pagedRequesters.length < followRequestPageSize) {
        setHasMoreRequester(false)
      }

      setViewingRequesters([...viewingRequesters, ...pagedRequesters])
      setPageRequester(pageRequester + 1)
    })
  }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const loadNextPageIgnoredRequests = () => {
    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    setTimeout(async () => {
      const pagedRequesters = await getPaginatedRequestersFollowProfile(pageIgnoredRequester, true)

      if (typeof pagedRequesters === "string") {
        setHasMoreIgnoredRequester(false)

        switch (pagedRequesters) {
          case "not_authenticated":
            router.push(`/login${createRedirectQueryParam("/notifications/follow-request")}`)

            break

          case "bad_session":
            router.push(`/login${createRedirectQueryParam("/notifications/follow-request")}`)

            break

          case "invalid_query_parameter":
            toast.error("Invalid query parameter", {description: "Please try again later."})

            break
        }

        return
      }

      if (pagedRequesters.length < followRequestIgnoredPageSize) {
        setHasMoreIgnoredRequester(false)
      }

      setViewingIgnoredRequesters([...viewingIgnoredRequesters, ...pagedRequesters])
      setPageIgnoredRequester(pageIgnoredRequester + 1)
    })
  }
  const handleAccept = (requester: PaginatedRequesterFollowProfileElement, type: RequestType) => {
    if (type === "request") {
      setViewingRequesters(viewingRequesters.filter(r => !equals(r, requester)))
      setSearchedRequesters(searchedRequesters.filter(r => !equals(r, requester)))
    } else {
      setViewingIgnoredRequesters(viewingIgnoredRequesters.filter(r => !equals(r, requester)))
      setSearchedIgnoredRequesters(searchedIgnoredRequesters.filter(r => !equals(r, requester)))
    }
  }
  const handleIgnore = (requester: PaginatedRequesterFollowProfileElement) => {
    setViewingRequesters(viewingRequesters.filter(r => !equals(r, requester)))
    setSearchedRequesters(searchedRequesters.filter(r => !equals(r, requester)))
    setViewingIgnoredRequesters([...viewingIgnoredRequesters, {...requester, isIgnored: true}])
  }
  const handleAcceptAll = async (type: RequestType) => {
    if (type === "request") {
      await acceptAllRequestFollowProfile()
      setViewingRequesters([])
      setSearchedRequesters([])
    } else {
      await acceptAllIgnoredRequestFollowProfile()
      setViewingIgnoredRequesters([])
      setSearchedIgnoredRequesters([])
    }
  }
  const handleIgnoreAll = async () => {
    await ignoreAllRequestFollowProfile()
    const addedRequesters = viewingRequesters.map(r => ({...r, isIgnored: true}))

    setViewingIgnoredRequesters([...viewingIgnoredRequesters, ...addedRequesters])
    setViewingRequesters([])

    setSearchedRequesters([])
  }
  const handleSearchRequesterChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.trim()

    if (value.length > 0) {
      setSectionRequestersMode("searching")

      abortSearch()
      const response = await searchRequesterProfile(value)

      if (Array.isArray(response)) {
        setSearchedRequesters(response)
      } else {
        setSearchedRequesters([])
      }
    } else {
      setSectionRequestersMode("viewing")
    }
  }
  const handleSearchIgnoredRequesterChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.trim()

    if (value.length > 0) {
      setSectionIgnoredRequestersMode("searching")

      abortSearchIgnored()
      const response = await searchIgnoredRequesterProfile(value)

      if (Array.isArray(response)) {
        setSearchedIgnoredRequesters(response)
      } else {
        setSearchedIgnoredRequesters([])
      }
    } else {
      setSectionIgnoredRequestersMode("viewing")
    }
  }

  useEffect(() => {
    if (init) {
      setInit(false)
      loadNextPageRequests()
      loadNextPageIgnoredRequests()
    }
  }, [init, loadNextPageRequests, loadNextPageIgnoredRequests])

  useEffect(() => {
    if (sectionRequestersMode === "searching") {
      setRequesters(searchedRequesters)
    } else {
      setRequesters(viewingRequesters)
    }
  }, [sectionRequestersMode, setRequesters, searchedRequesters, viewingRequesters])

  useEffect(() => {
    if (sectionIgnoredRequestersMode === "searching") {
      setIgnoredRequesters(searchedIgnoredRequesters)
    } else {
      setIgnoredRequesters(viewingIgnoredRequesters)
    }
  }, [sectionIgnoredRequestersMode, setIgnoredRequesters, searchedIgnoredRequesters, viewingIgnoredRequesters])

  return (
    <section className="grid max-w-screen-sm w-full">
      <InfiniteScroll
        className="py-5"
        next={loadNextPageRequests}
        hasMore={sectionRequestersMode === "viewing" ? hasMoreRequester : false}
        loader={
          <div className="grid justify-center">
            <BackgroundLoadingDots size={50}/>
          </div>
        }
        dataLength={requesters.length}
      >
        <div className="flex justify-between items-center px-5">
          <h1 className="my-5 font-bold">Request follow</h1>
          <div className="flex gap-2">
            <Button
              disabled={isFetchingAcceptAll}
              onClick={() => handleAcceptAll("request")}
              variant="ghost"
            >
              Confirm all
            </Button>
            <Button
              disabled={isFetchingIgnoreAll}
              onClick={handleIgnoreAll}
              variant="ghost"
            >
              Ignore all
            </Button>
          </div>
        </div>

        <div className="px-5">
          <Input
            className="w-full mb-4"
            onChange={handleSearchRequesterChange}
            placeholder="Search profile"
          />
        </div>

        {
          requesters.map((requester, index) => (
            <Row
              key={index}
              onAccept={() => {
                handleAccept(requester, "request")
              }}
              onIgnore={() => {
                handleIgnore(requester)
              }}
              username={requester.profile.username}
              avatarUrl={requester.profile.avatarUrl}
              requestFollowAt={requester.requestAt}
              type="request"
            />
          ))
        }

      </InfiniteScroll>

      <Separator/>

      <InfiniteScroll
        className="mt-5"
        next={loadNextPageIgnoredRequests}
        hasMore={sectionIgnoredRequestersMode === "viewing" ? hasMoreIgnoredRequester : false}
        loader={
          <div className="grid justify-center">
            <BackgroundLoadingDots size={50}/>
          </div>
        }
        dataLength={ignoredRequesters.length}
      >
        <div className="flex justify-between items-center px-5">
          <h1 className="my-5 font-bold">Ignored request follow</h1>
          <Button
            disabled={isFetchingAcceptAllIgnored}
            onClick={() => handleAcceptAll("ignored")}
            variant="ghost"
          >
            Confirm all
          </Button>
        </div>

        <div className="px-5">
          <Input
            onChange={handleSearchIgnoredRequesterChange}
            placeholder="Search profile"
            className="w-full mb-4"
          />
        </div>

        {
          ignoredRequesters.map((ignoredRequester, index) => (
            <Row
              key={index}
              onAccept={() => {
                handleAccept(ignoredRequester, "ignored")
              }}
              onIgnore={() => {
              }}
              username={ignoredRequester.profile.username}
              avatarUrl={ignoredRequester.profile.avatarUrl}
              requestFollowAt={ignoredRequester.requestAt}
              type="ignored"
            />
          ))
        }

      </InfiniteScroll>
    </section>
  )
}
