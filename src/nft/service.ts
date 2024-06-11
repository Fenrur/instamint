import {NftPgRepository} from "@/nft/repository"
import {PgClient} from "@/db/db-client"
import {ProfilePgRepository} from "@/profile/repository"

export class DefaultNftService {
  private readonly nftPgRepository: NftPgRepository
  private readonly profilePgRepository: ProfilePgRepository
  private readonly nftsPageSize: number

  constructor(pgClient: PgClient, nftsPageSize: number) {
    this.nftPgRepository = new NftPgRepository(pgClient)
    this.nftsPageSize = nftsPageSize
    this.profilePgRepository = new ProfilePgRepository(pgClient)
  }

  public countNfts(profileId: number) {
    return this.nftPgRepository.countNftsByProfileId(profileId)
  }

  public findNftsPaginatedByProfileIdWithMintCountAndCommentCount(profileId: number, page: number) {
    return this.nftPgRepository.findNftsPaginatedByProfileIdWithMintCountAndCommentCount(profileId, this.nftsPageSize * (page - 1), this.nftsPageSize)
  }

  public findNftsPaginatedByUsernameOrHashtagOrDescriptionOrLocationOrPriceRange(query: string, location: string, minPrice: string, maxPrice: string, page: number) {
    return this.nftPgRepository.findNftsPaginatedByUsernameOrHashtagOrDescriptionOrLocationOrPriceRange(query, location, minPrice, maxPrice, this.nftsPageSize * (page - 1), this.nftsPageSize)
  }

  public async findNftsPaginatedByUsernameWithMintCountAndCommentCount(username: string, page: number) {
    const profile = await this.profilePgRepository.findByUsername(username)

    if (!profile) {
      return "profile_not_found"
    }

    return this.nftPgRepository.findNftsPaginatedByProfileIdWithMintCountAndCommentCount(profile.id, this.nftsPageSize * (page - 1), this.nftsPageSize)
  }

  public findNftsPaginatedAndSorted(profileId: number, page: number) {
    return this.nftPgRepository
      .findNftsPaginatedAndSorted(
        profileId,
        this.nftsPageSize * (page - 1),
        this.nftsPageSize
      )
  }

  public findAdminNftsPaginatedAndSorted(page: number) {
    return this.nftPgRepository
      .findAdminNftsPaginatedAndSorted(
        this.nftsPageSize * (page - 1),
        this.nftsPageSize
      )
  }

  public async deleteNftById(id: string) {
    const nft = await this.findById(id)

    if (!nft) {
      return "nft_not_found"
    }

    await this.nftPgRepository.deleteNft(nft.id)

    return "deleted"
  }

  public findById(id: string) {
    return this.nftPgRepository.findById(id)
  }

  public async getAll() {
      return this.nftPgRepository.getAll()
  }
}
