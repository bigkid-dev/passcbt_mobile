CREATE TABLE `app_settings` (
	`id` text PRIMARY KEY DEFAULT 'default' NOT NULL,
	`theme` text DEFAULT 'dark' NOT NULL,
	`is_subscribed` integer DEFAULT false NOT NULL,
	`offline_downloaded` integer DEFAULT false NOT NULL,
	`is_seeded` integer DEFAULT false NOT NULL,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `exam_results` (
	`id` text PRIMARY KEY NOT NULL,
	`exam_id` text NOT NULL,
	`user_id` text,
	`student_id` text,
	`student_class` text,
	`score` integer DEFAULT 0 NOT NULL,
	`total_questions` integer DEFAULT 40 NOT NULL,
	`date_taken` integer NOT NULL,
	`time_taken` integer DEFAULT 0 NOT NULL,
	`answer` text NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	`deleted_at` integer,
	`sync_status` text DEFAULT 'synced' NOT NULL,
	FOREIGN KEY (`exam_id`) REFERENCES `exams`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `exam_sessions` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text,
	`exam_id` text NOT NULL,
	`device_id` text,
	`started_at` integer NOT NULL,
	`expires_at` integer NOT NULL,
	`completed_at` integer,
	`score` integer,
	`time_taken` integer,
	`is_complete` integer DEFAULT false NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	`deleted_at` integer,
	`sync_status` text DEFAULT 'synced' NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`exam_id`) REFERENCES `exams`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `exam_session_user_exam_idx` ON `exam_sessions` (`user_id`,`exam_id`);--> statement-breakpoint
CREATE TABLE `exams` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text,
	`subject_id` text,
	`topic_id` text,
	`title` text NOT NULL,
	`class` text,
	`time_limit` integer DEFAULT 2400 NOT NULL,
	`start_time` integer,
	`end_time` integer,
	`completed_at` integer,
	`is_published` integer DEFAULT true NOT NULL,
	`is_completed` integer DEFAULT false NOT NULL,
	`time_taken` integer DEFAULT 0,
	`score` integer DEFAULT 0 NOT NULL,
	`total_question` integer DEFAULT 40 NOT NULL,
	`type` text DEFAULT 'STANDARD' NOT NULL,
	`answer_picked` text,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	`deleted_at` integer,
	`sync_status` text DEFAULT 'synced' NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`subject_id`) REFERENCES `subjects`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`topic_id`) REFERENCES `topics`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `leaderboard` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`display_name` text,
	`avatar_initials` text,
	`image_url` text,
	`points` integer DEFAULT 0 NOT NULL,
	`rank` integer DEFAULT 0 NOT NULL,
	`is_current_user` integer DEFAULT false NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	`deleted_at` integer,
	`sync_status` text DEFAULT 'synced' NOT NULL
);
--> statement-breakpoint
CREATE TABLE `note_contents` (
	`id` text PRIMARY KEY NOT NULL,
	`topic_id` text NOT NULL,
	`content` text DEFAULT '' NOT NULL,
	`summary` text DEFAULT '' NOT NULL,
	`key_terms` text DEFAULT '[]',
	`exam_tips` text DEFAULT '' NOT NULL,
	`memory_trick` text DEFAULT '' NOT NULL,
	`html` text,
	`calculations` text,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	`deleted_at` integer,
	`sync_status` text DEFAULT 'synced' NOT NULL,
	FOREIGN KEY (`topic_id`) REFERENCES `topics`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `note_sub_contents` (
	`id` text PRIMARY KEY NOT NULL,
	`note_content_id` text NOT NULL,
	`subtopic_id` text,
	`order` integer DEFAULT 1,
	`content` text DEFAULT '' NOT NULL,
	`summary` text DEFAULT '' NOT NULL,
	`key_terms` text DEFAULT '[]',
	`exam_tips` text DEFAULT '' NOT NULL,
	`memory_trick` text DEFAULT '' NOT NULL,
	`html` text,
	`type` text,
	`calculations` text,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	`deleted_at` integer,
	`sync_status` text DEFAULT 'synced' NOT NULL,
	FOREIGN KEY (`note_content_id`) REFERENCES `note_contents`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`subtopic_id`) REFERENCES `subtopics`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `progress` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`subject_id` text NOT NULL,
	`progress` integer DEFAULT 0 NOT NULL,
	`last_accessed` integer NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	`deleted_at` integer,
	`sync_status` text DEFAULT 'synced' NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`subject_id`) REFERENCES `subjects`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `questions` (
	`id` text PRIMARY KEY NOT NULL,
	`exam_id` text,
	`topic_id` text,
	`text` text NOT NULL,
	`options` text NOT NULL,
	`correct_answer` integer DEFAULT 0 NOT NULL,
	`instruction` text DEFAULT '' NOT NULL,
	`explanation` text DEFAULT '' NOT NULL,
	`fastest_solve` text,
	`tip` text,
	`type` text DEFAULT 'STANDARD' NOT NULL,
	`difficulty` text DEFAULT 'Easy' NOT NULL,
	`html` text,
	`year` integer DEFAULT 2024,
	`subject_name` text,
	`topic_name` text,
	`sub_topic` text,
	`board` text DEFAULT 'JAMB' NOT NULL,
	`is_calc` integer DEFAULT false NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	`deleted_at` integer,
	`sync_status` text DEFAULT 'synced' NOT NULL,
	FOREIGN KEY (`exam_id`) REFERENCES `exams`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`topic_id`) REFERENCES `topics`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `question_subject_idx` ON `questions` (`subject_name`);--> statement-breakpoint
