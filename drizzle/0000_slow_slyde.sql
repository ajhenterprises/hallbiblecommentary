CREATE TABLE `audit` (
	`id` text PRIMARY KEY NOT NULL,
	`actor` text NOT NULL,
	`action` text NOT NULL,
	`record_id` text NOT NULL,
	`created_at` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `content` (
	`id` text PRIMARY KEY NOT NULL,
	`kind` text NOT NULL,
	`title` text NOT NULL,
	`slug` text NOT NULL,
	`body` text NOT NULL,
	`excerpt` text DEFAULT '' NOT NULL,
	`status` text DEFAULT 'draft' NOT NULL,
	`entry_type` text DEFAULT 'range' NOT NULL,
	`book` text,
	`chapter` integer,
	`verse_start` integer,
	`verse_end` integer,
	`topics` text DEFAULT '[]' NOT NULL,
	`people` text DEFAULT '[]' NOT NULL,
	`series` text DEFAULT '' NOT NULL,
	`categories` text DEFAULT '[]' NOT NULL,
	`related` text DEFAULT '[]' NOT NULL,
	`sermon_id` text,
	`provenance` text DEFAULT '[]' NOT NULL,
	`generated_body` text,
	`publish_date` text,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL,
	`revision` integer DEFAULT 1 NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `content_slug_unique` ON `content` (`slug`);--> statement-breakpoint
CREATE INDEX `content_public` ON `content` (`status`,`kind`,`publish_date`);--> statement-breakpoint
CREATE INDEX `content_location` ON `content` (`book`,`chapter`);--> statement-breakpoint
CREATE TABLE `sermons` (
	`id` text PRIMARY KEY NOT NULL,
	`title` text NOT NULL,
	`passage` text NOT NULL,
	`series` text DEFAULT '' NOT NULL,
	`preached_at` text,
	`tags` text DEFAULT '[]' NOT NULL,
	`text` text NOT NULL,
	`upload_key` text,
	`filename` text,
	`status` text DEFAULT 'private' NOT NULL,
	`created_at` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `taxonomy` (
	`id` text PRIMARY KEY NOT NULL,
	`kind` text NOT NULL,
	`name` text NOT NULL
);
--> statement-breakpoint
CREATE INDEX `taxonomy_kind` ON `taxonomy` (`kind`);--> statement-breakpoint
CREATE TABLE `verse_mappings` (
	`content_id` text NOT NULL,
	`book` text NOT NULL,
	`chapter` integer NOT NULL,
	`start` integer NOT NULL,
	`end` integer NOT NULL,
	FOREIGN KEY (`content_id`) REFERENCES `content`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `verse_lookup` ON `verse_mappings` (`book`,`chapter`,`start`,`end`);