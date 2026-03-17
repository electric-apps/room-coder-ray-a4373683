import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { todos } from "./schema";

const prioritySchema = z.enum(["low", "medium", "high"]);

export const todoSelectSchema = createSelectSchema(todos, {
	priority: prioritySchema,
	due_date: z.union([z.date(), z.string()]).nullable().optional(),
	created_at: z.union([z.date(), z.string()]),
	updated_at: z.union([z.date(), z.string()]),
});

export const todoInsertSchema = createInsertSchema(todos, {
	priority: prioritySchema.optional().default("medium"),
	due_date: z.union([z.date(), z.string()]).nullable().optional(),
	created_at: z.union([z.date(), z.string()]).optional(),
	updated_at: z.union([z.date(), z.string()]).optional(),
});

export type Todo = typeof todoSelectSchema._type;
export type NewTodo = typeof todoInsertSchema._type;
