import { pgTable, serial, integer, timestamp, varchar, unique } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"



export const userRoles = pgTable("user_roles", {
	userRoleId: serial("user_role_id").primaryKey().notNull(),
	userId: integer("user_id").notNull(),
	roleId: integer("role_id").notNull(),
	createdDate: timestamp("created_date", { mode: 'string' }).defaultNow(),
	modifiedDate: timestamp("modified_date", { mode: 'string' }).defaultNow(),
});

export const companyInfo = pgTable("company_info", {
	farmId: serial("farm_id").primaryKey().notNull(),
	farmName: varchar("farm_name", { length: 50 }).notNull(),
	fullName: varchar("full_name", { length: 50 }),
	address: varchar({ length: 150 }),
	phone: varchar({ length: 15 }),
	email: varchar({ length: 50 }),
	contactName: varchar("contact_name", { length: 50 }),
	contactPhone: varchar("contact_phone", { length: 15 }),
	contactEmail: varchar("contact_email", { length: 50 }),
	mapsLink: varchar("maps_link", { length: 1024 }),
	square: integer(),
	actualSquare: integer("actual_square"),
	picture: varchar({ length: 50 }),
	statusId: integer("status_id"),
	createdDate: timestamp("created_date", { mode: 'string' }).defaultNow(),
	modifiedDate: timestamp("modified_date", { mode: 'string' }).defaultNow(),
});

export const users = pgTable("users", {
	userId: serial("user_id").primaryKey().notNull(),
	userName: varchar("user_name", { length: 50 }).notNull(),
	userEmail: varchar("user_email", { length: 50 }),
	departmentId: integer("department_id"),
	note: varchar({ length: 150 }),
	statusId: integer("status_id"),
	createdDate: timestamp("created_date", { mode: 'string' }).defaultNow(),
	modifiedDate: timestamp("modified_date", { mode: 'string' }).defaultNow(),
}, (table) => [
	unique("users_user_email_unique").on(table.userEmail),
]);
