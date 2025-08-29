CREATE TABLE `merchant` (
	`createdAt` integer NOT NULL,
	`updatedAt` integer NOT NULL,
	`updateCounter` integer DEFAULT 0,
	`id` text PRIMARY KEY NOT NULL,
	`name` text(255) NOT NULL,
	`slug` text(100) NOT NULL,
	`logoUrl` text(600)
);
--> statement-breakpoint
CREATE INDEX `merchant_name_idx` ON `merchant` (`name`);--> statement-breakpoint
CREATE UNIQUE INDEX `merchant_slug_uq` ON `merchant` (`slug`);--> statement-breakpoint
CREATE TABLE `product` (
	`createdAt` integer NOT NULL,
	`updatedAt` integer NOT NULL,
	`updateCounter` integer DEFAULT 0,
	`id` text PRIMARY KEY NOT NULL,
	`merchantId` text NOT NULL,
	`name` text(255) NOT NULL,
	`slug` text(150) NOT NULL,
	`priceCents` integer NOT NULL,
	FOREIGN KEY (`merchantId`) REFERENCES `merchant`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `product_merchant_idx` ON `product` (`merchantId`);--> statement-breakpoint
CREATE INDEX `product_name_idx` ON `product` (`name`);--> statement-breakpoint
CREATE UNIQUE INDEX `product_merchant_slug_uq` ON `product` (`merchantId`,`slug`);