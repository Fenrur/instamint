export function createRedirectQueryParam(redirect: string|null) {
  return redirect ? `?redirect=${redirect}` : ""
}
