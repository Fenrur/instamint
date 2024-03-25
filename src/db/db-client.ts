import { env } from '@/env';
import * as schema from './schema';
import { drizzle } from 'drizzle-orm/postgres-js';

import postgres from "postgres";

const queryClient = postgres(env.DATABASE_URL);

export const db = drizzle(queryClient, {schema});
