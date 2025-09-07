PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_gallery` (
	`createdAt` integer NOT NULL,
	`updatedAt` integer NOT NULL,
	`updateCounter` integer DEFAULT 0,
	`id` text PRIMARY KEY NOT NULL,
	`imageUrl` text(600) NOT NULL,
	`description` text(1000)
);
--> statement-breakpoint
INSERT INTO `__new_gallery`("createdAt", "updatedAt", "updateCounter", "id", "imageUrl", "description") SELECT "createdAt", "updatedAt", "updateCounter", "id", "imageUrl", "description" FROM `gallery`;--> statement-breakpoint
DROP TABLE `gallery`;--> statement-breakpoint
ALTER TABLE `__new_gallery` RENAME TO `gallery`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE INDEX `gallery_image_idx` ON `gallery` (`imageUrl`);