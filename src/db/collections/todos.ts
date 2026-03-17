import { createCollection } from "@tanstack/db";
import { electricCollectionOptions } from "@tanstack/electric-db-collection";
import { todoSelectSchema } from "../zod-schemas";
import type { Todo } from "../zod-schemas";
import { insertTodoFn, updateTodoFn, deleteTodoFn } from "../server-fns/todos";

export const todosCollection = createCollection<Todo>({
	id: "todos",
	...electricCollectionOptions({
		id: "todos",
		schema: todoSelectSchema,
		shapeOptions: {
			url: "/api/todos",
		},
		onInsert: async ({ transaction }) => {
			const todo = transaction.mutations[0].modified;
			const { txid } = await insertTodoFn({ data: todo });
			return { txid };
		},
		onUpdate: async ({ transaction }) => {
			const { original, changes } = transaction.mutations[0];
			const { txid } = await updateTodoFn({
				data: { id: original.id as string, changes },
			});
			return { txid };
		},
		onDelete: async ({ transaction }) => {
			const { original } = transaction.mutations[0];
			const { txid } = await deleteTodoFn({
				data: { id: original.id as string },
			});
			return { txid };
		},
	}),
});
