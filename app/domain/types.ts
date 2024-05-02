export const nftTypeArray = ["image", "video", "audio"] as const

export type NftType = typeof nftTypeArray[number]
