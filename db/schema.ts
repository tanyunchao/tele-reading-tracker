// db/schema.ts
import {
  pgTable,
  serial,
  text,
  integer,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { sql } from "drizzle-orm";

export const books = pgTable("books", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 256 }).notNull(),
  author: varchar("author", { length: 256 }).notNull(),
  totalPages: integer("total_pages").notNull(),
  currentPage: integer("current_page").default(0),
  startDate: timestamp("start_date").default(sql`CURRENT_TIMESTAMP`),
  lastUpdated: timestamp("last_updated").default(sql`CURRENT_TIMESTAMP`),
});

export const readingUpdates = pgTable("reading_updates", {
  id: serial("id").primaryKey(),
  bookId: integer("book_id").references(() => books.id),
  timestamp: timestamp("timestamp").default(sql`CURRENT_TIMESTAMP`),
  previousPage: integer("previous_page").notNull(),
  currentPage: integer("current_page").notNull(),
  summary: text("summary"),
});

// Define the relationships between tables
export const booksRelations = relations(books, ({ many }) => ({
  updates: many(readingUpdates),
}));

export const readingUpdatesRelations = relations(readingUpdates, ({ one }) => ({
  book: one(books, {
    fields: [readingUpdates.bookId],
    references: [books.id],
  }),
}));

// Type definitions for our database entities
export type Book = typeof books.$inferSelect;
export type NewBook = typeof books.$inferInsert;
export type ReadingUpdate = typeof readingUpdates.$inferSelect;
export type NewReadingUpdate = typeof readingUpdates.$inferInsert;
