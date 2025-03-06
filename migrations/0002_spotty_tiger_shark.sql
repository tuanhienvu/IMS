ALTER TABLE "company_info" ALTER COLUMN "status_id" SET DEFAULT 1;--> statement-breakpoint
ALTER TABLE "company_info" ALTER COLUMN "status_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "company_info" ALTER COLUMN "created_date" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "status_id" SET DEFAULT 1;--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "status_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "created_date" SET NOT NULL;