"use server"
import {pgClient} from "@/db/db-client"
import {NftTable} from "@/db/schema"
import {desc} from "drizzle-orm"

export async function getMaxPrice() {
  const result = await pgClient.select().from(NftTable).orderBy(desc(NftTable.price)).limit(1)

  return result[0].price
}
