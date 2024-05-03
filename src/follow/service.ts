import {FollowRepository} from "@/follow/repository"
import {PgClient} from "@/db/db-client"
import {DateTime} from "luxon"

export class DefaultFollowService {
  private readonly followRepository: FollowRepository

  constructor(pgClient: PgClient) {
    this.followRepository = new FollowRepository(pgClient)
  }

  public follow(followerProfileId: number, followedProfileId: number, followAt: DateTime<true>) {
    return this.followRepository.follow(followerProfileId, followedProfileId, followAt)
  }

  public countFollowers(profileId: number) {
    return this.followRepository.countFollowers(profileId)
  }

  public countFollows(profileId: number) {
    return this.followRepository.countFollows(profileId)
  }

  public getFollow(followerProfileId: number, followedProfileId: number) {
    return this.followRepository.getFollow(followerProfileId, followedProfileId)
  }
}
