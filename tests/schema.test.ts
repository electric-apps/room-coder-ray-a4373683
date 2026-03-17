import { describe, it, expect } from "vitest"
import { todoSelectSchema, todoInsertSchema } from "@/db/zod-schemas"
import { todos } from "@/db/schema"
import { generateValidRow, generateRowWithout } from "./helpers/schema-test-utils"

describe("todos schema", () => {
	it("validates a valid todo row", () => {
		const row = generateValidRow(todoSelectSchema)
		const result = todoSelectSchema.safeParse(row)
		expect(result.success).toBe(true)
	})

	it("fails when title is missing", () => {
		const row = generateRowWithout(todoSelectSchema, "title")
		const result = todoSelectSchema.safeParse(row)
		expect(result.success).toBe(false)
	})

	it("fails when completed is missing", () => {
		const row = generateRowWithout(todoSelectSchema, "completed")
		const result = todoSelectSchema.safeParse(row)
		expect(result.success).toBe(false)
	})

	it("allows null due_date", () => {
		const row = generateValidRow(todoSelectSchema)
		const result = todoSelectSchema.safeParse({ ...row, due_date: null })
		expect(result.success).toBe(true)
	})

	it("allows a date for due_date", () => {
		const row = generateValidRow(todoSelectSchema)
		const result = todoSelectSchema.safeParse({ ...row, due_date: new Date() })
		expect(result.success).toBe(true)
	})

	it("validates insert schema with required fields", () => {
		const row = generateValidRow(todoInsertSchema)
		const result = todoInsertSchema.safeParse(row)
		expect(result.success).toBe(true)
	})

	it("insert schema fails when title is missing", () => {
		const row = generateRowWithout(todoInsertSchema, "title")
		const result = todoInsertSchema.safeParse(row)
		expect(result.success).toBe(false)
	})

	it("validates priority field", () => {
		const row = generateValidRow(todoSelectSchema)
		const result = todoSelectSchema.safeParse({ ...row, priority: "high" })
		expect(result.success).toBe(true)
	})

	it("validates todos table has correct columns", () => {
		const columns = Object.keys(todos)
		expect(columns).toContain("id")
		expect(columns).toContain("title")
		expect(columns).toContain("completed")
		expect(columns).toContain("priority")
	})
})
