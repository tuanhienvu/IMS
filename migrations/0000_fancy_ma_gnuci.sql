CREATE TABLE "company_info" (
	"farm_id" serial PRIMARY KEY NOT NULL,
	"farm_name" varchar(255) NOT NULL,
	"full_name" varchar(255),
	"address" varchar(1024),
	"phone" varchar(15),
	"email" varchar(255),
	"contact_name" varchar(255),
	"contact_phone" varchar(15),
	"contact_email" varchar(255),
	"location" varchar(1024),
	"square" integer,
	"actual_square" integer,
	"picture" varchar(256),
	"status_id" integer,
	"created_date" timestamp DEFAULT now(),
	"modified_date" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "user_roles" (
	"user_role_id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"role_id" integer NOT NULL,
	"created_date" timestamp DEFAULT now(),
	"modified_date" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "users" (
	"user_id" serial PRIMARY KEY NOT NULL,
	"user_name" varchar(255) NOT NULL,
	"user_email" varchar(255),
	"department_id" integer,
	"note" varchar(1024),
	"status_id" integer,
	"created_date" timestamp DEFAULT now(),
	"modified_date" timestamp DEFAULT now(),
	CONSTRAINT "users_user_email_unique" UNIQUE("user_email")
);
