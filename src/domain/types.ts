export const languageTypeArray = [
  "en",
  "fr",
  "es"
] as const

export type LanguageType = typeof languageTypeArray[number]

export const userRoleArray = [
  "user",
  "admin"
] as const

export type UserRole = typeof userRoleArray[number]

export const profileVisibilityTypeArray = [
  "public",
  "private"
] as const

export type ProfileVisibilityType = typeof profileVisibilityTypeArray[number]

export const currencyTypeArray = [
  "usd",
  "eur",
  "eth",
  "sol"
] as const

export type CurrencyType = typeof currencyTypeArray[number]

export const userTeaBagRoleArray = [
  "user",
  "cooker"
] as const

export type UserTeaBagRole = typeof userTeaBagRoleArray[number]

export const notificationTypeArray = [
  "comments_replies",
  "comments_threads",
  "mints",
  "follow_requests",
  "follow_requests_accepted"
] as const

export type NotificationType = typeof notificationTypeArray[number]

export const nftTypeArray = [
  "image",
  "video",
  "audio"
] as const

export type NftType = typeof nftTypeArray[number]
