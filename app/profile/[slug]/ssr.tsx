import {AudioLinesIcon, ImageIcon, MapPin, SquarePlayIcon} from "lucide-react"
import {CommentIcon, MintIcon} from "@/components/ui/icons"
import React from "react"
import {NftType} from "../../domain/types"
import {Button} from "@/components/ui/button"
import {DotsHorizontalIcon} from "@radix-ui/react-icons"
import {cn} from "@/lib/utils"
import {Pacifico} from "next/font/google"
import Link from "next/link"
import {createRedirectQueryParam} from "@/utils/url"

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

export function Ssr({url, type, mints, comments}: NftContainerProps) {
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
          <MintIcon className="size-6 text-white" color="#FFFFFF"/>
          <CommentIcon className="size-6 text-white mt-2" color="#FFFFFF"/>
        </div>
        <div>
          <div className="font-extrabold">{mints}</div>
          <div className="font-extrabold mt-2">{comments}</div>
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
                                     avatarUrl
                                   }: ProfileSectionProps) {
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
            <Button variant="secondary" className="h-8 w-32 font-semibold">Follow</Button>
            <Button variant="secondary" className="h-8 w-32 font-semibold">Contact</Button>
          </div>
        </div>
      </div>
      <div>
        <div className="font-semibold text-sm">{displayName}</div>
        <div className="flex items-center gap-2 pt-1">
          <MapPin strokeWidth={1.5}/>
          <h3 className="text-sm">{location}</h3>
        </div>
        <Button className="p-0 h-min" variant="link">{link}</Button>
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
                                      avatarUrl
                                    }: ProfileSectionProps) {
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
            <Button variant="secondary" className="h-8 w-32 ml-14 font-semibold" asChild>
              <Link href={`/login${createRedirectQueryParam(`/profile/${username}`)}`}>
                Follow
              </Link>
            </Button>
            <Button variant="secondary" className="h-8 w-32 ml-2 font-semibold" asChild>
              <Link href={`/login${createRedirectQueryParam(`/profile/${username}`)}`}>
                Contact
              </Link>
            </Button>
            <Link className="mt-1 ml-2.5" href="/">
              <DotsHorizontalIcon className="size-5"/>
            </Link>
          </div>
          <div className="font-semibold text-sm mt-4">{displayName}</div>
          <div className="flex items-center gap-2 pt-1">
            <MapPin strokeWidth={1.5}/>
            <h3 className="text-sm">{location}</h3>
          </div>
          <Button className="p-0 h-min" variant="link">{link}</Button>
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
  avatarUrl: string
}

export function ProfileHeaderSection({
                                       className,
                                       username,
                                       displayName,
                                       link,
                                       location,
                                       bio,
                                       avatarUrl
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
      />
      <MediumScreenProfileSection
        className={cn("hidden md:block", className)}
        username={username}
        displayName={displayName}
        link={link}
        location={location}
        bio={bio}
        avatarUrl={avatarUrl}
      />
    </>
  )
}

interface ProfileStatisticsSectionProps {
  className?: string,
  nfts: number,
  followers: number,
  follows: number,
  username: string
}

export function ProfileStatisticsSection({className, nfts, followers, follows, username}: ProfileStatisticsSectionProps) {
  return (
    <section className={cn("flex h-16 justify-around items-center", className)}>
      <Link href={`/login${createRedirectQueryParam(`/profile/${username}`)}`} className="hover:text-primary">
        <div className="font-semibold text-sm text-center">{nfts}</div>
        <div className="text-sm text-neutral-500 text-center">ntfs</div>
      </Link>
      <Link href={`/login${createRedirectQueryParam(`/profile/${username}`)}`} className="hover:text-primary">
        <div className="font-semibold text-sm text-center">{followers}</div>
        <div className="text-sm text-neutral-500 text-center">followers</div>
      </Link>
      <Link href={`/login${createRedirectQueryParam(`/profile/${username}`)}`} className="hover:text-primary">
        <div className="font-semibold text-sm text-center">{follows}</div>
        <div className="text-sm text-neutral-500 text-center">follows</div>
      </Link>
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
              <Ssr
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
    <div>
      <h1>Profile does not exist</h1>
    </div>
  )
}
