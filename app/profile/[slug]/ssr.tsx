import {AudioLinesIcon, ImageIcon, MapPin, SquarePlayIcon} from "lucide-react"
import {
  CommentFilledIcon,
  CooksIcon,
  EditIcon,
  MintFilledIcon,
  MintIcon,
  ReportIcon,
  TrashIcon
} from "@/components/ui/icons"
import React from "react"
import {NftType} from "@/domain/types"
import {Button} from "@/components/ui/button"
import {DotsHorizontalIcon} from "@radix-ui/react-icons"
import {cn} from "@/lib/utils"
import {Pacifico} from "next/font/google"
import Link from "next/link"
import {createRedirectQueryParam} from "@/utils/url"
import {Separator} from "@/components/ui/separator"
import {FollowUnfollowTextButton, ProfileStatisticsSectionSubAccess, ViewerUserType} from "../types"
import {TeaBag} from "../../tea-bags/page"

export const dynamic = "force-dynamic"

const pacifico = Pacifico({
  weight: "400",
  subsets: ["latin"]
})

export interface NftContainerProps {
  url: string,
  type: NftType,
  mints: string,
  comments: string
}

export interface ProfileContainerProps {
  link: string,
  avatarUrl: string,
  username: string,
}

export function NftContainer({url, type, mints, comments}: NftContainerProps) {
  return (
    <div className="relative pb-full cursor-pointer transition-opacity duration-200">

      {
        type === "video" && <video
          className="absolute h-full w-full object-cover"
          src={url}
          autoPlay
          muted
          loop
        />
      }

      {
        type === "audio" && <audio
          className="absolute h-full w-full object-cover"
          src={url}
          autoPlay
          controls
        />
      }

      {
        type === "image" && <img
          className="absolute h-full w-full object-cover"
          src={url}
          alt=""
        />
      }

      <div className="absolute top-0 right-0 p-2">

        {type === "image" && <ImageIcon className="h-6 w-6 text-white"/>}
        {type === "video" && <SquarePlayIcon className="h-6 w-6 text-white"/>}
        {type === "audio" && <AudioLinesIcon className="h-6 w-6 text-white"/>}

      </div>
      <div
        className="absolute inset-0 bg-black opacity-0 hover:opacity-50 transition-opacity duration-200 text-white flex gap-2 justify-center items-center">
        <div>
          <MintFilledIcon className="size-6 fill-white"/>
          <CommentFilledIcon className="size-6 mt-2" color="#FFFFFF"/>
        </div>
        <div>
          <div className="font-extrabold">{mints}</div>
          <div className="font-extrabold mt-2">{comments}</div>
        </div>
      </div>
    </div>
  )
}

export function ProfileContainer({link, avatarUrl, username}: ProfileContainerProps) {
  return (
    <a href={link} className="relative pb-1 cursor-pointer">
      <div className="rounded overflow-hidden">
        <img className="w-full" src={avatarUrl} alt="avatar image"/>
        <div className="px-6">
          <div className="font-bold text-sm">{username}</div>
        </div>
      </div>
    </a>
  )
}

