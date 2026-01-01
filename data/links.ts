import { db } from "@/db";
import { links } from "@/db/schema";
import { eq } from "drizzle-orm";

/**
 * Fetches all links for a specific user
 * @param userId - The authenticated user's ID from Clerk
 * @returns Array of links belonging to the user
 */
export async function getUserLinks(userId: string) {
  return await db
    .select()
    .from(links)
    .where(eq(links.userId, userId));
}
