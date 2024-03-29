import {boolean, pgTable, serial, timestamp, uuid, varchar} from "drizzle-orm/pg-core"

export const user = pgTable("User", {
  id: serial("id").primaryKey(),
  uid: uuid("uid").unique().notNull(),
  email: varchar("email", { length: 256 }).unique().notNull(),
  hashedPassword: varchar("hashedPassword", { length: 256 }).notNull(),
  twoFactorEnabled: boolean("twoFactorEnabled").notNull().default(false),
  twoFactorSecret: varchar("twoFactorSecret", { length: 256 }),
})
