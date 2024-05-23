import React from "react"
import {ProfileContainer} from "../../../app/profile/[slug]/ssr"

export interface ProfileData {
  id: number;
  link: string;
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
