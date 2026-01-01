---
description: Read this file when implementing data mutations, creating server actions, or modifying database operations in the project.
---

# Server Actions Guidelines

This document defines the patterns and requirements for implementing server actions in the Link Shortener project.

## Core Principles

All data mutations in this application **MUST** be done via server actions. Never perform database writes directly in API routes, Server Components, or client-side code.

## File Structure and Naming

### Location
- Server action files **MUST** be named `actions.ts`
- Colocate `actions.ts` in the same directory as the component(s) that call the server actions

**Example:**
```
app/
  dashboard/
    page.tsx          # Client component
    actions.ts        # Server actions for dashboard
  links/
    [id]/
      page.tsx        # Client component
      actions.ts      # Server actions for link detail page
```

### Why Colocation?
- Keeps related logic together
- Makes it easy to find server actions for a specific feature
- Improves maintainability

## Component Requirements

Server actions **MUST** be called from client components:

```tsx
// ❌ WRONG - Server Component calling server action directly
export default async function Page() {
  await deleteLink(id); // Don't do this
  return <div>...</div>;
}

// ✅ CORRECT - Client Component calling server action
"use client";

import { deleteLink } from "./actions";

export default function Page() {
  const handleDelete = async () => {
    await deleteLink(id);
  };
  return <button onClick={handleDelete}>Delete</button>;
}
```

## Type Safety

### Input Types
- All data passed to server actions **MUST** have explicit TypeScript types
- **DO NOT** use the `FormData` TypeScript type as the parameter type
- Define clear interfaces or types for your inputs

```tsx
// ❌ WRONG
export async function createLink(formData: FormData) { ... }

// ✅ CORRECT
interface CreateLinkInput {
  url: string;
  customSlug?: string;
  expiresAt?: Date;
}

export async function createLink(input: CreateLinkInput) { ... }
```

### Return Types
- Always define explicit return types for server actions
- Use discriminated unions for success/error states

```tsx
type ActionResult<T> = 
  | { success: true; data: T }
  | { success: false; error: string };

export async function createLink(
  input: CreateLinkInput
): Promise<ActionResult<Link>> {
  // ...
}
```

## Data Validation

All input data **MUST** be validated using Zod before processing:

```tsx
import { z } from "zod";

const createLinkSchema = z.object({
  url: z.string().url("Invalid URL"),
  customSlug: z.string().min(3).max(50).optional(),
  expiresAt: z.date().optional(),
});

export async function createLink(input: CreateLinkInput) {
  // Validate input
  const validationResult = createLinkSchema.safeParse(input);
  
  if (!validationResult.success) {
    return {
      success: false,
      error: validationResult.error.issues[0].message,
    };
  }
  
  const validData = validationResult.data;
  // Continue with validated data...
}
```

## Authentication

All server actions **MUST** check for a logged-in user before performing database operations:

```tsx
import { auth } from "@clerk/nextjs/server";

export async function createLink(input: CreateLinkInput) {
  // Check authentication first
  const { userId } = await auth();
  
  if (!userId) {
    return { success: false, error: "Unauthorized" };
  }
  
  // Validate input
  // ...
  
  // Perform database operation
  // ...
}
```

## Database Operations

Server actions **MUST NOT** directly use Drizzle queries. Instead, use helper functions from the `/data` directory:

```tsx
// ❌ WRONG - Direct Drizzle query in server action
import { db } from "@/db";
import { links } from "@/db/schema";

export async function createLink(input: CreateLinkInput) {
  const { userId } = await auth();
  // ...
  
  const newLink = await db.insert(links).values({
    url: input.url,
    userId,
  }).returning();
  
  return { success: true, data: newLink[0] };
}

// ✅ CORRECT - Using helper function
import { insertLink } from "@/data/links";

export async function createLink(input: CreateLinkInput) {
  const { userId } = await auth();
  // ...
  
  const newLink = await insertLink({
    url: validData.url,
    userId,
  });
  
  return { success: true, data: newLink };
}
```

### Data Helper Functions

Create helper functions in `/data` directory that wrap Drizzle queries:

```tsx
// data/links.ts
import { db } from "@/db";
import { links } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function insertLink(data: InsertLink) {
  const [newLink] = await db.insert(links).values(data).returning();
  return newLink;
}

export async function getLinksByUserId(userId: string) {
  return db.select().from(links).where(eq(links.userId, userId));
}

export async function deleteLink(linkId: string, userId: string) {
  return db
    .delete(links)
    .where(eq(links.id, linkId).and(eq(links.userId, userId)))
    .returning();
}
```

## Complete Example

```tsx
// app/dashboard/actions.ts
"use server";

import { auth } from "@clerk/nextjs/server";
import { z } from "zod";
import { insertLink, deleteLink } from "@/data/links";

// Define input type
interface CreateLinkInput {
  url: string;
  customSlug?: string;
}

// Define validation schema
const createLinkSchema = z.object({
  url: z.string().url("Invalid URL"),
  customSlug: z.string().min(3).max(50).optional(),
});

// Define return type
type ActionResult<T> = 
  | { success: true; data: T }
  | { success: false; error: string };

export async function createLink(
  input: CreateLinkInput
): Promise<ActionResult<Link>> {
  // 1. Check authentication
  const { userId } = await auth();
  if (!userId) {
    return { success: false, error: "Unauthorized" };
  }
  
  // 2. Validate input
  const validationResult = createLinkSchema.safeParse(input);
  if (!validationResult.success) {
    return {
      success: false,
      error: validationResult.error.issues[0].message,
    };
  }
  
  // 3. Use helper function for database operation
  try {
    const newLink = await insertLink({
      url: validationResult.data.url,
      customSlug: validationResult.data.customSlug,
      userId,
    });
    
    return { success: true, data: newLink };
  } catch (error) {
    return { success: false, error: "Failed to create link" };
  }
}
```

## Checklist

Before committing server actions, ensure:

- [ ] File is named `actions.ts` and colocated with component
- [ ] "use server" directive is at the top of the file
- [ ] Server action is called from a client component
- [ ] Input has explicit TypeScript types (not FormData)
- [ ] Input is validated using Zod
- [ ] Authentication is checked with Clerk's `auth()`
- [ ] Database operations use helper functions from `/data`
- [ ] Return type is explicitly defined
- [ ] Error handling is implemented
- [ ] Success/error states are clear

---

Following these guidelines ensures consistent, secure, and maintainable server actions throughout the application.
