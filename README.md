# Todo With Categories Backend

Express API for a todo application with category support. The backend uses Prisma 7 with the libSQL adapter and is prepared for deployment as a Vercel Serverless Function.

## Features

- List, create, update, and delete todos
- List categories
- Limit each category to 5 todos
- Mark todos as `DONE` or `UNDONE`
- Turso/libSQL database support
- Vercel serverless entrypoint in `api/index.js`

## Tech Stack

- Node.js
- Express 5
- TypeScript
- Prisma 7
- Turso/libSQL
- Zod
- Vercel

## Project Structure

```text
backend/
  api/index.js              # Vercel serverless function entry
  prisma/schema.prisma      # Prisma schema
  prisma/migrations/        # Local migration SQL
  scripts/init-turso.mjs    # Creates Turso tables and default categories
  src/app.ts                # Express app setup
  src/server.ts             # Local server entrypoint
  src/controllers/          # Request handlers
  src/routes/               # API routes
  src/services/             # Prisma queries
  src/lib/prisma.ts         # Prisma client setup
```

## Environment Variables

Create a `.env` file in `backend/` for local development:

```env
TURSO_DATABASE_URL="libsql://your-database.turso.io"
TURSO_AUTH_TOKEN="your-turso-token"
LOCAL_DATABASE_URL="file:./dev.db"
CORS_ORIGIN="http://localhost:3000"
PORT=4000
```

Required in Vercel Production:

```env
TURSO_DATABASE_URL
TURSO_AUTH_TOKEN
```

Optional in Vercel:

```env
CORS_ORIGIN
```

If `CORS_ORIGIN` is not set, the API allows all origins.

## Install

```bash
npm install
```

## Build

```bash
npm run build
```

This runs Prisma client generation and compiles TypeScript to `dist/`.

## Initialize Turso

Run this once after creating a new Turso database:

```bash
npm run db:init:turso
```

The script creates the `Category` and `Todo` tables if they do not exist and inserts the default categories:

- Work
- Home
- Shopping

It does not delete existing data.

## Run Locally

Build first:

```bash
npm run build
```

Start the compiled server:

```bash
npm run dev
```

Default local URL:

```text
http://localhost:4000/api
```

## API Endpoints

### Categories

```http
GET /api/categories
```

Response:

```json
{
  "data": [
    {
      "id": "category-id",
      "name": "Work"
    }
  ]
}
```

### Todos

```http
GET /api/todos
```

```http
POST /api/todos
Content-Type: application/json

{
  "name": "Prepare report",
  "categoryId": "category-id"
}
```

```http
PATCH /api/todos/:id
```

Toggles the todo status between `UNDONE` and `DONE`.

```http
DELETE /api/todos/:id
```

Deletes a todo.

## Deploy To Vercel

1. Set the Vercel project root to `backend`.
2. Add the required environment variables:

```env
TURSO_DATABASE_URL
TURSO_AUTH_TOKEN
```

3. Deploy.
4. If the database is new, run `npm run db:init:turso` locally against the same Turso database.

The Vercel function entrypoint is:

```text
api/index.js
```

It imports the compiled Express app from:

```text
dist/app.js
```

## Troubleshooting

### `TURSO_DATABASE_URL is not specified`

The runtime does not have `TURSO_DATABASE_URL` or `DATABASE_URL`. Add `TURSO_DATABASE_URL` in Vercel and redeploy.

### `TURSO_AUTH_TOKEN is not specified`

Add `TURSO_AUTH_TOKEN` in Vercel and redeploy.

### `no such table: main.Category`

The Turso database schema has not been initialized. Run:

```bash
npm run db:init:turso
```

### Root URL returns Not Found

This is expected. The API routes are under `/api`, for example:

```text
/api/categories
/api/todos
```