CREATE INDEX `question_board_idx` ON `questions` (`board`);--> statement-breakpoint
CREATE INDEX `question_topic_id_idx` ON `questions` (`topic_id`);--> statement-breakpoint
CREATE TABLE `study_plan_items` (
	`id` text PRIMARY KEY NOT NULL,
	`study_plan_id` text NOT NULL,
	`topic_id` text NOT NULL,
	`date` integer NOT NULL,
	`duration` integer DEFAULT 30,
	`order` integer DEFAULT 1 NOT NULL,
	`notes` text,
	`completed` integer DEFAULT false NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	`deleted_at` integer,
	`sync_status` text DEFAULT 'synced' NOT NULL,
	FOREIGN KEY (`study_plan_id`) REFERENCES `study_plans`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`topic_id`) REFERENCES `topics`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `study_plans` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`subject_id` text NOT NULL,
	`syllabus_id` text NOT NULL,
	`title` text NOT NULL,
	`start_date` integer NOT NULL,
	`end_date` integer NOT NULL,
	`color` text DEFAULT '#3B82F6' NOT NULL,
	`completed` integer DEFAULT false NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	`deleted_at` integer,
	`sync_status` text DEFAULT 'synced' NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`subject_id`) REFERENCES `subjects`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`syllabus_id`) REFERENCES `syllabi`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `subjects` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`code` text NOT NULL,
	`color` text DEFAULT '#3E6AE1',
	`icon` text DEFAULT '📚',
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	`deleted_at` integer,
	`sync_status` text DEFAULT 'synced' NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `subjects_code_unique` ON `subjects` (`code`);--> statement-breakpoint
CREATE TABLE `subtopics` (
	`id` text PRIMARY KEY NOT NULL,
	`topic_id` text NOT NULL,
	`title` text NOT NULL,
	`order` integer DEFAULT 1,
	`content` text DEFAULT '' NOT NULL,
	`summary` text DEFAULT '' NOT NULL,
	`key_terms` text DEFAULT '[]',
	`exam_tips` text DEFAULT '' NOT NULL,
	`memory_trick` text DEFAULT '' NOT NULL,
	`html` text,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	`deleted_at` integer,
	`sync_status` text DEFAULT 'synced' NOT NULL,
	FOREIGN KEY (`topic_id`) REFERENCES `topics`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `subtopic_topic_id_idx` ON `subtopics` (`topic_id`);--> statement-breakpoint
CREATE TABLE `syllabi` (
	`id` text PRIMARY KEY NOT NULL,
	`title` text NOT NULL,
	`description` text,
	`order` integer DEFAULT 1,
	`subject_id` text NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	`deleted_at` integer,
	`sync_status` text DEFAULT 'synced' NOT NULL,
	FOREIGN KEY (`subject_id`) REFERENCES `subjects`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `sync_outbox` (
	`id` text PRIMARY KEY NOT NULL,
	`table` text NOT NULL,
	`row_id` text NOT NULL,
	`action` text NOT NULL,
	`payload` text NOT NULL,
	`attempts` integer DEFAULT 0 NOT NULL,
	`last_attempt_at` integer,
	`created_at` integer NOT NULL,
	`status` text DEFAULT 'pending' NOT NULL
);
--> statement-breakpoint
CREATE TABLE `topics` (
	`id` text PRIMARY KEY NOT NULL,
	`syllabus_id` text NOT NULL,
	`title` text NOT NULL,
	`content` text DEFAULT '' NOT NULL,
	`order` integer DEFAULT 1,
	`explanation` text DEFAULT '' NOT NULL,
	`memory_trick` text DEFAULT '' NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	`deleted_at` integer,
	`sync_status` text DEFAULT 'synced' NOT NULL,
	FOREIGN KEY (`syllabus_id`) REFERENCES `syllabi`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `topics_completed` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`topic_id` text NOT NULL,
	`subject_id` text,
	`is_complete` integer DEFAULT false NOT NULL,
	`completed_at` integer,
	`last_viewed` integer NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	`deleted_at` integer,
	`sync_status` text DEFAULT 'synced' NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`topic_id`) REFERENCES `topics`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`subject_id`) REFERENCES `subjects`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `user_topic_completion_idx` ON `topics_completed` (`user_id`,`topic_id`);--> statement-breakpoint
CREATE TABLE `user_subjects` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`subject_id` text NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	`deleted_at` integer,
	`sync_status` text DEFAULT 'synced' NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`subject_id`) REFERENCES `subjects`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `user_subject_unique_idx` ON `user_subjects` (`user_id`,`subject_id`);--> statement-breakpoint
CREATE TABLE `users` (
	`id` text PRIMARY KEY NOT NULL,
	`email` text,
	`first_name` text,
	`last_name` text,
	`phone_number` text,
	`has_onboarded` integer DEFAULT false NOT NULL,
	`last_active_at` integer,
	`total_study_minutes` integer DEFAULT 0 NOT NULL,
	`plan` text,
	`period` text,
	`paystack_customer_id` text,
	`subscription_code` text,
	`subscription_token` text,
	`is_subscribed` integer DEFAULT false NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	`deleted_at` integer,
	`sync_status` text DEFAULT 'synced' NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `users_email_unique` ON `users` (`email`);