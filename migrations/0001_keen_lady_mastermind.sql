ALTER TABLE "company_info" RENAME COLUMN "location" TO "maps_link";--> statement-breakpoint
ALTER TABLE "company_info" ALTER COLUMN "farm_name" SET DATA TYPE varchar(50);--> statement-breakpoint
ALTER TABLE "company_info" ALTER COLUMN "full_name" SET DATA TYPE varchar(50);--> statement-breakpoint
ALTER TABLE "company_info" ALTER COLUMN "address" SET DATA TYPE varchar(150);--> statement-breakpoint
ALTER TABLE "company_info" ALTER COLUMN "email" SET DATA TYPE varchar(50);--> statement-breakpoint
ALTER TABLE "company_info" ALTER COLUMN "contact_name" SET DATA TYPE varchar(50);--> statement-breakpoint
ALTER TABLE "company_info" ALTER COLUMN "contact_email" SET DATA TYPE varchar(50);--> statement-breakpoint
ALTER TABLE "company_info" ALTER COLUMN "picture" SET DATA TYPE varchar(50);--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "user_name" SET DATA TYPE varchar(50);--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "user_email" SET DATA TYPE varchar(50);--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "note" SET DATA TYPE varchar(150);