"use server";

import { auth } from "@clerk/nextjs/server";
import { z } from "zod";
import { insertLink, updateLink } from "@/data/links";
import type { Link } from "@/db/schema";

const createLinkSchema = z.object({
  url: z.string().url("Invalid URL format"),
  shortCode: z
    .string()
    .min(3, "Short code must be at least 3 characters")
    .max(20, "Short code must be at most 20 characters")
    .regex(
      /^[a-zA-Z0-9-_]+$/,
      "Short code can only contain letters, numbers, hyphens, and underscores"
    ),
});

const editLinkSchema = createLinkSchema.extend({
  id: z.number(),
});

interface CreateLinkInput {
  url: string;
  shortCode: string;
}

interface EditLinkInput {
  id: number;
  url: string;
  shortCode: string;
}

type ActionResult<T> =
  | { success: true; data: T }
  | { success: false; error: string };

/**
 * Server action to create a new shortened link
 * @param input - The link data including URL and custom short code
 * @returns ActionResult with created link or error message
 */
export async function createLink(
  input: CreateLinkInput
): Promise<ActionResult<Link>> {
  // Check authentication first
  const { userId } = await auth();

  if (!userId) {
    return { success: false, error: "Unauthorized" };
  }

  // Validate input
  const validationResult = createLinkSchema.safeParse(input);

  if (!validationResult.success) {
    return {
      success: false,
      error: validationResult.error.issues[0].message,
    };
  }

  const validData = validationResult.data;

  try {
    // Insert the new link
    const newLink = await insertLink({
      userId,
      url: validData.url,
      shortCode: validData.shortCode,
    });

    return { success: true, data: newLink };
  } catch (error) {
    // Handle database errors (e.g., duplicate short code)
    if (error instanceof Error) {
      if (error.message.includes("unique")) {
        return {
          success: false,
          error: "This short code is already in use. Please try another one.",
        };
      }
      return { success: false, error: error.message };
    }
    return { success: false, error: "Failed to create link" };
  }
}

/**
 * Server action to edit an existing link
 * @param input - The link data including id, URL, and short code
 * @returns ActionResult with updated link or error message
 */
export async function editLink(
  input: EditLinkInput
): Promise<ActionResult<Link>> {
  const { userId } = await auth();
  if (!userId) {
    return { success: false, error: "Unauthorized" };
  }

  // Validate input
  const validationResult = editLinkSchema.safeParse(input);
  if (!validationResult.success) {
    return {
      success: false,
      error: validationResult.error.issues[0].message,
    };
  }
  const validData = validationResult.data;

  try {
    const updatedLink = await updateLink({
      id: validData.id,
      userId,
      url: validData.url,
      shortCode: validData.shortCode,
    });
    if (!updatedLink) {
      return { success: false, error: "Link not found or not owned by user" };
    }
    return { success: true, data: updatedLink };
  } catch (error) {
    if (error instanceof Error) {
      if (error.message.includes("unique")) {
        return {
          success: false,
          error: "This short code is already in use. Please try another one.",
        };
      }
      return { success: false, error: error.message };
    }
    return { success: false, error: "Failed to update link" };
  }
}

const deleteLinkSchema = z.object({
  id: z.number(),
});

interface DeleteLinkInput {
  id: number;
}

/**
 * Server action to delete a link
 * @param input - The link id
 * @returns ActionResult with success or error message
 */
export async function deleteLinkAction(
  input: DeleteLinkInput
): Promise<ActionResult<null>> {
  const { userId } = await auth();
  if (!userId) {
    return { success: false, error: "Unauthorized" };
  }

  // Validate input
  const validationResult = deleteLinkSchema.safeParse(input);
  
  if (!validationResult.success) {
    return {
      success: false,
      error: validationResult.error.issues[0].message,
    };
  }
  const validData = validationResult.data;

  try {
    // Dynamically import and call deleteLinkById
    const linksModule = await import("@/data/links");
    const deleted = await linksModule.deleteLinkById(validData.id, userId);
    if (!deleted) {
      return { success: false, error: "Link not found or not owned by user" };
    }
    return { success: true, data: null };
  } catch (error) {
    if (error instanceof Error) {
      return { success: false, error: error.message };
    }
    return { success: false, error: "Failed to delete link" };
  }
}