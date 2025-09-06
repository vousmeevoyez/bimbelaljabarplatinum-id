"use server";

import { z } from "zod";
import { createGallery, deleteGallery, getGallery, getGalleries, updateGallery } from "@/server/gallery";
import { ZSAError, createServerAction } from "zsa";
import { uploadToR2 } from "@/lib/s3";
import { MAX_IMAGE_SIZE } from "@/constants";

// Define schemas inline to avoid FileList issues
const createGallerySchema = z.object({
  description: z.string().max(1000, "Description is too long").optional(),
  image: z.instanceof(File)
    .refine(file => file.type.startsWith("image/"), {
      message: "Only image files are allowed",
    })
    .refine(file => file.size <= MAX_IMAGE_SIZE, {
      message: "File must be 2MB or smaller",
    }),
});

const updateGallerySchema = z.object({
  galleryId: z.string().min(1, "Gallery ID is required"),
  description: z.string().max(1000, "Description is too long").optional(),
  image: z.instanceof(File)
    .refine(file => file.type.startsWith("image/"), {
      message: "Only image files are allowed",
    })
    .refine(file => file.size <= MAX_IMAGE_SIZE, {
      message: "File must be 2MB or smaller",
    })
    .optional(),
});

const deleteGallerySchema = z.object({
  galleryId: z.string().min(1, "Gallery ID is required"),
});

const getGallerySchema = z.object({
  galleryId: z.string().min(1, "Gallery ID is required"),
});

const getGalleriesSchema = z.object({
  limit: z.number().int().positive().max(100).optional(),
});

export const createGalleryAction = createServerAction()
  .input(createGallerySchema)
  .handler(async ({ input }) => {
    try {
      const imageUrl = await uploadToR2(input.image);
      const result = await createGallery({
        description: input.description,
        imageUrl,
      });
      return { success: true, data: result };
    } catch (error) {
      console.error("Failed to create gallery item:", error);

      if (error instanceof ZSAError) {
        throw error;
      }

      throw new ZSAError(
        "INTERNAL_SERVER_ERROR",
        "Failed to create gallery item"
      );
    }
  });

export const updateGalleryAction = createServerAction()
  .input(updateGallerySchema)
  .handler(async ({ input }) => {
    try {
      let imageUrl;
      if (input.image) {
        imageUrl = await uploadToR2(input.image);
      }

      const result = await updateGallery({
        galleryId: input.galleryId,
        description: input.description,
        imageUrl,
      });
      return { success: true, data: result };
    } catch (error) {
      console.error("Failed to update gallery item:", error);

      if (error instanceof ZSAError) {
        throw error;
      }

      throw new ZSAError(
        "INTERNAL_SERVER_ERROR",
        "Failed to update gallery item"
      );
    }
  });

export const deleteGalleryAction = createServerAction()
  .input(deleteGallerySchema)
  .handler(async ({ input }) => {
    try {
      await deleteGallery(input.galleryId);
      return { success: true };
    } catch (error) {
      console.error("Failed to delete gallery item:", error);

      if (error instanceof ZSAError) {
        throw error;
      }

      throw new ZSAError(
        "INTERNAL_SERVER_ERROR",
        "Failed to delete gallery item"
      );
    }
  });

export const getGalleryAction = createServerAction()
  .input(getGallerySchema)
  .handler(async ({ input }) => {
    try {
      const gallery = await getGallery(input.galleryId);
      return { success: true, data: gallery };
    } catch (error) {
      console.error(`Failed to get gallery item ${input.galleryId}:`, error);

      if (error instanceof ZSAError) {
        throw error;
      }

      throw new ZSAError(
        "INTERNAL_SERVER_ERROR",
        "Failed to get gallery item"
      );
    }
  });

export const getGalleriesAction = createServerAction()
  .input(getGalleriesSchema)
  .handler(async ({ input }) => {
    try {
      const galleries = await getGalleries(input);
      return { success: true, data: galleries };
    } catch (error) {
      console.error("Failed to get gallery items:", error);

      if (error instanceof ZSAError) {
        throw error;
      }

      throw new ZSAError(
        "INTERNAL_SERVER_ERROR",
        "Failed to get gallery items"
      );
    }
  });
