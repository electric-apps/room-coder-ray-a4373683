import { createServerFn } from "@tanstack/react-start";
import { db } from "@/db";
import { todos } from "@/db/schema";
import { parseDates, generateTxId } from "@/db/utils";
import { todoInsertSchema } from "@/db/zod-schemas";
import { z } from "zod/v4";
import { eq } from "drizzle-orm";

export const insertTodoFn = createServerFn({ method: "POST" })
	.inputValidator((data: unknown) =>
		todoInsertSchema.parse(parseDates(data as Record<string, unknown>)),
	)
	.handler(async ({ data }) => {
		let txid = 0;
		await db.transaction(async (tx) => {
			txid = await generateTxId(tx);
			await tx.insert(todos).values(data);
		});
		return { txid };
	});

const updatePayloadSchema = z.object({
	id: z.string().uuid(),
	changes: todoInsertSchema.partial().omit({ id: true }),
});

export const updateTodoFn = createServerFn({ method: "POST" })
	.inputValidator((data: unknown) => updatePayloadSchema.parse(data))
	.handler(async ({ data }) => {
		const { id, changes } = data;
		const parsed = parseDates({
			...changes,
			updated_at: new Date(),
		} as Record<string, unknown>);
		let txid = 0;
		await db.transaction(async (tx) => {
			txid = await generateTxId(tx);
			await tx.update(todos).set(parsed).where(eq(todos.id, id));
		});
		return { txid };
	});

const deletePayloadSchema = z.object({ id: z.string().uuid() });

export const deleteTodoFn = createServerFn({ method: "POST" })
	.inputValidator((data: unknown) => deletePayloadSchema.parse(data))
	.handler(async ({ data }) => {
		let txid = 0;
		await db.transaction(async (tx) => {
			txid = await generateTxId(tx);
			await tx.delete(todos).where(eq(todos.id, data.id));
		});
		return { txid };
	});
