import React from "react"
import {ProfileContainer, TeaBagContainer} from "../../../app/profile/[slug]/ssr"
import {TeaBag} from "../../../app/tea-bags/page"

export interface ProfileData {
  id: number;
  link: string;
  bio: string;
  avatarUrl: string;
  username: string;

}

export const ProfileList = ({data}: { data: ProfileData[] }) => {
  return (
    <section className={"grid grid-cols-3 gap-0.5"}>
      {
        data.map((nft) => {
          return (
            <React.Fragment key={nft.id}>
              <ProfileContainer
                link={nft.link}
                avatarUrl={nft.avatarUrl === "" ? "https://api.dicebear.com/8.x/notionists-neutral/svg?seed=Buddy" : nft.avatarUrl}
                username={nft.username}
              />
            </React.Fragment>
          )
        })
      }
    </section>
  )
}


export const TeaBagList = ({data, onDelete, onReport, onUpdate}: {
  data: TeaBag[],
  onDelete: any,
  onReport: any,
  onUpdate: any
}) => {
  return (
    <section className={"grid grid-cols-3 gap-0.5"}>
      {
        data.map((nft) => {
          return (
            <React.Fragment key={nft.id}>
              <TeaBagContainer
                id={nft.id}
                link={nft.link}
                avatarUrl={nft.avatarUrl === "" ? "https://api.dicebear.com/8.x/notionists-neutral/svg?seed=Buddy" : nft.avatarUrl}
                followers_count={nft.followers_count}
                followed_count={nft.followed_count}
                cooks_count={nft.cooks_count}
                username={nft.username}
                onDelete={onDelete}
                onReport={onReport}
                onUpdate={onUpdate}
              />
            </React.Fragment>
          )
        })
      }
    </section>
  )
}
