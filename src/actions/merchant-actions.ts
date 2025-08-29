"use server";

import { z } from "zod";
import { createMerchant, deleteMerchant, getMerchant, getMerchants, updateMerchant } from "@/server/merchants";
import { ZSAError, createServerAction } from "zsa";
import { uploadToR2 } from "@/lib/s3";

// Update merchant schema
const updateMerchantSchema = z.object({
  merchantId: z.string().min(1, "Merchant ID is required"),
  name: z.string().min(1, "Name is required").max(100, "Name is too long").optional(),
  description: z.string().max(1000, "Description is too long").optional(),
  logo: z.instanceof(File)
    .refine(file => file.type.startsWith("image/"), {
      message: "Only image files are allowed",
    })
    .refine(file => file.size <= 2 * 1024 * 1024, {
      message: "File must be 2MB or smaller",
    })
    .optional(),
});

const deleteMerchantSchema = z.object({
  merchantId: z.string().min(1, "Merchant ID is required"),
});

const getMerchantSchema = z.object({
  merchantId: z.string().min(1, "Merchant ID is required"),
});

const createMerchantSchema = z.object({
  name: z.string().min(1, "Name is required").max(100, "Name is too long"),
  description: z.string().max(1000, "Description is too long").optional(),
  logo: z.instanceof(File)
    .refine(file => file.type.startsWith("image/"), {
      message: "Only image files are allowed",
    })
    .refine(file => file.size <= 2 * 1024 * 1024, {
      message: "File must be 2MB or smaller",
    })
    .optional(),
});

export const createMerchantAction = createServerAction()
  .input(createMerchantSchema)
  .handler(async ({ input }) => {
    try {
      let logoUrl;
      if(input.logo) logoUrl = await uploadToR2(input.logo)
      const result = await createMerchant({...input, logoUrl});
      return { success: true, data: result };
    } catch (error) {
      console.error("Failed to create merchant:", error);

      if (error instanceof ZSAError) {
        throw error;
      }

      throw new ZSAError(
        "INTERNAL_SERVER_ERROR",
        "Failed to create merchant"
      );
    }
  });

/**
 * Update merchant details server action
 */
export const updateMerchantAction = createServerAction()
  .input(updateMerchantSchema)
  .handler(async ({ input }) => {
    try {
      let logoUrl;
      if(input.logo) logoUrl = await uploadToR2(input.logo)
      const result = await updateMerchant({...input, logoUrl: logoUrl});
      return { success: true, data: result };
    } catch (error) {
      console.error("Failed to update merchant:", error);

      if (error instanceof ZSAError) {
        throw error;
      }

      throw new ZSAError(
        "INTERNAL_SERVER_ERROR",
        "Failed to update merchant"
      );
    }
  });

/**
 * Delete merchant server action
 */
export const deleteMerchantAction = createServerAction()
  .input(deleteMerchantSchema)
  .handler(async ({ input }) => {
    try {
      await deleteMerchant(input.merchantId);
      return { success: true };
    } catch (error) {
      console.error("Failed to delete merchant:", error);

      if (error instanceof ZSAError) {
        throw error;
      }

      throw new ZSAError(
        "INTERNAL_SERVER_ERROR",
        "Failed to delete merchant"
      );
    }
  });

/**
 * Get all merchants for the current user
 */
export const getMerchantsAction = createServerAction()
  .handler(async () => {
    try {
      const merchants = await getMerchants();
      return { success: true, data: merchants };
    } catch (error) {
      console.error("Failed to get user merchants:", error);

      if (error instanceof ZSAError) {
        throw error;
      }

      throw new ZSAError(
        "INTERNAL_SERVER_ERROR",
        "Failed to get user merchants"
      );
    }
  });

/**
 * Get a merchant by ID
 */
export const getMerchantAction = createServerAction()
  .input(getMerchantSchema)
  .handler(async ({ input }) => {
    try {
      const merchant = await getMerchant(input.merchantId);
      return { success: true, data: merchant };
    } catch (error) {
      console.error(`Failed to get merchant ${input.merchantId}:`, error);

      if (error instanceof ZSAError) {
        throw error;
      }

      throw new ZSAError(
        "INTERNAL_SERVER_ERROR",
        "Failed to get merchant"
      );
    }
  });
