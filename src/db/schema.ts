import { pgTable, uuid, text, boolean, timestamp, pgEnum } from "drizzle-orm/pg-core";

export const priorityEnum = pgEnum("priority", ["low", "medium", "high"]);

export const todos = pgTable("todos", {
	id: uuid().primaryKey().defaultRandom(),
	title: text().notNull(),
	notes: text(),
	completed: boolean().notNull().default(false),
	priority: priorityEnum().notNull().default("medium"),
	due_date: timestamp({ withTimezone: true }),
	created_at: timestamp({ withTimezone: true }).notNull().defaultNow(),
	updated_at: timestamp({ withTimezone: true }).notNull().defaultNow(),
});
