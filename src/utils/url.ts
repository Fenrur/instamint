export function createRedirectQueryParam(redirect: string|null) {
  if (! redirect) return ""
  return `?redirect=${redirect}`
}
