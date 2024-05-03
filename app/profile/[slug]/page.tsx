import {Separator} from "@/components/ui/separator"
import {getServerSession} from "@/auth"
import {followService, nftService, profileService, userService} from "@/services"
import React from "react"
import {NftsSection as NftsSectionCsr} from "./csr"
import {
  NftsSection as NftsSectionSsr, NotFollowPrivateProfile,
  ProfileDoesNotExist,
  ProfileHeaderSection,
  ProfileStatisticsSection, VisitorPrivateProfile
} from "./ssr"
import {MyUserAuthenticatedDoesntExist} from "@/components/section/my-user-authenticated-doest-exist"

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

  const [followersCount, followsCount, nftsCount, myUserAndProfile] = await Promise.all([
    followService.countFollowers(profile.id),
    followService.countFollows(profile.id),
    nftService.countNfts(profile.id),
    session ? profileService.findByUserUid(session.uid) : null
  ])

  if (session && !myUserAndProfile) {
    return (
      <main>
        <MyUserAuthenticatedDoesntExist/>
      </main>
    )
  }

  if (profile.visibilityType === "private") {
    if (!session) {
      return (
        <main>
          <VisitorPrivateProfile
            profile={profile}
            followersCount={await followService.countFollowers(profile.id)}
            followsCount={await followService.countFollows(profile.id)}
            nftsCount={await nftService.countNfts(profile.id)}
          />
        </main>
      )
    }

    if (!myUserAndProfile) {
      throw new Error("This should never happen")
    }

    const follow = await followService.getFollow(myUserAndProfile.profile.id, profile.id)

    if (!follow) {
      return (
        <NotFollowPrivateProfile
          profile={profile}
          followersCount={await followService.countFollowers(profile.id)}
          followsCount={await followService.countFollows(profile.id)}
          nftsCount={await nftService.countNfts(profile.id)}
        />
      )
    }
  }

  const nfts = await nftService.findNftsPaginatedByProfileIdWithMintCountAndCommentCount(profile.id, 1)

  return (
    <main>
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
