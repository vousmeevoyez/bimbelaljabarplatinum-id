"use server";

import { z } from "zod";
import { createProduct, deleteProduct, getProduct, getProducts, updateProduct } from "@/server/products";
import { ZSAError, createServerAction } from "zsa";
import { uploadToR2 } from "@/lib/s3";

// Update product schema
const updateProductSchema = z.object({
  productId: z.string().min(1, "Product ID is required"),
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

const deleteProductSchema = z.object({
  productId: z.string().min(1, "Product ID is required"),
});

const getProductSchema = z.object({
  productId: z.string().min(1, "Product ID is required"),
});

const createProductSchema = z.object({
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

export const createProductAction = createServerAction()
  .input(createProductSchema)
  .handler(async ({ input }) => {
    try {
      let logoUrl;
      if(input.logo) logoUrl = await uploadToR2(input.logo)
      const result = await createProduct({...input, logoUrl});
      return { success: true, data: result };
    } catch (error) {
      console.error("Failed to create product:", error);

      if (error instanceof ZSAError) {
        throw error;
      }

      throw new ZSAError(
        "INTERNAL_SERVER_ERROR",
        "Failed to create product"
      );
    }
  });

/**
 * Update product details server action
 */
export const updateProductAction = createServerAction()
  .input(updateProductSchema)
  .handler(async ({ input }) => {
    try {
      let logoUrl;
      if(input.logo) logoUrl = await uploadToR2(input.logo)
      const result = await updateProduct({...input, logoUrl: logoUrl});
      return { success: true, data: result };
    } catch (error) {
      console.error("Failed to update product:", error);

      if (error instanceof ZSAError) {
        throw error;
      }

      throw new ZSAError(
        "INTERNAL_SERVER_ERROR",
        "Failed to update product"
      );
    }
  });

/**
 * Delete product server action
 */
export const deleteProductAction = createServerAction()
  .input(deleteProductSchema)
  .handler(async ({ input }) => {
    try {
      await deleteProduct(input.productId);
      return { success: true };
    } catch (error) {
      console.error("Failed to delete product:", error);

      if (error instanceof ZSAError) {
        throw error;
      }

      throw new ZSAError(
        "INTERNAL_SERVER_ERROR",
        "Failed to delete product"
      );
    }
  });

/**
 * Get all products for the current user
 */
export const getProductsAction = createServerAction()
  .handler(async () => {
    try {
      const products = await getProducts();
      return { success: true, data: products };
    } catch (error) {
      console.error("Failed to get user products:", error);

      if (error instanceof ZSAError) {
        throw error;
      }

      throw new ZSAError(
        "INTERNAL_SERVER_ERROR",
        "Failed to get user products"
      );
    }
  });

/**
 * Get a product by ID
 */
export const getProductAction = createServerAction()
  .input(getProductSchema)
  .handler(async ({ input }) => {
    try {
      const product = await getProduct(input.productId);
      return { success: true, data: product };
    } catch (error) {
      console.error(`Failed to get product ${input.productId}:`, error);

      if (error instanceof ZSAError) {
        throw error;
      }

      throw new ZSAError(
        "INTERNAL_SERVER_ERROR",
        "Failed to get product"
      );
    }
  });
