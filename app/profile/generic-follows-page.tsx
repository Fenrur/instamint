"use client"

import {Input} from "@/components/ui/input"
import React, {useEffect, useMemo, useState} from "react"
import {Button} from "@/components/ui/button"
import {BackgroundLoadingDots, DefaultLoadingDots} from "@/components/ui/loading-dots"
import InfiniteScroll from "react-infinite-scroll-component"
import {getPaginatedFollowers, getPaginatedFollows} from "@/repository"
import {toast} from "sonner"
import {useRouter} from "next/navigation"
import {createRedirectQueryParam} from "@/utils/url"
import {DateTime} from "luxon"
import {
  useDeleteFollowerProfile,
  useFollowProfile,
  useSearchFollowersProfile,
  useSearchFollowsProfile,
  useUnfollowProfile
} from "@/repository/hooks"
import Link from "next/link"
import {followersPageSize, followsPageSize} from "@/services/constants"
import {router} from "next/client"

interface Type {
  section: "followers" | "follows",
  onProfile: "me" | "other"
}

type Mode = "searching" | "viewing"

interface Data {
  followAt: DateTime<true>,
  profile: {
    username: string,
    displayName: string,
    avatarUrl: string,
  },
  followStateTo: "following" | "requesting_follow" | "not_following",
  followStateFrom: "following" | "ignored_request_follow" | "requesting_follow" | "not_following",
}

interface RowProps {
  username: string,
  displayName: string,
  avatarUrl: string,
  initialFollowStateTo: "following" | "requesting_follow" | "not_following",
  onDelete: () => void,
  type: Type,
}

function Row({username, displayName, avatarUrl, initialFollowStateTo, onDelete, type}: RowProps) {
  const [followStateTo, setFollowStateTo] = useState(initialFollowStateTo)
  const {followProfile, isFetchingFollow} = useFollowProfile(username)
  const {unfollowProfile, isFetchingUnfollow} = useUnfollowProfile(username)
  const {deleteFollowerProfile, isFetchingDelete} = useDeleteFollowerProfile(username)
  const handleButtonClick = async () => {
    if (type.onProfile === "me" && type.section === "followers") {
      const result = await deleteFollowerProfile()

      switch (result) {
        case "not_authenticated":
          await router.push(`/login${createRedirectQueryParam(`/profile/${username}`)}`)

          break

        case "bad_session":
          await router.push(`/login${createRedirectQueryParam(`/profile/${username}`)}`)

          break

        case "deleted":
          onDelete()

          break
      }

return
    }

    if (followStateTo === "following" || followStateTo === "requesting_follow") {
      const result = await unfollowProfile()

      switch (result) {
        case "not_authenticated":
          await router.push(`/login${createRedirectQueryParam(`/profile/${username}`)}`)

          break

        case "bad_session":
          await router.push(`/login${createRedirectQueryParam(`/profile/${username}`)}`)

          break

        case "unfollowed":
          setFollowStateTo("not_following")

          break

        case "unrequested_follow":
          setFollowStateTo("not_following")

          break
      }
    } else {
      const result = await followProfile()

      switch (result) {
        case "not_authenticated":
          await router.push(`/login${createRedirectQueryParam(`/profile/${username}`)}`)

          break

        case "bad_session":
          await router.push(`/login${createRedirectQueryParam(`/profile/${username}`)}`)

          break

        case "followed":
          setFollowStateTo("following")

          break

        case "requesting_follow":
          setFollowStateTo("requesting_follow")

          break
      }
    }
  }
  const textFollowUnfollowButton = useMemo(() => {
    if (type.onProfile === "me" && type.section === "followers") {
      return "Delete"
    }

    switch (followStateTo) {
      case "following":
        return "Following"

      case "requesting_follow":
        return "Pending"

      case "not_following":
        return "Follow"
    }
  }, [followStateTo, type])
  const variantFollowUnfollowButton = useMemo(() => {
    if (type.onProfile === "me" && type.section === "followers") {
      return "tertiary"
    }

    switch (followStateTo) {
      case "following":
        return "tertiary"

      case "requesting_follow":
        return "tertiary"

      case "not_following":
        return "default"
    }
  }, [followStateTo, type])

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
        <div className="max-w-60 grid items-center">
          <div className="font-semibold">{username}</div>
          <div className="text-gray-500">{displayName}</div>
        </div>
      </Link>
      <div className="flex gap-2">
        <Button disabled={isFetchingFollow || isFetchingUnfollow || isFetchingDelete} onClick={handleButtonClick}
                variant={variantFollowUnfollowButton} className="h-8">
          {textFollowUnfollowButton}
          {
            isFetchingFollow || isFetchingUnfollow || isFetchingDelete
              ? <DefaultLoadingDots size={12}/>
              : null
          }
        </Button>
      </div>
    </div>
  )
}

interface GenericFollowsProfilePageProps {
  type: Type,
  username: string,
}

