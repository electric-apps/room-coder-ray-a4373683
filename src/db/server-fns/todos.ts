import { createServerFn } from "@tanstack/react-start";
import { db } from "@/db";
import { todos } from "@/db/schema";
import { parseDates, generateTxId } from "@/db/utils";
import { eq } from "drizzle-orm";

export const insertTodoFn = createServerFn({ method: "POST" })
	.validator((data: unknown) => data as Record<string, unknown>)
	.handler(async ({ data }) => {
		const todo = parseDates(data as Record<string, unknown>);
		let txid: number | undefined;
		await db.transaction(async (tx) => {
			txid = await generateTxId(tx);
			await tx.insert(todos).values(todo);
		});
		return { txid: txid as number };
	});

export const updateTodoFn = createServerFn({ method: "POST" })
	.validator(
		(data: unknown) => data as { id: string; changes: Record<string, unknown> },
	)
	.handler(async ({ data }) => {
		const { id, changes } = data;
		const parsed = parseDates({ ...changes, updated_at: new Date() });
		let txid: number | undefined;
		await db.transaction(async (tx) => {
			txid = await generateTxId(tx);
			await tx.update(todos).set(parsed).where(eq(todos.id, id));
		});
		return { txid: txid as number };
	});

export const deleteTodoFn = createServerFn({ method: "POST" })
	.validator((data: unknown) => data as { id: string })
	.handler(async ({ data }) => {
		let txid: number | undefined;
		await db.transaction(async (tx) => {
			txid = await generateTxId(tx);
			await tx.delete(todos).where(eq(todos.id, data.id));
		});
		return { txid: txid as number };
	});
