import { pgTable, uuid, text, boolean, timestamp } from "drizzle-orm/pg-core";

export const todos = pgTable("todos", {
	id: uuid().primaryKey().defaultRandom(),
	title: text().notNull(),
	notes: text(),
	completed: boolean().notNull().default(false),
	priority: text().notNull().default("medium"),
	due_date: timestamp({ withTimezone: true }),
	created_at: timestamp({ withTimezone: true }).notNull().defaultNow(),
	updated_at: timestamp({ withTimezone: true }).notNull().defaultNow(),
});
