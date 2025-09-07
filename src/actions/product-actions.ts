"use server";

import { z } from "zod";
import { createProduct, deleteProduct, getProduct, getProducts, updateProduct } from "@/server/products";
import { ZSAError, createServerAction } from "zsa";
import { uploadToR2 } from "@/lib/s3";
import { MAX_IMAGE_SIZE } from "@/constants";

// Update product schema
const updateProductSchema = z.object({
  productId: z.string().min(1, "Product ID is required"),
  merchantId: z.string().min(1, "Merchant ID is required"),
  name: z.string().min(1, "Name is required").max(100, "Name is too long").optional(),
  description: z.string().min(1, "Description is required").max(1000, "Description is too long").optional(),
  url: z.string().url("Must be a valid URL").optional(),
  priceCents: z.number().int("Must be an integer").nonnegative("Must be ≥ 0").optional(),
  image: z.instanceof(File)
    .refine(file => file.type.startsWith("image/"), {
      message: "Only image files are allowed",
    })
    .refine(file => file.size <= MAX_IMAGE_SIZE, {
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
  description: z.string().min(1, "Description is required").max(1000, "Description is too long"),
  merchantId: z.string().min(1, "Merchant ID is required"),
  url: z.string().url("Must be a valid URL"),
  priceCents: z.number().int("Must be an integer").nonnegative("Must be ≥ 0"),
  image: z.instanceof(File)
    .refine(file => file.type.startsWith("image/"), {
      message: "Only image files are allowed",
    })
    .refine(file => file.size <= MAX_IMAGE_SIZE, {
      message: "File must be 2MB or smaller",
    })
    .optional(),
});

const getProductsSchema = z.object({
  merchantId: z.string().min(1).optional(),
});

export const createProductAction = createServerAction()
  .input(createProductSchema)
  .handler(async ({ input }) => {
    try {
      let imageUrl;
      if(input.image) imageUrl = await uploadToR2(input.image)
      const result = await createProduct({...input, imageUrl});
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
      let imageUrl;
      if(input.image) imageUrl = await uploadToR2(input.image)
      const result = await updateProduct({
        merchantId: input.merchantId,
        productId: input.productId,
        name: input.name,
        description: input.description,
        url: input.url,
        priceCents: input.priceCents,
        imageUrl: imageUrl
      });
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
  .input(getProductsSchema)
  .handler(async ({input}) => {
    try {
      const products = await getProducts(input?.merchantId);
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