function equals(a: Data, b: Data) {
  return a.profile.username.toLowerCase() === b.profile.username.toLowerCase()
}

export function GenericFollowsProfilePage({type, username}: GenericFollowsProfilePageProps) {
  const [hasMore, setHasMore] = useState(true)
  const [follows, setFollows] = useState<Data[]>([])
  const [searchedFollows, setSearchedFollows] = useState<Data[]>([])
  const [viewedFollows, setViewedFollows] = useState<Data[]>([])
  const [mode, setMode] = useState<Mode>("viewing")
  const [init, setInit] = useState(true)
  const [page, setPage] = useState(1)
  const router = useRouter()
  const {searchFollowersProfile, abortSearch: abortSearchFollowersProfile} = useSearchFollowersProfile(username)
  const {searchFollowsProfile, abortSearch: abordSearchFollowsProfile} = useSearchFollowsProfile(username)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const loadNextPage = () => {
    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    setTimeout(async () => {
      if (type.section === "followers") {
        const paginatedFollowers = await getPaginatedFollowers(username, page)

        if (typeof paginatedFollowers === "string") {
          setHasMore(false)

          switch (paginatedFollowers) {
            case "invalid_query_parameter":
              toast.error("Invalid query parameter", {description: "Please try again with a valid query parameter."})

              break

            case "profile_not_found":
              toast.error("Profile not found", {description: "Please try again with a valid profile."})

              break

            case "not_authenticated":
              router.push(`/login${createRedirectQueryParam(`/profile/${username}/followers`)}`)

              break

            case "bad_session":
              router.push(`/login${createRedirectQueryParam(`/profile/${username}/followers`)}`)

              break

            case "dont_follow_profile":
              router.push(`/profile/${username}`)

              break
          }

          return
        }

        if (paginatedFollowers.length < followersPageSize) {
          setHasMore(false)
        }

        setViewedFollows([...viewedFollows, ...paginatedFollowers])
        setPage(page + 1)
      } else {
        const paginatedFollows = await getPaginatedFollows(username, page)

        if (typeof paginatedFollows === "string") {
          setHasMore(false)

          switch (paginatedFollows) {
            case "invalid_query_parameter":
              toast.error("Invalid query parameter", {description: "Please try again with a valid query parameter."})

              break

            case "profile_not_found":
              toast.error("Profile not found", {description: "Please try again with a valid profile."})

              break

            case "not_authenticated":
              router.push(`/login${createRedirectQueryParam(`/profile/${username}/follows`)}`)

              break

            case "bad_session":
              router.push(`/login${createRedirectQueryParam(`/profile/${username}/follows`)}`)

              break

            case "dont_follow_profile":
              router.push(`/profile/${username}`)

              break
          }

          return
        }

        if (paginatedFollows.length < followsPageSize) {
          setHasMore(false)
        }

        setViewedFollows([...viewedFollows, ...paginatedFollows])
        setPage(page + 1)
      }
    })
  }
  const handleSearchFollowerChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.trim()

    if (value.length > 0) {
      setMode("searching")

      if (type.section === "followers") {
        abortSearchFollowersProfile()
        const response = await searchFollowersProfile(value)

        if (Array.isArray(response)) {
          setSearchedFollows(response)
        } else {
          setSearchedFollows([])
        }
      } else {
        abordSearchFollowsProfile()
        const response = await searchFollowsProfile(value)

        if (Array.isArray(response)) {
          setSearchedFollows(response)
        } else {
          setSearchedFollows([])
        }
      }
    } else {
      setMode("viewing")
    }
  }

  useEffect(() => {
    if (init) {
      setInit(false)
      loadNextPage()
    }
  }, [init, loadNextPage])

  useEffect(() => {
    if (mode === "searching") {
      setFollows(searchedFollows)
    } else {
      setFollows(viewedFollows)
    }
  }, [mode, setFollows, searchedFollows, viewedFollows])

  return (
    <main>
      <InfiniteScroll
        next={loadNextPage}
        hasMore={hasMore}
        loader={
          <div className="grid justify-center">
            <BackgroundLoadingDots size={50}/>
          </div>
        }
        dataLength={follows.length}
      >
        <div className="flex justify-center pt-4">
          <div className="grid max-w-screen-sm w-full">
            <div className="px-5">
              <Input
                className="w-full mb-4"
                onChange={handleSearchFollowerChange}
                placeholder="Search profile"
              />
            </div>

            {
              follows.map((follow, index) => (
                <Row
                  key={index}
                  username={follow.profile.username}
                  displayName={follow.profile.displayName}
                  avatarUrl={follow.profile.avatarUrl}
                  initialFollowStateTo={follow.followStateTo}
                  onDelete={() => {
                    setViewedFollows(viewedFollows.filter(data => !equals(data, follow)))
                    setSearchedFollows(searchedFollows.filter(data => !equals(data, follow)))
                  }}
                  type={type}
                />
              ))
            }

          </div>
        </div>
      </InfiniteScroll>
    </main>
  )
}
