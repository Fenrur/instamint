import {NextRequest} from "next/server"
// @ts-expect-error TODO fix library not found
import {NextAuthRequest} from "next-auth/lib"

export type ContentType = "json" | "form" | "no_body"

export function isContentType(req: NextRequest|NextAuthRequest, type: ContentType) {
  if (type === "no_body") {
    return req.headers.get("content-type") === null
  }

  const contentType = String(req.headers.get("content-type"))

  switch (type) {
    case "json":

      return contentType === "application/json"

    case "form":

      return contentType === "application/x-www-form-urlencoded"
  }
}
