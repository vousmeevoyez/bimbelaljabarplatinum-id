import "server-only";
import { getDB } from "@/db";
import { productTable} from "@/db/schema";
import { requireVerifiedEmail } from "@/utils/auth";
import { generateSlug } from "@/utils/slugify";
import { ZSAError } from "zsa";
import { createId } from "@paralleldrive/cuid2";
import { eq, and, not } from "drizzle-orm";
import { updateAllSessionsOfUser } from "@/utils/kv-session";
import type { Product } from "@/db/schema";

/**
 * Create a new product with the current user as owner
 */
export async function createProduct(
  params
: {
  name: string;
  description: string;
  merchantId: string;
  url: string;
  priceCents: number;
  imageUrl?: string;
}) {
  const { name } = params;
  // Verify user is authenticated
  const session = await requireVerifiedEmail();
  if (!session) {
    throw new ZSAError("NOT_AUTHORIZED", "Not authenticated");
  }

  const userId = session.userId;
  const db = getDB();

  // Generate unique slug for the product
  let slug = generateSlug(name);
  let slugIsUnique = false;
  let attempts = 0;

  // Make sure slug is unique
  while (!slugIsUnique && attempts < 5) {
    const existingProduct = await db.query.productTable.findFirst({
      where: eq(productTable.slug, slug),
    });

    if (!existingProduct) {
      slugIsUnique = true;
    } else {
      // Add a random suffix to make the slug unique
      slug = `${generateSlug(name)}-${createId().substring(0, 4)}`;
      attempts++;
    }
  }

  if (!slugIsUnique) {
    throw new ZSAError("ERROR", "Could not generate a unique slug for the product");
  }

  // Insert the product
  const newProduct = await db.insert(productTable).values({
    name: params.name,
    description: params.description,
    merchantId: params.merchantId,
    url: params.url,
    priceCents: params.priceCents,
    imageUrl: params.imageUrl || "",
    slug
  }).returning();

  const product = newProduct?.[0];

  if (!product) {
    throw new ZSAError("ERROR", "Could not create product");
  }

  const productId = product.id;

  // Update the user's session to include the new product
  await updateAllSessionsOfUser(userId);

  return {
    name: params.name,
    description: params.description,
    merchantId: params.merchantId,
    url: params.url,
    priceCents: params.priceCents,
    imageUrl: params.imageUrl,
    productId,
    slug,
  };
}

/**
 * Update a product's details
 */
export async function updateProduct(parameter
: {
  merchantId: string;
  productId: string;
  name?: string;
  description?: string;
  url?: string;
  priceCents?: number;
  imageUrl?: string;
}) {
  const {productId, name, imageUrl} = parameter;
  const db = getDB();

  // If name is being updated, check if we need to update the slug
  if (name) {
    const currentProduct = await db.query.productTable.findFirst({
      where: eq(productTable.id, productId),
    });

    if (currentProduct && currentProduct.name !== name) {
      // Generate new slug based on the new name
      let newSlug = generateSlug(name);
      let slugIsUnique = false;
      let attempts = 0;

      while (!slugIsUnique && attempts < 5) {
        const existingProduct = await db.query.productTable.findFirst({
          where: and(
            eq(productTable.slug, newSlug),
            // Make sure we don't check against our own product
            not(eq(productTable.id, productId))
          ),
        });

        if (!existingProduct) {
          slugIsUnique = true;
        } else {
          // Add a random suffix to make the slug unique
          newSlug = `${generateSlug(name)}-${createId().substring(0, 4)}`;
          attempts++;
        }
      }

      if (!slugIsUnique) {
        throw new ZSAError("ERROR", "Could not generate a unique slug for the product");
      }

      // Update product with new slug
      await db.update(productTable)
        .set({
          ...parameter,
          imageUrl,
          slug: newSlug,
        })
        .where(eq(productTable.id, productId));

      return { ...parameter, slug: newSlug };
    }
  }

  // Update product without changing slug
  await db.update(productTable)
    .set(parameter)
    .where(eq(productTable.id, productId));

  return parameter;
}

/**
 * Delete a product
 */
export async function deleteProduct(productId: string) {
  const db = getDB();

  // Delete product and related data
  // Note: In a real implementation, we might want to archive the product instead of deleting it
  await db.delete(productTable).where(eq(productTable.id, productId));

  return { success: true };
}

/**
 * Get a product by ID
 */
export async function getProduct(productId: string) {
  const db = getDB();

  const product = await db.query.productTable.findFirst({
    where: eq(productTable.id, productId),
    with: {
      merchant: { columns: { id: true, name: true, slug: true } },
    },
  });

  if (!product) {
    throw new ZSAError("NOT_FOUND", "Product not found");
  }

  return product;
}

/**
 * Get all products for current user
 */
export async function getProducts(merchantId?: string): Promise<Product[]> {
  const db = getDB();

  const products = await db.query.productTable.findMany({
    columns: { id: true, name: true, priceCents: true, slug: true, imageUrl: true, url: true, description: true },
    with: {
      merchant: { columns: { id: true, name: true, slug: true } },
    },
    where: merchantId
      ? (p, { eq }) => eq(p.merchantId, merchantId)
      : undefined,
  });

  return products as Product[]
}
