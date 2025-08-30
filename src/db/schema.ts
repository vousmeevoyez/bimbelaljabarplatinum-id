import { sqliteTable, integer, text, index, unique } from "drizzle-orm/sqlite-core";
import { relations, sql } from "drizzle-orm";
import { type InferSelectModel } from "drizzle-orm";

import { createId } from '@paralleldrive/cuid2'

export const ROLES_ENUM = {
  ADMIN: 'admin',
  USER: 'user',
} as const;

const roleTuple = Object.values(ROLES_ENUM) as [string, ...string[]];

const commonColumns = {
  createdAt: integer({
    mode: "timestamp",
  }).$defaultFn(() => new Date()).notNull(),
  updatedAt: integer({
    mode: "timestamp",
  }).$onUpdateFn(() => new Date()).notNull(),
  updateCounter: integer().default(0).$onUpdate(() => sql`updateCounter + 1`),
}

export const userTable = sqliteTable("user", {
  ...commonColumns,
  id: text().primaryKey().$defaultFn(() => `usr_${createId()}`).notNull(),
  firstName: text({
    length: 255,
  }),
  lastName: text({
    length: 255,
  }),
  email: text({
    length: 255,
  }).unique(),
  passwordHash: text(),
  role: text({
    enum: roleTuple,
  }).default(ROLES_ENUM.USER).notNull(),
  emailVerified: integer({
    mode: "timestamp",
  }),
  signUpIpAddress: text({
    length: 100,
  }),
  googleAccountId: text({
    length: 255,
  }),
  /**
   * This can either be an absolute or relative path to an image
   */
  avatar: text({
    length: 600,
  }),
  // Credit system fields
  currentCredits: integer().default(0).notNull(),
  lastCreditRefreshAt: integer({
    mode: "timestamp",
  }),
}, (table) => ([
  index('email_idx').on(table.email),
  index('google_account_id_idx').on(table.googleAccountId),
  index('role_idx').on(table.role),
]));

export const passKeyCredentialTable = sqliteTable("passkey_credential", {
  ...commonColumns,
  id: text().primaryKey().$defaultFn(() => `pkey_${createId()}`).notNull(),
  userId: text().notNull().references(() => userTable.id),
  credentialId: text({
    length: 255,
  }).notNull().unique(),
  credentialPublicKey: text({
    length: 255,
  }).notNull(),
  counter: integer().notNull(),
  // Optional array of AuthenticatorTransport as JSON string
  transports: text({
    length: 255,
  }),
  // Authenticator Attestation GUID. We use this to identify the device/authenticator app that created the passkey
  aaguid: text({
    length: 255,
  }),
  // The user agent of the device that created the passkey
  userAgent: text({
    length: 255,
  }),
  // The IP address that created the passkey
  ipAddress: text({
    length: 100,
  }),
}, (table) => ([
  index('user_id_idx').on(table.userId),
  index('credential_id_idx').on(table.credentialId),
]));



export const userRelations = relations(userTable, ({ many }) => ({
  passkeys: many(passKeyCredentialTable),
}));

export const passKeyCredentialRelations = relations(passKeyCredentialTable, ({ one }) => ({
  user: one(userTable, {
    fields: [passKeyCredentialTable.userId],
    references: [userTable.id],
  }),
}));

// custom
// --- merchants ---
export const merchantTable = sqliteTable(
  "merchant",
  {
    ...commonColumns,
    id: text().primaryKey().$defaultFn(() => `mer_${createId()}`).notNull(),
    name: text({ length: 255 }).notNull(),
    description: text({ length: 255 }),
    slug: text({ length: 100 }).notNull(), // public, unique
    logoUrl: text({ length: 600 }),
  },
  (table) => ({
    nameIdx: index("merchant_name_idx").on(table.name),
    slugUq: unique("merchant_slug_uq").on(table.slug), // globally unique slug
  })
);

export const productTable = sqliteTable(
  "product",
  {
    ...commonColumns,
    id: text().primaryKey().$defaultFn(() => `prod_${createId()}`).notNull(),
    merchantId: text().notNull().references(() => merchantTable.id, { onDelete: "cascade" }),
    name: text({ length: 255 }).notNull(),
    description: text({ length: 255 }).notNull(),
    url: text({ length: 255 }).notNull(),
    slug: text({ length: 150 }).notNull(), // per-merchant slug
    priceCents: integer().notNull(),
  },
  (table) => ({
    merchantIdx: index("product_merchant_idx").on(table.merchantId),
    nameIdx: index("product_name_idx").on(table.name),
    merchantSlugUq: unique("product_merchant_slug_uq").on(table.merchantId, table.slug), // unique per merchant
  })
);

// define relations AFTER both tables are declared
export const merchantRelations = relations(merchantTable, ({ many }) => ({
  products: many(productTable),
}));

export const productRelations = relations(productTable, ({ one }) => ({
  merchant: one(merchantTable, {
    fields: [productTable.merchantId],
    references: [merchantTable.id],
  }),
}));

// --- (optional) handy types ---
export type Merchant = InferSelectModel<typeof merchantTable>;
export type Product = InferSelectModel<typeof productTable>;

export type User = InferSelectModel<typeof userTable>;
export type PassKeyCredential = InferSelectModel<typeof passKeyCredentialTable>;
