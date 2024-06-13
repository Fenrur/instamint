import {followService, profileService} from "@/services"
import {redirect} from "next/navigation"
import {getServerSession} from "@/auth"
import {Separator} from "@/components/ui/separator"
import {cn} from "@/lib/utils"
import {DateTime} from "luxon"
import React from "react"
import {Button} from "@/components/ui/button"
import {LoggedLayout} from "@/components/layout/logged-layout"
import Link from "next/link"
import {ChevronRight} from "lucide-react"
import {Badge} from "@/components/ui/badge"

export const dynamic = "force-dynamic"

type TimelineGroupType = "last-hour" | "today" | "yesterday" | "last-week" | "last-month"

function prettyTimelineGroup(type: TimelineGroupType) {
  switch (type) {
    case "last-hour":
      return "News"

    case "today":
      return "Today"

    case "yesterday":
      return "Yesterday"

    case "last-week":
      return "Last week"

    case "last-month":
      return "Last month"
  }
}

function NotificationRequestFollowAndIgnoreSection({waitingRequestFollow}: { waitingRequestFollow: number }) {
  return (
    <Link href="/notifications/follow-request">
      <section className="h-16 mb-2 flex items-center justify-between gap-2 hover:bg-light-selection px-5 rounded-md">
        <div className="font-semibold">
          Request follow & Ignored request follow
        </div>
        <div className="flex gap-1">
          <Badge>{waitingRequestFollow}+</Badge>
          <ChevronRight strokeWidth={1} className="text-neutral-400"/>
        </div>
      </section>
    </Link>
  )
}

interface NotificationRequestFollowRowProps {
  username: string,
  requestFollowAt: DateTime<true>,
  avatarUrl: string
}

function NotificationRequestFollowRow({username, requestFollowAt, avatarUrl}: NotificationRequestFollowRowProps) {
  return (
    <div className="min-h-16 max-h-28 py-2 sm:py-0 flex items-center gap-2 hover:bg-light-selection px-5 rounded-md">
      <div className="h-full grid items-center">
        <div className="size-12">
          <img
            className="rounded-full border-2 flex-grow-0"
            crossOrigin="anonymous"
            draggable={false}
            src={avatarUrl}
            alt={`avatar profile's ${username}`}
          />
        </div>
      </div>
      <div className="flex-grow text-sm">
        <div className="max-w-60">
          <span className="font-semibold">{username}</span>
          <span className="font-normal"> has requested to follow your account. </span>
          <span className="font-normal text-gray-500">
            {requestFollowAt.toRelative({style: "short", locale: "en"})}
          </span>
        </div>
      </div>
      <Button className="h-8">Confirm</Button>
      <Button className="h-8" variant="tertiary">Ignore</Button>
    </div>
  )
}

type NotificationRowProps = { type: "request_follow", childProps: NotificationRequestFollowRowProps }

function NotificationRow(props: NotificationRowProps) {
  switch (props.type) {
    case "request_follow":
      return <NotificationRequestFollowRow {...props.childProps}/>
  }
}

interface NotificationTimelineGroupContentProps {
  className?: string,
  rowProps: NotificationRowProps[]
}

function NotificationTimelineGroupContent({className, rowProps}: NotificationTimelineGroupContentProps) {
  return (
    <div className={cn("w-full grid", className)}>
      {
        rowProps.map((props, index) =>
          <NotificationRow
            key={index}
            type={props.type}
            childProps={props.childProps}
          />
        )
      }
    </div>
  )
}

interface NotificationTimelineGroupSectionProps {
  type: TimelineGroupType,
  rowProps: NotificationRowProps[]
}

function NotificationTimelineGroupSection({type, rowProps}: NotificationTimelineGroupSectionProps) {
  return (
    <section className="py-5 font-bold">
      <h1 className="ml-5">{prettyTimelineGroup(type)}</h1>
      <NotificationTimelineGroupContent
        className="mt-2"
        rowProps={rowProps}
      />
    </section>
  )
}

export default async function NotificationsPage() {
  const session = await getServerSession()

  if (!session) {
    redirect(`/login?redirect=${encodeURIComponent("/notifications")}`)
  }

  const userAndProfile = await profileService.findByUserUid(session.uid)

  if (!userAndProfile) {
    redirect(`/login?redirect=${encodeURIComponent("/notifications")}`)
  }

  let countRequestFollow = await followService.countRequestFollow(userAndProfile.profile.id)

  countRequestFollow ||= 0

  return (
    <LoggedLayout
      headerText="Notifications"
      selectedNavigation="notifications"
      username={userAndProfile.profile.username}
      avatarUrl={userAndProfile.profile.avatarUrl}
      navigationHeader={true}
    >
      <main>
        <div className="flex justify-center pt-2">
          <div className="grid max-w-screen-sm w-full">
            <NotificationRequestFollowAndIgnoreSection waitingRequestFollow={countRequestFollow}/>
            <Separator/>
            <NotificationTimelineGroupSection
              type="last-hour"
              rowProps={[
                {
                  type: "request_follow",
                  childProps: {
                    username: "mickael_github",
                    requestFollowAt: DateTime.utc().minus({minute: 12}),
                    avatarUrl: "https://avatars.githubusercontent.com/u/1"
                  }
                },
                {
                  type: "request_follow",
                  childProps: {
                    username: "fenrur",
                    requestFollowAt: DateTime.utc().minus({minute: 40}),
                    avatarUrl: "https://avatars.githubusercontent.com/u/26191768"
                  }
                }
              ]}
            />
            <Separator/>
            <NotificationTimelineGroupSection
              type="today"
              rowProps={[]}
            />
            <Separator/>
            <NotificationTimelineGroupSection
              type="yesterday"
              rowProps={[]}
            />
            <Separator/>
            <NotificationTimelineGroupSection
              type="last-week"
              rowProps={[]}
            />
            <Separator/>
            <NotificationTimelineGroupSection
              type="last-month"
              rowProps={[]}
            />
          </div>
        </div>
      </main>
    </LoggedLayout>
  )
}
