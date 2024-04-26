import { env } from "@/env"
import * as schema from "./schema"
import { drizzle } from "drizzle-orm/postgres-js"

import postgres from "postgres"
import {S3Client} from "@aws-sdk/client-s3"

const queryClient = postgres(env.DATABASE_URL)

export const pgClient = drizzle(queryClient, {schema})

export type PgClient = typeof pgClient

export const s3client = new S3Client({
  region: env.S3_REGION,
  credentials: {
    accessKeyId: env.S3_ACCESS_KEY_ID,
    secretAccessKey: env.S3_SECRET_ACCESS_KEY
  },
  forcePathStyle: true,
  endpoint: env.S3_ENDPOINT
})
