# Todo App

A reactive, real-time todo application built with Electric SQL + TanStack DB. Tasks sync instantly across all connected clients via Postgres → Electric → browser.

## Screenshot

![Todo App](./public/.gitkeep)

## Features

- Create todos with title, optional notes, priority (low/medium/high), and due date
- Mark todos complete/incomplete with optimistic updates
- Delete todos with confirmation dialog
- Filter by status: All, Active, Completed
- Real-time sync across all browser tabs and clients via Electric SQL

## Tech Stack

- **[Electric SQL](https://electric-sql.com/)** — Postgres-to-client sync via shapes
- **[TanStack DB](https://tanstack.com/db)** — Reactive collections and optimistic mutations
- **[Drizzle ORM](https://orm.drizzle.team/)** — Schema definitions and migrations
- **[TanStack Start](https://tanstack.com/start)** — React meta-framework with SSR + server functions
- **[Radix UI Themes](https://www.radix-ui.com/themes)** — Component library

## Getting Started

```bash
pnpm install
pnpm dev:start
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## Database

Uses Postgres with Drizzle ORM. After schema changes:

```bash
pnpm drizzle-kit generate && pnpm drizzle-kit migrate
```
