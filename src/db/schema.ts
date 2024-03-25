import { integer, pgEnum, pgTable, serial, uniqueIndex, varchar, doublePrecision } from 'drizzle-orm/pg-core';
import {relations} from "drizzle-orm";

export const person = pgTable('Person', {
  id: serial('id').primaryKey(),
  firstName: varchar('firstName', { length: 256 }),
  lastName: varchar('lastName', { length: 256 }),
});
