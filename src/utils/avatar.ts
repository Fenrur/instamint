export function defaultAvatarUrl(username: string) {
  return `https://api.dicebear.com/8.x/pixel-art/svg?seed=${username.toLowerCase()}`
}

export function selfHostedAvatarUrl(username: string) {
  return `/profile/avatar/${username.toLowerCase()}`
}

export function avatarS3Path(username: string) {
  return `profile/${username.toLowerCase()}/avatar`
}