export function TeaBagContainer({
                                  id,
                                  link,
                                  avatarUrl,
                                  username,
                                  followers_count,
                                  followed_count,
                                  cooks_count,
                                  onReport,
                                  onDelete,
                                  onUpdate
                                }: TeaBag) {
  return (
    <div className="relative pb-1 cursor-pointer h-200 w-[220px]">

      <div className="rounded overflow-hidden">
        <a href={link}>
          <img className="w-full"
               style={{height: 220, width: 220}}
               src={avatarUrl} alt="avatar image"/>


          <div
            className="absolute inset-0 h-5/6 bg-black
            opacity-0 hover:opacity-50 transition-opacity
             duration-200 text-white flex gap-2
             justify-center items-center">
            <div>
              <MintFilledIcon className="size-6 fill-white"/>
              <MintIcon className="size-6 mt-2 fill-white"/>
              <CooksIcon className="size-6 mt-2"/>
            </div>
            <div>
              {/* eslint-disable-next-line camelcase */}
              <div className="font-extrabold">{followers_count}</div>
              {/* eslint-disable-next-line camelcase */}
              <div className="font-extrabold mt-2">{followed_count}</div>
              {/* eslint-disable-next-line camelcase */}
              <div className="font-extrabold mt-2">{cooks_count}</div>
            </div>
          </div>
          <div className="px-6 text-center">
            <div className="font-bold text-sm">{username}</div>
          </div>
        </a>
      </div>
      <div
        className="bg-blue-600 text-white w-[220px] flex flex-row justify-around items-center h-10 px-5">
        <div onClick={() => {
          onUpdate(id as number)
        }}>
          <EditIcon className="size-6" color={"green"}/>
        </div>

        <div onClick={() => {
          onReport(id as number)
        }}>
          <ReportIcon className="size-6" color="red"/>
        </div>

        <div onClick={() => {
          onDelete(id as number)
        }}>
          <TrashIcon className="size-6" color="red"/>
        </div>
      </div>
    </div>
  )
}

interface ConnectionHeaderProps {
  className?: string,
  username: string
}

export function ConnectionHeader({className, username}: ConnectionHeaderProps) {
  return (
    <header className={cn("flex items-center justify-between h-14 px-5", className)}>
      <Link className={cn("font-black text-3xl", pacifico.className)} href="/">Instamint</Link>
      <div className="flex gap-1">
        <Link href={`/login${createRedirectQueryParam(`/profile/${username}`)}`}>
          <Button className="h-8 w-28">Login</Button>
        </Link>
        <Link href="/signup">
          <Button className="h-8 w-20" variant="outline">Signup</Button>
        </Link>

      </div>
    </header>
  )
}

function SmallScreenProfileSection({
                                     className,
                                     username,
                                     displayName,
                                     link,
                                     location,
                                     bio,
                                     avatarUrl,
                                     viewerUserType,
                                     followUnfollowTextButton
                                   }: ProfileSectionProps) {
  const firstButton = () => {
    switch (viewerUserType) {
      case "logged":
        return (
          <LoggedFollowUnfollowButton username={username} followUnfollowTextButton={followUnfollowTextButton}/>
        )

      case "visitor":
        return (
          <VisitorFollowButton username={username}/>
        )

      case "my_profile":
        return (
          <ModifyMyProfileButton/>
        )
    }
  }
  const secondButton = () => {
    if (viewerUserType === "my_profile") {
      return (
        <ShareMyProfileButton/>
      )
    }

    return (
      <Button variant="tertiary" className="h-8 min-w-32 font-semibold">Contact</Button>
    )
  }

  return (
    <section className={cn("flex flex-col m-4 gap-4", className)}>
      <div className="flex">
        <div className="size-20">
          <img
            className="rounded-full border-2 flex-grow-0"
            crossOrigin="anonymous"
            draggable={false}
            src={avatarUrl}
            alt={`avatar profile's ${displayName}`}
          />
        </div>
        <div className="flex flex-col justify-between mt-2 ml-8">
          <div className="flex items-center">
            <h2 className="text-lg font-medium">{username}</h2>
            <Link className="ml-4 mt-1" href="/">
              <DotsHorizontalIcon className="size-5"/>
            </Link>
          </div>
          <div className="flex gap-2">
            {
              firstButton()
            }
            {
              secondButton()
            }
          </div>
        </div>
      </div>
      <div>
        <div className="font-semibold text-sm">{displayName}</div>

        {
          location &&
          <div className="flex items-center gap-2 pt-1">
            <MapPin strokeWidth={1.5}/>
            <h3 className="text-sm">{location}</h3>
          </div>
        }

        {
          link &&
          <Button className="p-0 h-min" variant="link">{link}</Button>
        }

        <h1 className="mt-2 text-sm">
          {bio}
        </h1>
      </div>
    </section>
  )
}

