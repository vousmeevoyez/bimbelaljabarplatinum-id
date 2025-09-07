CREATE TABLE `gallery` (
	`createdAt` integer NOT NULL,
	`updatedAt` integer NOT NULL,
	`updateCounter` integer DEFAULT 0,
	`id` text PRIMARY KEY NOT NULL,
	`title` text(255) NOT NULL,
	`description` text(1000),
	`imageUrl` text(600) NOT NULL,
	`category` text(100),
	`tags` text(500),
	`isPublic` integer DEFAULT true NOT NULL,
	`userId` text NOT NULL,
	FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `gallery_user_idx` ON `gallery` (`userId`);--> statement-breakpoint
CREATE INDEX `gallery_category_idx` ON `gallery` (`category`);--> statement-breakpoint
CREATE INDEX `gallery_public_idx` ON `gallery` (`isPublic`);