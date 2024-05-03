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

  let myUser = null

  if (session) {
    myUser = await userService.findByUid(session.uid)

    if (! myUser) {
      return (
        <main>
          <MyUserAuthenticatedDoesntExist/>
        </main>
      )
    }
  }

  const [followersCount, followsCount, nftsCount, myProfile] = await Promise.all([
    followService.countFollowers(profile.id),
    followService.countFollows(profile.id),
    nftService.countNfts(profile.id),
    myUser ? await profileService.findByUid(myUser.uid) : null
  ])

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

    if (!myProfile) {
      return (
        <main>
          <MyUserAuthenticatedDoesntExist/>
        </main>
      )
    }

    const follow = await followService.getFollow(myProfile.id, profile.id)

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