function MediumScreenProfileSection({
                                      className,
                                      username,
                                      displayName,
                                      link,
                                      location,
                                      bio,
                                      avatarUrl,
                                      viewerUserType,
                                      followUnfollowTextButton
                                    }: ProfileSectionProps) {
  const firstButton = () => {
    switch (viewerUserType) {
      case "logged":
        return (
          <LoggedFollowUnfollowButton className="ml-14" username={username}
                                      followUnfollowTextButton={followUnfollowTextButton}/>
        )

      case "visitor":
        return (
          <VisitorFollowButton className="ml-14" username={username}/>
        )

      case "my_profile":
        return (
          <ModifyMyProfileButton className="ml-14"/>
        )
    }
  }
  const secondButton = () => {
    if (viewerUserType === "my_profile") {
      return (
        <ShareMyProfileButton className="ml-2"/>
      )
    }

    return (
      <Button variant="tertiary" className="h-8 min-w-32 ml-2 font-semibold" asChild>
        <Link href={`/login${createRedirectQueryParam(`/profile/${username}`)}`}>
          Contact
        </Link>
      </Button>
    )
  }

  return (
    <div className={className}>
      <section className="flex gap-24 my-9 ml-16">
        <div className="h-full">
          <div className="size-40">
            <img
              className="rounded-full border-2 flex-grow-0"
              crossOrigin="anonymous"
              draggable={false}
              src={avatarUrl}
              alt={`profile avatar of ${displayName}`}
            />
          </div>
        </div>
        <div>
          <div className="flex items-center">
            <h2 className="text-lg font-medium w-mi">{username}</h2>
            {
              firstButton()
            }
            {
              secondButton()
            }
            <Link className="mt-1 ml-2.5" href="/">
              <DotsHorizontalIcon className="size-5"/>
            </Link>
          </div>
          <div className="font-semibold text-sm mt-4">{displayName}</div>

          {
            location &&
            <div className="flex items-center gap-2 pt-1">
              <MapPin strokeWidth={1.5}/>
              <h3 className="text-sm">{location}</h3>
            </div>
          }

          {
            link &&
            <Button className="p-0 h-min" variant="link">{link}</Button>
          }

          <h1 className="mt-2 text-sm">
            {bio}
          </h1>
        </div>
      </section>
    </div>
  )
}

interface ProfileSectionProps {
  className?: string,
  username: string
  displayName: string,
  link: string | null,
  location: string | null,
  bio: string,
  avatarUrl: string,
  viewerUserType: ViewerUserType,
  followUnfollowTextButton?: FollowUnfollowTextButton,
}

export function ProfileHeaderSection({
                                       className,
                                       username,
                                       displayName,
                                       link,
                                       location,
                                       bio,
                                       avatarUrl,
                                       viewerUserType,
                                       followUnfollowTextButton
                                     }: ProfileSectionProps) {
  return (
    <>
      <SmallScreenProfileSection
        className={cn("md:hidden", className)}
        username={username}
        displayName={displayName}
        link={link}
        location={location}
        bio={bio}
        avatarUrl={avatarUrl}
        viewerUserType={viewerUserType}
        followUnfollowTextButton={followUnfollowTextButton}
      />
      <MediumScreenProfileSection
        className={cn("hidden md:block", className)}
        username={username}
        displayName={displayName}
        link={link}
        location={location}
        bio={bio}
        avatarUrl={avatarUrl}
        viewerUserType={viewerUserType}
        followUnfollowTextButton={followUnfollowTextButton}
      />
    </>
  )
}

interface ProfileStatisticsSectionProps {
  className?: string,
  nfts: number,
  followers: number,
  follows: number,
  username: string,
  subAccess: ProfileStatisticsSectionSubAccess
}

