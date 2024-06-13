import {Separator} from "@/components/ui/separator"
import {getServerSession} from "@/auth"
import {followService, nftService, profileService} from "@/services"
import React from "react"
import {NftsSection as NftsSectionCsr} from "./csr"
import {
  NftsSection as NftsSectionSsr,
  NotFollowPrivateProfile,
  ProfileDoesNotExist,
  ProfileHeaderSection,
  ProfileStatisticsSection,
  VisitorPrivateProfile
} from "./ssr"
import {MyUserAuthenticatedDoesntExist} from "@/components/section/my-user-authenticated-doest-exist"
import {FollowState} from "@/follow/service"
import {FollowUnfollowTextButton} from "../types"
import {redirect} from "next/navigation"

export const dynamic = "force-dynamic"

function getFollowUnfollowTextButtonFrom(followState: FollowState | undefined, followerState: FollowState | undefined): FollowUnfollowTextButton {
  if (typeof followState === "undefined" || typeof followerState === "undefined") {
    return "follow"
  }

  if (followState === "following") {
    return "following"
  }

  if (followState === "requesting_follow" || followState === "ignored_request_follow") {
    return "pending"
  }

  if (followerState === "following") {
    return "follow_back"
  }

  return "follow"
}

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

  if (myUserAndProfile && myUserAndProfile.profile.username.toLowerCase() === username.toLowerCase()) {
    redirect("/me")
  }

  if (session && !myUserAndProfile) {
    return (
      <main>
        <MyUserAuthenticatedDoesntExist/>
      </main>
    )
  }

  let followState: FollowState | null = null
  let followerState: FollowState | null = null
  let followUnfollowTextButton: FollowUnfollowTextButton | null = null

  if (myUserAndProfile) {
    const [resultFollowState, resultFollowerState] = await Promise.all([
      followService.getFollowState(myUserAndProfile.profile.id, profile.id),
      followService.getFollowState(profile.id, myUserAndProfile.profile.id)
    ])
    followState = resultFollowState
    followerState = resultFollowerState
    followUnfollowTextButton = getFollowUnfollowTextButtonFrom(followState, followerState)
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

    if (followState !== "following") {
      return (
        <NotFollowPrivateProfile
          profile={profile}
          followersCount={await followService.countFollowers(profile.id)}
          followsCount={await followService.countFollows(profile.id)}
          nftsCount={await nftService.countNfts(profile.id)}
          followUnfollowTextButton={followUnfollowTextButton || undefined}
        />
      )
    }
  }

  const nfts = await nftService.findNftsPaginatedAndSorted(profile.id, 1)

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
            viewerUserType={session ? "logged" : "visitor"}
            followUnfollowTextButton={followUnfollowTextButton || undefined}
          />
          <Separator/>
          <ProfileStatisticsSection
            followers={followersCount}
            follows={followsCount}
            nfts={nftsCount}
            username={username}
            subAccess={session ? "logged_access" : "visitor"}
          />
          <Separator/>
          <NftsSectionSsr nfts={nfts}/>
          <NftsSectionCsr username={username}/>
        </div>
      </div>
    </main>
  )
}
