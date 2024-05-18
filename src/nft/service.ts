import {NftPgRepository} from "@/nft/repository"
import {PgClient} from "@/db/db-client"

export class DefaultNftService {
  private readonly nftPgRepository: NftPgRepository
  private readonly nftsPageSize: number

  constructor(pgClient: PgClient, nftsPageSize: number) {
    this.nftPgRepository = new NftPgRepository(pgClient)
    this.nftsPageSize = nftsPageSize
  }

  public countNfts(profileId: number) {
    return this.nftPgRepository.countNftsByProfileId(profileId)
  }

  public findNftsPaginatedAndSorted(profileId: number, page: number) {
    return this.nftPgRepository
      .findNftsPaginatedAndSorted(
        profileId,
        this.nftsPageSize * (page - 1),
        this.nftsPageSize
      )
  }
}
