import "server-only";
import { getDB } from "@/db";
import { galleryTable } from "@/db/schema";
import { ZSAError } from "zsa";
import { eq, desc } from "drizzle-orm";
import type { Gallery } from "@/db/schema";

/**
 * Create a new gallery item
 */
export async function createGallery(params: {
  description?: string;
  imageUrl: string;
}) {
  const db = getDB();

  // Insert the gallery item
  const newGallery = await db.insert(galleryTable).values({
    description: params.description,
    imageUrl: params.imageUrl,
  }).returning();

  const gallery = newGallery?.[0];

  if (!gallery) {
    throw new ZSAError("ERROR", "Could not create gallery item");
  }

  const galleryId = gallery.id;

  return {
    description: params.description,
    imageUrl: params.imageUrl,
    galleryId,
  };
}

/**
 * Update a gallery item's details
 */
export async function updateGallery(params: {
  galleryId: string;
  description?: string;
  imageUrl?: string;
}) {
  const { galleryId } = params;
  const db = getDB();

  const currentGallery = await db.query.galleryTable.findFirst({
    where: eq(galleryTable.id, galleryId),
  });

  if (!currentGallery) {
    throw new ZSAError("NOT_FOUND", "Gallery item not found");
  }

  // Update gallery item
  await db.update(galleryTable)
    .set({
      description: params.description,
      imageUrl: params.imageUrl,
    })
    .where(eq(galleryTable.id, galleryId));

  return params;
}

/**
 * Delete a gallery item
 */
export async function deleteGallery(galleryId: string) {
  const db = getDB();

  const currentGallery = await db.query.galleryTable.findFirst({
    where: eq(galleryTable.id, galleryId),
  });

  if (!currentGallery) {
    throw new ZSAError("NOT_FOUND", "Gallery item not found");
  }

  // Delete gallery item
  await db.delete(galleryTable).where(eq(galleryTable.id, galleryId));

  return { success: true };
}

/**
 * Get a gallery item by ID
 */
export async function getGallery(galleryId: string): Promise<Gallery> {
  const db = getDB();

  const gallery = await db.query.galleryTable.findFirst({
    where: eq(galleryTable.id, galleryId),
  });

  if (!gallery) {
    throw new ZSAError("NOT_FOUND", "Gallery item not found");
  }

  return gallery;
}

/**
 * Get all gallery items
 */
export async function getGalleries(params?: {
  limit?: number;
}): Promise<Gallery[]> {
  const db = getDB();

  const galleries = await db.query.galleryTable.findMany({
    columns: {
      id: true,
      description: true,
      imageUrl: true,
      createdAt: true,
      updatedAt: true,
      updateCounter: true,
    },
    orderBy: [desc(galleryTable.createdAt)],
    limit: params?.limit,
  });

  return galleries;
}
