import { describe, it, expect } from "vitest"
import { todoSelectSchema, todoInsertSchema } from "@/db/zod-schemas"
import { todos } from "@/db/schema"
import { generateValidRow, generateRowWithout } from "./helpers/schema-test-utils"

// generateValidRow produces "test-priority" for the priority field, which is now
// a strict enum. Override it with a valid value for all tests that check valid rows.
const validPriority = { priority: "medium" }

describe("todos schema", () => {
	it("validates a valid todo row", () => {
		const row = { ...generateValidRow(todoSelectSchema), ...validPriority }
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
		const row = { ...generateValidRow(todoSelectSchema), ...validPriority, due_date: null }
		const result = todoSelectSchema.safeParse(row)
		expect(result.success).toBe(true)
	})

	it("allows a date for due_date", () => {
		const row = { ...generateValidRow(todoSelectSchema), ...validPriority, due_date: new Date() }
		const result = todoSelectSchema.safeParse(row)
		expect(result.success).toBe(true)
	})

	it("validates insert schema with required fields", () => {
		const row = { ...generateValidRow(todoInsertSchema), ...validPriority }
		const result = todoInsertSchema.safeParse(row)
		expect(result.success).toBe(true)
	})

	it("insert schema fails when title is missing", () => {
		const row = generateRowWithout(todoInsertSchema, "title")
		const result = todoInsertSchema.safeParse(row)
		expect(result.success).toBe(false)
	})

	it("rejects invalid priority values", () => {
		const row = { ...generateValidRow(todoSelectSchema), priority: "urgent" }
		const result = todoSelectSchema.safeParse(row)
		expect(result.success).toBe(false)
	})

	it("accepts all valid priority values", () => {
		for (const priority of ["low", "medium", "high"]) {
			const row = { ...generateValidRow(todoSelectSchema), priority }
			const result = todoSelectSchema.safeParse(row)
			expect(result.success).toBe(true)
		}
	})

	it("validates todos table has correct columns", () => {
		const columns = Object.keys(todos)
		expect(columns).toContain("id")
		expect(columns).toContain("title")
		expect(columns).toContain("completed")
		expect(columns).toContain("priority")
	})
})
