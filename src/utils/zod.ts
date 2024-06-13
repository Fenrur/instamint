import {z} from "zod"
import {DateTime} from "luxon"

export function datetimeSql() {
  return z.string().transform(dateSql => {
    const pAt = DateTime.fromSQL(dateSql, {zone: "UTC"})

    if (pAt.isValid) {
      return pAt
    }

    throw new Error("Invalid date")
  })
}

export function datetimeIso() {
  return z.string().transform(dateIso => {
    const pAt = DateTime.fromISO(dateIso, {zone: "UTC"})

    if (pAt.isValid) {
      return pAt
    }

    throw new Error("Invalid date")
  })
}
