import {NftPgRepository} from "@/nft/repository"
import {PgClient} from "@/db/db-client"
import {ProfilePgRepository} from "@/profile/repository"

export class DefaultNftService {
  private readonly nftPgRepository: NftPgRepository
  private readonly profilePgRepository: ProfilePgRepository
  private readonly pageSize: number

  constructor(pgClient: PgClient, pageSize: number) {
    this.nftPgRepository = new NftPgRepository(pgClient)
    this.profilePgRepository = new ProfilePgRepository(pgClient)
    this.pageSize = pageSize
  }

  public countNfts(profileId: number) {
    return this.nftPgRepository.countNftsByProfileId(profileId)
  }

  public findNftsPaginatedByProfileIdWithMintCountAndCommentCount(profileId: number, page: number) {
    return this.nftPgRepository.findNftsPaginatedByProfileIdWithMintCountAndCommentCount(profileId, this.pageSize * (page - 1), this.pageSize)
  }

  public findNftsPaginatedByUsernameOrHashtagOrDescriptionOrLocationOrPriceRange(query:string, location:string, minPrice:string, maxPrice:string, page: number) {
    return this.nftPgRepository.findNftsPaginatedByUsernameOrHashtagOrDescriptionOrLocationOrPriceRange(query, location, minPrice, maxPrice, this.pageSize * (page - 1), this.pageSize);
  }
  public findUsersOrTeaPaginatedByUsernameOrLocation(username:string, location:string, page: number) {
    return this.nftPgRepository.findUsersOrTeaPaginatedByUsernameOrLocation(username, location, this.pageSize * (page - 1), this.pageSize);
  }

  public async findNftsPaginatedByUsernameWithMintCountAndCommentCount(username: string, page: number) {
    const profile = await this.profilePgRepository.findByUsername(username)

    if (!profile) {
      return "profile_not_found"
    }

    return this.nftPgRepository.findNftsPaginatedByProfileIdWithMintCountAndCommentCount(profile.id, this.pageSize * (page - 1), this.pageSize)
  }

}
