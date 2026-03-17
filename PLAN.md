# Todo App — Implementation Plan

## App Description
A reactive, real-time todo application built with Electric SQL + TanStack DB where tasks sync instantly across all connected clients. Users can create, complete, and delete todos with priority levels, due dates, and optional notes.

## Data Model

### todos
- id: UUID, primary key, defaultRandom()
- title: text, notNull
- notes: text, nullable
- completed: boolean, notNull, default false
- priority: text, notNull, default "medium" — one of "low", "medium", "high"
- due_date: timestamptz, nullable
- created_at: timestamptz, notNull, defaultNow()
- updated_at: timestamptz, notNull, defaultNow()

## Implementation Tasks
- [ ] Phase 2: Discover playbook skills and read relevant ones
- [ ] Phase 3: Data model — schema, zod-schemas, migrations, tests
- [ ] Phase 4: Collections & API routes
- [ ] Phase 5: UI components
- [ ] Phase 6: Build, lint & test
- [ ] Phase 7: README.md
- [ ] Phase 8: Deploy & send `@room REVIEW_REQUEST:` (MANDATORY — pipeline stalls without it)

## Design Conventions
- UUID primary keys with defaultRandom()
- timestamp({ withTimezone: true }) for all dates
- snake_case for SQL table/column names
- Foreign keys with onDelete: "cascade" where appropriate

## Features
- Create todos with title, optional notes, priority, and optional due date
- Mark todos as complete/incomplete
- Delete todos
- Filter by status (all, active, completed)
- Sort by priority or due date
- Real-time sync across all connected clients via Electric SQL
