import {getServerSession} from "@/auth"
import {redirect} from "next/navigation"
import {createRedirectQueryParam} from "@/utils/url"
import {followService, nftService, profileService} from "@/services"
import {MyUserAuthenticatedDoesntExist} from "@/components/section/my-user-authenticated-doest-exist"
import React from "react"
import {ProfileHeaderSection, ProfileStatisticsSection} from "../profile/[slug]/ssr"
import {Separator} from "@/components/ui/separator"
import {NftsSection as NftsSectionCsr} from "../profile/[slug]/csr"

export default async function MyProfilePage() {
  const session = await getServerSession()

  if (!session) {
    redirect(`/login${createRedirectQueryParam("/me")}`)
  }

  const myUserAndProfile = await profileService.findByUserUid(session.uid)

  if (!myUserAndProfile) {
    return (
      <main>
        <MyUserAuthenticatedDoesntExist/>
      </main>
    )
  }

  const [followersCount, followsCount, nftsCount] = await Promise.all([
    followService.countFollowers(myUserAndProfile.profile.id),
    followService.countFollows(myUserAndProfile.profile.id),
    nftService.countNfts(myUserAndProfile.profile.id),
  ])

  return (
    <main>
      <div className="flex justify-center">
        <div className="grid max-w-[940px] w-full">
          <ProfileHeaderSection
            bio={myUserAndProfile.profile.bio}
            link={myUserAndProfile.profile.link}
            username={myUserAndProfile.profile.username}
            displayName={myUserAndProfile.profile.displayName}
            location={myUserAndProfile.profile.location}
            avatarUrl={myUserAndProfile.profile.avatarUrl}
            viewerUserType="my_profile"
          />
          <Separator/>
          <ProfileStatisticsSection
            followers={followersCount}
            follows={followsCount}
            nfts={nftsCount}
            username={myUserAndProfile.profile.username}
            subAccess="logged_access"
          />
          <Separator/>
          <NftsSectionCsr username={myUserAndProfile.profile.username}/>
        </div>
      </div>
    </main>
  )
}
