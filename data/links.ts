import { db } from "@/db";
import { links, type NewLink } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { and } from "drizzle-orm";

/**
 * Fetches all links for a specific user
 * @param userId - The authenticated user's ID from Clerk
 * @returns Array of links belonging to the user
 */
export async function getUserLinks(userId: string) {
  // Return links ordered by updatedAt descending (latest first)
  return await db
    .select()
    .from(links)
    .where(eq(links.userId, userId))
    .orderBy(desc(links.updatedAt));
}

/**
 * Inserts a new link into the database
 * @param data - The link data to insert
 * @returns The newly created link
 */
export async function insertLink(data: NewLink) {
  const [newLink] = await db.insert(links).values(data).returning();
  return newLink;
}

/**
 * Updates an existing link in the database
 * @param id - The link's id
 * @param userId - The authenticated user's ID
 * @param url - The new URL
 * @param shortCode - The new short code
 * @returns The updated link
 */
export async function updateLink({ id, userId, url, shortCode }: { id: number; userId: string; url: string; shortCode: string }) {
  // Verify ownership first
  const [existing] = await db
    .select()
    .from(links)
    .where(and(eq(links.id, id), eq(links.userId, userId)));
  if (!existing) {
    return null;
  }
  const [updatedLink] = await db
    .update(links)
    .set({ url, shortCode, updatedAt: new Date() })
    .where(and(eq(links.id, id), eq(links.userId, userId)))
    .returning();
  return updatedLink;
}

/**
 * Deletes a link by ID, ensuring the user owns the link
 * @param id - The link's id
 * @param userId - The authenticated user's ID
 * @returns true if deleted, false if not found or not owned
 */
export async function deleteLinkById(id: number, userId: string): Promise<boolean> {
  // Check ownership
  const [existing] = await db
    .select()
    .from(links)
    .where(and(eq(links.id, id), eq(links.userId, userId)));
  if (!existing) {
    return false;
  }
  await db.delete(links).where(and(eq(links.id, id), eq(links.userId, userId)));
  return true;
}