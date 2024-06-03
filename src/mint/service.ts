import {PgClient} from "@/db/db-client"
import {MintPgRepository} from "./repository"
import {DateTime} from "luxon"
import {NftPgRepository} from "@/nft/repository"

export class DefaultMintService {
  private readonly mintRepository: MintPgRepository
  private readonly nftRepository: NftPgRepository

  constructor(pgClient: PgClient) {
    this.mintRepository = new MintPgRepository(pgClient)
    this.nftRepository = new NftPgRepository(pgClient)
  }

  public async mint(nftId: number, profileId: number, mintAt: DateTime<true>) {
    const existNft = await this.nftRepository.exists(nftId)

    if (!existNft) {
      return "nft_not_found"
    }

    const mint = await this.mintRepository.get(nftId, profileId)

    if (mint) {
      return "already_minted"
    }

    await this.mintRepository.create(nftId, profileId, mintAt)

    return "minted"
  }

  public async unmint(nftId: number, profileId: number) {
    const existNft = await this.nftRepository.exists(nftId)

    if (!existNft) {
      return "nft_not_found"
    }

    const mint = await this.mintRepository.get(nftId, profileId)

    if (!mint) {
      return "not_minted"
    }

    await this.mintRepository.delete(nftId, profileId)

    return "unminted"
  }

  public async countMints(nftId: number) {
    return await this.mintRepository.countMints(nftId)
  }
}
