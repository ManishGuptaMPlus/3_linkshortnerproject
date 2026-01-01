import { pgTable, text, varchar, timestamp, integer } from "drizzle-orm/pg-core";

export const links = pgTable("links", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  userId: text("user_id").notNull(),
  shortCode: varchar("short_code", { length: 20 }).notNull().unique(),
  url: text("url").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true, mode: "date" })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true, mode: "date" })
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
});

export type Link = typeof links.$inferSelect;
export type NewLink = typeof links.$inferInsert;
