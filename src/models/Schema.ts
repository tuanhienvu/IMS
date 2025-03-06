import { integer, pgTable, serial, timestamp, varchar } from 'drizzle-orm/pg-core';

// This file defines the structure of your database tables using the Drizzle ORM.

// To modify the database schema:
// 1. Update this file with your desired changes.
// 2. Generate a new migration by running: `npm run db:generate`

// The generated migration file will reflect your schema changes.
// The migration is automatically applied during the next database interaction,
// so there's no need to run it manually or restart the Next.js server.

// export const counterSchema = pgTable('counter', {
//   id: serial('id').primaryKey(),
//   count: integer('count').default(0),
//   updatedAt: timestamp('updated_at', { mode: 'date' })
//     .defaultNow()
//     .$onUpdate(() => new Date())
//     .notNull(),
//   createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
// });

// bảng users
export const users = pgTable('users', {
  userId: serial('user_id').primaryKey(),
  userName: varchar('user_name', { length: 50 }).notNull(),
  userEmail: varchar('user_email', { length: 50 }).unique(),
  departmentId: integer('department_id'),
  note: varchar('note', { length: 150 }),
  statusId: integer('status_id').default(1).notNull(), // Mặc định là 1 (Actived)
  createdDate: timestamp('created_date').defaultNow().notNull(), // Không cho phép update
  modifiedDate: timestamp('modified_date')
    .$onUpdate(() => new Date()),
});

// bảng userRoles
export const userRoles = pgTable('user_roles', {
  userRoleId: serial('user_role_id').primaryKey(),
  userId: integer('user_id').notNull(),
  roleId: integer('role_id').notNull(),
  createdDate: timestamp('created_date').defaultNow(),
  modifiedDate: timestamp('modified_date')
    .defaultNow()
    .$onUpdate(() => new Date()),
});

// bảng companyInfo
export const companyInfo = pgTable('company_info', {
  farmId: serial('farm_id').primaryKey(),
  farmName: varchar('farm_name', { length: 50 }).notNull(),
  fullName: varchar('full_name', { length: 50 }),
  address: varchar('address', { length: 150 }),
  phone: varchar('phone', { length: 15 }),
  email: varchar('email', { length: 50 }),
  contactName: varchar('contact_name', { length: 50 }),
  contactPhone: varchar('contact_phone', { length: 15 }),
  contactEmail: varchar('contact_email', { length: 50 }),
  mapsLink: varchar('maps_link', { length: 256 }), // Lưu link Google Maps
  square: integer('square'),
  actualSquare: integer('actual_square'),
  picture: varchar('picture', { length: 50 }),
  statusId: integer('status_id').default(1).notNull(),
  createdDate: timestamp('created_date').defaultNow().notNull(),
  modifiedDate: timestamp('modified_date')
    .defaultNow()
    .$onUpdate(() => new Date()),
});