export function ProfileStatisticsSection({
                                           className,
                                           nfts,
                                           followers,
                                           follows,
                                           username,
                                           subAccess
                                         }: ProfileStatisticsSectionProps) {
  interface SubAccessLink {
    visitorLink?: string,
    loggedAccessLink?: string
  }

  const SubComponent = ({aboveText, subText, subAccessLink}: {
    aboveText: string,
    subText: string,
    subAccessLink: SubAccessLink
  }) => {
    if (subAccess === "visitor") {
      if (subAccessLink.visitorLink) {
        return (
          <Link href={subAccessLink.visitorLink} className="hover:text-primary">
            <div className="font-semibold text-sm text-center">{aboveText}</div>
            <div className="text-sm text-neutral-500 text-center">{subText}</div>
          </Link>
        )
      }
    } else if (subAccess === "logged_access") {
      if (subAccessLink.loggedAccessLink) {
        return (
          <Link href={subAccessLink.loggedAccessLink} className="hover:text-primary">
            <div className="font-semibold text-sm text-center">{aboveText}</div>
            <div className="text-sm text-neutral-500 text-center">{subText}</div>
          </Link>
        )
      }
    }

    return (
      <div className="hover:text-primary cursor-default">
        <div className="font-semibold text-sm text-center">{aboveText}</div>
        <div className="text-sm text-neutral-500 text-center">{subText}</div>
      </div>
    )
  }

  return (
    <section className={cn("flex h-16 justify-around items-center", className)}>
      <SubComponent aboveText={String(nfts)} subText="ntfs" subAccessLink={{
        visitorLink: `/login${createRedirectQueryParam(`/profile/${username}`)}`
      }}/>
      <SubComponent aboveText={String(followers)} subText="followers" subAccessLink={{
        visitorLink: `/login${createRedirectQueryParam(`/profile/${username}`)}`,
        loggedAccessLink: `/profile/${username}/followers`
      }}/>
      <SubComponent aboveText={String(follows)} subText="follows" subAccessLink={{
        visitorLink: `/login${createRedirectQueryParam(`/profile/${username}`)}`,
        loggedAccessLink: `/profile/${username}/follows`
      }}/>
    </section>
  )
}

interface ProfileNftsSectionProps {
  className?: string,
  nfts: {
    mintCount: number,
    commentCount: number,
    contentUrl: string
    id: number,
    type: NftType
  }[]
}

export function NftsSection({className, nfts}: ProfileNftsSectionProps) {
  return (
    <section id="nfts-section-ssr" className={cn("grid grid-cols-3 gap-0.5", className)}>
      {
        nfts.map((nft, index) => {
          return (
            <React.Fragment key={`1-${index}`}>
              <NftContainer
                mints={nft.mintCount.toString()}
                comments={nft.commentCount.toString()}
                type="image"
                url={nft.contentUrl}
              />
            </React.Fragment>
          )
        })
      }
    </section>
  )
}

export function ProfileDoesNotExist() {
  return (
    <header className="flex w-full justify-center items-center h-40">
      <h1 className="md:font-bold">Profile does not exist</h1>
    </header>
  )
}

function VisitorPrivateProfileConnectionSection({username}: { username: string }) {
  return (
    <section className="grid justify-center mt-10 gap-4">
      <h2 className="text-center font-semibold text-sm">
        This profile is private
      </h2>
      <div className="grid text-center text-sm gap-0.5">
        <p>Already follow @{username} ?</p>
        <p>
          <Button className="p-0" variant="link" asChild>
            <Link href={`/login${createRedirectQueryParam(`/profile/${username}`)}`}>
              login
            </Link>
          </Button>
          {" "}to see its NFTs
        </p>
      </div>
    </section>
  )
}

interface VisitorPrivateProfileProps {
  profile: {
    bio: string,
    link: string | null,
    username: string,
    displayName: string,
    location: string | null,
    avatarUrl: string
  },
  followersCount: number,
  followsCount: number,
  nftsCount: number
}

