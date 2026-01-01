import { db } from "@/db";
import { links, type NewLink } from "@/db/schema";
import { eq, desc } from "drizzle-orm";

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
