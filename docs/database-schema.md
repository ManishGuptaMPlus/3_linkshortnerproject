# Database Schema Guidelines

This document defines the standards and patterns for creating database schemas in this project using Drizzle ORM and PostgreSQL (Neon Database).

## ⚠️ CRITICAL: Required Patterns

Before creating or modifying any database schema, you MUST follow these patterns.

## Primary Keys

**ALWAYS use identity columns** for auto-incrementing primary keys in PostgreSQL:

```typescript
import { pgTable, integer } from "drizzle-orm/pg-core";

export const example = pgTable("example", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
});
```

### Why Identity Columns?

- ✅ SQL standard (vs legacy `serial` pseudo-type)
- ✅ Better permissions handling
- ✅ Recommended by modern PostgreSQL best practices

### ❌ DO NOT USE:

```typescript
// DON'T use serial
id: serial("id").primaryKey()
```

## Timestamp Columns

**ALWAYS store timezone data** with timestamps:

```typescript
import { timestamp } from "drizzle-orm/pg-core";

// For createdAt
createdAt: timestamp("created_at", { withTimezone: true, mode: "date" })
  .defaultNow()
  .notNull()

// For updatedAt (auto-updates on record changes)
updatedAt: timestamp("updated_at", { withTimezone: true, mode: "date" })
  .defaultNow()
  .notNull()
  .$onUpdate(() => new Date())
```

### Key Parameters:

- **`withTimezone: true`** - Creates `TIMESTAMPTZ` in PostgreSQL (stores UTC, displays in local timezone)
- **`mode: "date"`** - TypeScript type is `Date` object
- **`.defaultNow()`** - Sets SQL `DEFAULT CURRENT_TIMESTAMP`
- **`.$onUpdate(() => new Date())`** - Auto-updates timestamp when record is modified

### ❌ DO NOT:

- Use timestamps without timezone data
- Forget `.defaultNow()` on `createdAt`/`updatedAt`
- Forget `.$onUpdate()` on `updatedAt`

## Delete Strategy

**ALWAYS confirm the delete strategy** with the user before implementing:

### Option 1: Permanent Deletes (Hard Delete)

- Records are permanently removed from the database
- Use `DELETE` SQL operations
- No additional columns needed
- **Cannot be recovered**

### Option 2: Soft Deletes

- Records are marked as deleted but remain in database
- Add `deletedAt` column:

```typescript
deletedAt: timestamp("deleted_at", { withTimezone: true, mode: "date" })
```

- Filter `deletedAt IS NULL` in queries
- Can be recovered by setting `deletedAt` to `null`

**⚠️ IMPORTANT:** Ask the user which approach to use. Default to permanent deletes if not specified.

## User Identification

When associating records with users via Clerk authentication:

```typescript
import { text } from "drizzle-orm/pg-core";

// Use text type for Clerk user IDs (e.g., "user_xxxxx")
userId: text("user_id").notNull()
```

### ❌ DO NOT:

- Use integer types for `userId` (Clerk uses string IDs)
- Make `userId` nullable for user-owned resources

## Migrations Workflow

**ALWAYS generate and review migrations** before applying to database:

### 1. Generate Migration

```bash
npx drizzle-kit generate
```

This creates SQL migration files in the `/drizzle` directory.

### 2. Review Generated SQL

- Check the SQL files in `/drizzle` directory
- Verify the migrations are correct
- Ensure no unintended changes

### 3. Apply Migration

```bash
npx drizzle-kit migrate
```

### ❌ DO NOT:

- Use `npx drizzle-kit push` in production (only for development)
- Apply migrations without reviewing generated SQL
- Manually edit schema in production database

## Complete Schema Example

```typescript
import { pgTable, integer, text, varchar, timestamp } from "drizzle-orm/pg-core";

export const links = pgTable("links", {
  // Primary key with identity column
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  
  // User association (Clerk)
  userId: text("user_id").notNull(),
  
  // Business fields
  shortCode: varchar("short_code", { length: 20 }).notNull().unique(),
  url: text("url").notNull(),
  
  // Timestamps with timezone
  createdAt: timestamp("created_at", { withTimezone: true, mode: "date" })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true, mode: "date" })
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
});

// Export types for use throughout application
export type Link = typeof links.$inferSelect;
export type NewLink = typeof links.$inferInsert;
```

## Type Exports

**ALWAYS export TypeScript types** from schema definitions:

```typescript
// For SELECT queries (includes all fields)
export type Link = typeof links.$inferSelect;

// For INSERT queries (excludes auto-generated fields)
export type NewLink = typeof links.$inferInsert;
```

Use these types throughout your application for type-safe database operations.

## Quick Reference

| Pattern | Use | Don't Use |
|---------|-----|-----------|
| Primary Key | `integer().primaryKey().generatedAlwaysAsIdentity()` | `serial()` |
| Timestamps | `timestamp("field", { withTimezone: true, mode: "date" })` | `timestamp()` without timezone |
| User IDs | `text("user_id")` | `integer()` or `uuid()` |
| Migrations | Generate → Review → Migrate | Direct `push` to production |
| Deletes | Ask user: permanent or soft? | Assume one without asking |

---

**Last Updated:** January 2026  
**Applies To:** Drizzle ORM 0.45.1+ with PostgreSQL
