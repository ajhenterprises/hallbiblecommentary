CREATE TABLE `inquiries` (
	`id` text PRIMARY KEY NOT NULL,
	`kind` text NOT NULL,
	`name` text NOT NULL,
	`email` text NOT NULL,
	`organization` text DEFAULT '' NOT NULL,
	`event_date` text,
	`location` text DEFAULT '' NOT NULL,
	`message` text NOT NULL,
	`status` text DEFAULT 'new' NOT NULL,
	`rate_key` text NOT NULL,
	`created_at` text NOT NULL
);
--> statement-breakpoint
CREATE INDEX `inquiry_rate` ON `inquiries` (`rate_key`,`created_at`);--> statement-breakpoint
ALTER TABLE `sermons` ADD `description` text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE `sermons` ADD `related` text DEFAULT '[]' NOT NULL;--> statement-breakpoint
ALTER TABLE `sermons` ADD `video_url` text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE `sermons` ADD `audio_url` text DEFAULT '' NOT NULL;