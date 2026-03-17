CREATE TYPE "public"."priority" AS ENUM('low', 'medium', 'high');--> statement-breakpoint
ALTER TABLE "todos" ALTER COLUMN "priority" SET DEFAULT 'medium'::"public"."priority";--> statement-breakpoint
ALTER TABLE "todos" ALTER COLUMN "priority" SET DATA TYPE "public"."priority" USING "priority"::"public"."priority";