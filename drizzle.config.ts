import { defineConfig } from 'drizzle-kit'
export default defineConfig({
  schema: "./src/db/schema.ts",
  driver: 'pg',
  dbCredentials: {
    connectionString: "postgresql://localhost:5432/drizzle",
    user: "livio",
    password: "livio"
  },
  verbose: true,
  strict: true,
  out: "./drizzle",
  introspect: {
    casing: "camel"
  },
})
