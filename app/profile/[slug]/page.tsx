import {Separator} from "@/components/ui/separator"
import {getServerSession} from "@/auth"
import {followService, nftService, profileService} from "@/services"
import React from "react"
import {NftsSection as NftsSectionCsr} from "./csr"
import {
  ConnectionHeader,
  NftsSection as NftsSectionSsr,
  ProfileDoesNotExist,
  ProfileHeaderSection,
  ProfileStatisticsSection
} from "./ssr"

export const dynamic = "force-dynamic"

interface ProfilePageProps {
  params: {
    slug: string
  }
}

export default async function ProfilePage(props: ProfilePageProps) {
  const username = props.params.slug

  const [session, profile] = await Promise.all([
    getServerSession(),
    profileService.findByUsername(username)
  ])

  if (!profile) {
    return (
      <main>
        <ProfileDoesNotExist/>
      </main>
    )
  }

  const [followersCount, followsCount, nftsCount, nfts] = await Promise.all([
    followService.countFollowers(profile.id),
    followService.countFollows(profile.id),
    nftService.countNfts(profile.id),
    nftService.findNftsPaginatedByProfileIdWithMintCountAndCommentCount(profile.id, 1)
  ])

  return (
    <main>
      {
        !session
          ? <div className="flex justify-center">
            <div className="grid max-w-[940px] w-full">
              <ConnectionHeader username={username} className="max-w-[940px]"/>
            </div>
          </div>
          : null
      }
      {
        !session
          ? <Separator/>
          : null
      }
      <div className="flex justify-center">
        <div className="grid max-w-[940px] w-full">
          <ProfileHeaderSection
            bio={profile.bio}
            link={profile.link}
            username={profile.username}
            displayName={profile.displayName}
            location={profile.location}
            avatarUrl={profile.avatarUrl}
          />
          <Separator/>
          <ProfileStatisticsSection
            followers={followersCount}
            follows={followsCount}
            nfts={nftsCount}
            username={username}
          />
          <Separator/>
          <NftsSectionSsr nfts={nfts}/>
          <NftsSectionCsr username={username}/>
        </div>
      </div>
    </main>
  )
}
