import "server-only";
import { getDB } from "@/db";
import { merchantTable, productTable, type MerchantWithCount } from "@/db/schema";
import { requireVerifiedEmail } from "@/utils/auth";
import { generateSlug } from "@/utils/slugify";
import { ZSAError } from "zsa";
import { createId } from "@paralleldrive/cuid2";
import { sql, eq, and, not, getTableColumns } from "drizzle-orm";
import { updateAllSessionsOfUser } from "@/utils/kv-session";

/**
 * Create a new merchant with the current user as owner
 */
export async function createMerchant(
  params
: {
  name: string;
  description?: string;
  logoUrl?: string;
}) {
  const { name } = params;
  // Verify user is authenticated
  const session = await requireVerifiedEmail();
  if (!session) {
    throw new ZSAError("NOT_AUTHORIZED", "Not authenticated");
  }

  const userId = session.userId;
  const db = getDB();

  // Generate unique slug for the merchant
  let slug = generateSlug(name);
  let slugIsUnique = false;
  let attempts = 0;

  // Make sure slug is unique
  while (!slugIsUnique && attempts < 5) {
    const existingMerchant = await db.query.merchantTable.findFirst({
      where: eq(merchantTable.slug, slug),
    });

    if (!existingMerchant) {
      slugIsUnique = true;
    } else {
      // Add a random suffix to make the slug unique
      slug = `${generateSlug(name)}-${createId().substring(0, 4)}`;
      attempts++;
    }
  }

  if (!slugIsUnique) {
    throw new ZSAError("ERROR", "Could not generate a unique slug for the merchant");
  }

  // Insert the merchant
  const newMerchant = await db.insert(merchantTable).values({
    ...params,
    slug
  }).returning();

  const merchant = newMerchant?.[0];

  if (!merchant) {
    throw new ZSAError("ERROR", "Could not create merchant");
  }

  const merchantId = merchant.id;

  // Update the user's session to include the new merchant
  await updateAllSessionsOfUser(userId);

  return {
    ...params,
    merchantId,
    slug,
  };
}

/**
 * Update a merchant's details
 */
export async function updateMerchant(parameter
: {
  merchantId: string;
    name?: string;
    logoUrl?: string;
}) {
  const {merchantId, name, logoUrl} = parameter;
  const db = getDB();

  // If name is being updated, check if we need to update the slug
  if (name) {
    const currentMerchant = await db.query.merchantTable.findFirst({
      where: eq(merchantTable.id, merchantId),
    });

    if (currentMerchant && currentMerchant.name !== name) {
      // Generate new slug based on the new name
      let newSlug = generateSlug(name);
      let slugIsUnique = false;
      let attempts = 0;

      while (!slugIsUnique && attempts < 5) {
        const existingMerchant = await db.query.merchantTable.findFirst({
          where: and(
            eq(merchantTable.slug, newSlug),
            // Make sure we don't check against our own merchant
            not(eq(merchantTable.id, merchantId))
          ),
        });

        if (!existingMerchant) {
          slugIsUnique = true;
        } else {
          // Add a random suffix to make the slug unique
          newSlug = `${generateSlug(name)}-${createId().substring(0, 4)}`;
          attempts++;
        }
      }

      if (!slugIsUnique) {
        throw new ZSAError("ERROR", "Could not generate a unique slug for the merchant");
      }

      // Update merchant with new slug
      await db.update(merchantTable)
        .set({
          ...parameter,
        logoUrl,
          slug: newSlug,
        })
        .where(eq(merchantTable.id, merchantId));

      return { ...parameter, slug: newSlug };
    }
  }

  // Update merchant without changing slug
  await db.update(merchantTable)
    .set(parameter)
    .where(eq(merchantTable.id, merchantId));

  return parameter;
}

/**
 * Delete a merchant
 */
export async function deleteMerchant(merchantId: string) {
  const db = getDB();

  // Delete merchant and related data
  // Note: In a real implementation, we might want to archive the merchant instead of deleting it
  await db.delete(merchantTable).where(eq(merchantTable.id, merchantId));

  return { success: true };
}

/**
 * Get a merchant by ID
 */
export async function getMerchant(merchantId: string) {
  const db = getDB();

  const merchant = await db.query.merchantTable.findFirst({
    where: eq(merchantTable.id, merchantId),
  });

  if (!merchant) {
    throw new ZSAError("NOT_FOUND", "Merchant not found");
  }

  return merchant;
}

/**
 * Get all merchants for current user
 */
export async function getMerchants(): Promise<MerchantWithCount[]> {
  const db = getDB();
  const m = getTableColumns(merchantTable);

  const rows = await db
    .select({
      ...m,
      productCount: sql<number>`coalesce(count(${productTable.id}), 0)`,
    })
    .from(merchantTable)
    .leftJoin(productTable, eq(productTable.merchantId, merchantTable.id))
    .groupBy(...Object.values(m));

  return rows as MerchantWithCount[];
}