export function VisitorPrivateProfile(props: VisitorPrivateProfileProps) {
  return (
    <main>
      <div className="flex justify-center">
        <div className="grid max-w-[940px] w-full">
          <ProfileHeaderSection
            bio={props.profile.bio}
            link={props.profile.link}
            username={props.profile.username}
            displayName={props.profile.displayName}
            location={props.profile.location}
            avatarUrl={props.profile.avatarUrl}
            viewerUserType="visitor"
          />
          <Separator/>
          <ProfileStatisticsSection
            followers={props.followersCount}
            follows={props.followsCount}
            nfts={props.nftsCount}
            username={props.profile.username}
            subAccess="visitor"
          />
          <Separator/>
          <VisitorPrivateProfileConnectionSection username={props.profile.username}/>
        </div>
      </div>
    </main>
  )
}

function NotFollowPrivateProfileSection() {
  return (
    <section className="grid justify-center mt-10 gap-4">
      <h2 className="text-center font-semibold text-sm">
        This profile is private
      </h2>
    </section>
  )
}

interface VisitorPrivateProfileProps {
  profile: {
    bio: string,
    link: string | null,
    username: string,
    displayName: string,
    location: string | null,
    avatarUrl: string
  },
  followersCount: number,
  followsCount: number,
  nftsCount: number,
  followUnfollowTextButton?: FollowUnfollowTextButton,
}

export function NotFollowPrivateProfile(props: VisitorPrivateProfileProps) {
  return (
    <main>
      <div className="flex justify-center">
        <div className="grid max-w-[940px] w-full">
          <ProfileHeaderSection
            bio={props.profile.bio}
            link={props.profile.link}
            username={props.profile.username}
            displayName={props.profile.displayName}
            location={props.profile.location}
            avatarUrl={props.profile.avatarUrl}
            viewerUserType="logged"
            followUnfollowTextButton={props.followUnfollowTextButton}
          />
          <Separator/>
          <ProfileStatisticsSection
            followers={props.followersCount}
            follows={props.followsCount}
            nfts={props.nftsCount}
            username={props.profile.username}
            subAccess="logged_denial"
          />
          <Separator/>
          <NotFollowPrivateProfileSection/>
        </div>
      </div>
    </main>
  )
}

function ShareMyProfileButton({className}: { className?: string }) {
  return (
    <Button className={cn("h-8 min-w-32 font-semibold", className)} variant="tertiary">
      <Link href="/">
        Share the profile
      </Link>
    </Button>
  )
}

function ModifyMyProfileButton({className}: { className?: string }) {
  return (
    <Button className={cn("h-8 min-w-32 font-semibold", className)} variant="tertiary">
      <Link href="/settings/profile">
        Modify
      </Link>
    </Button>
  )
}

function VisitorFollowButton({className, username}: { className?: string, username: string }) {
  return (
    <Button variant="default" className={cn("h-8 min-w-32 font-semibold", className)} asChild>
      <Link href={`/login${createRedirectQueryParam(`/profile/${username}`)}`}>
        Follow
      </Link>
    </Button>
  )
}

function LoggedFollowUnfollowButton({className, username, followUnfollowTextButton}: {
  className?: string,
  username: string,
  followUnfollowTextButton?: FollowUnfollowTextButton
}) {
  const textFollowUnfollowButton = (): string => {
    if (!followUnfollowTextButton) {
      return "Follow"
    }

    switch (followUnfollowTextButton) {
      case "follow":
        return "Follow"

      case "following":
        return "Following"

      case "pending":
        return "Pending"

      case "follow_back":
        return "Follow back"
    }
  }
  const variantFollowUnfollowButton = () => {
    if (!followUnfollowTextButton) {
      return "default"
    }

    switch (followUnfollowTextButton) {
      case "follow":
        return "default"

      case "following":
        return "tertiary"

      case "pending":
        return "tertiary"

      case "follow_back":
        return "default"
    }
  }

  return (
    <form method="post" action="/api/profile/follow" className={cn("h-8 min-w-32", className)}>
      <input id="username" name="username" value={username} type="hidden" required/>
      <Button
        type="submit"
        variant={variantFollowUnfollowButton()}
        className="size-full font-semibold">
        {
          textFollowUnfollowButton()
        }
      </Button>
    </form>
  )
}
