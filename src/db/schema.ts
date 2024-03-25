import { pgTable, serial, varchar } from "drizzle-orm/pg-core"

export const person = pgTable("Person", {
  id: serial("id").primaryKey(),
  firstName: varchar("firstName", { length: 256 }),
  lastName: varchar("lastName", { length: 256 }),
})
