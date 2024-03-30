import {NextRequest} from "next/server"

export type ContentType = "json" | "form"

export function isContentType(req: NextRequest, type: ContentType) {
  switch (type) {
    case "json":
      return req.headers.get("content-type") === "application/json"
    case "form":
      return req.headers.get("content-type") === "application/x-www-form-urlencoded"
  }
}
