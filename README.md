# TS Residence Bali

A property listing and image management app for TS Residence Bali. Built with React, Express, SQLite, and Supabase Storage.

---

## Tech Stack

- **Frontend**: React + Vite + Tailwind CSS
- **Backend**: Express + TypeScript (`tsx`)
- **Local DB**: SQLite via `better-sqlite3` (stores image metadata)
- **File Storage**: Supabase Storage (stores actual image files)

---

## Prerequisites

- Node.js v18+
- Docker (required for local Supabase)
- [Supabase CLI](https://supabase.com/docs/guides/cli/getting-started): `brew install supabase/tap/supabase`

---

## Setup

### 1. Clone and install dependencies

```bash
git clone <repo-url>
cd ts-residence-
npm install
```

### 2. Start local Supabase

```bash
supabase start
```

This starts a local Supabase instance (Postgres + Storage + Auth + Studio) via Docker. On first run it downloads the required images — this may take a few minutes.

When it's done, you'll see output like:

```
Project URL    │ http://127.0.0.1:54321
Secret         │ sb_secret_xxxxxxxxxxxx
```

### 3. Configure environment variables

```bash
cp .env.example .env.local
```

Fill in `.env.local` with the values from the `supabase start` output:

```env
SUPABASE_URL=http://127.0.0.1:54321
SUPABASE_SERVICE_ROLE_KEY=sb_secret_xxxxxxxxxxxx
```

> Use the **Secret** key (not Publishable). It's required for server-side storage operations. Never expose it on the frontend.

### 4. Apply database migrations

```bash
supabase db reset
```

This creates the `as_per_unit` storage bucket with the correct access policies. Run this once after cloning, and again any time you pull new migrations.

### 5. Run the app

```bash
npm run dev
```

The server starts at `http://localhost:3003`. The SQLite database (`database.db`) is created automatically on first startup.

The local Supabase Studio is available at `http://127.0.0.1:54323` — you can browse storage, run queries, and manage data there.

---

## Using a hosted Supabase project (production)

If you prefer to use a cloud Supabase project instead of running locally:

1. Create a project at [supabase.com](https://supabase.com)
2. Go to **Project Settings → API** and copy:
   - **Project URL** → `SUPABASE_URL`
   - **`service_role` key** → `SUPABASE_SERVICE_ROLE_KEY`
3. Push the migrations to your hosted project:
   ```bash
   supabase link --project-ref your-project-id
   supabase db push
   ```

---

## Available Scripts

| Script            | Description                           |
| ----------------- | ------------------------------------- |
| `npm run dev`     | Start dev server (Express + Vite HMR) |
| `npm run build`   | Build frontend for production         |
| `npm run preview` | Preview the production build          |
| `npm run lint`    | TypeScript type check                 |

---

## Project Structure

```
ts-residence-/
├── server.ts          # Express server, API routes, DB init
├── src/
│   ├── main.tsx       # React entry point
│   ├── App.tsx        # Main app component
│   └── index.css      # Global styles
├── public/            # Static assets
├── .env.local         # Environment variables (not committed)
└── database.db        # SQLite file (auto-created, not committed)
```

---

## API Endpoints

| Method   | Path              | Description                                                  |
| -------- | ----------------- | ------------------------------------------------------------ |
| `GET`    | `/api/images`     | List all images (optional `?category=` filter)               |
| `POST`   | `/api/images`     | Upload an image (multipart form: `image`, `category`, `alt`) |
| `PUT`    | `/api/images/:id` | Update image metadata or replace file                        |
| `DELETE` | `/api/images/:id` | Delete image from storage and database                       |

---

## Environment Variables Reference

| Variable                    | Required | Description                                  |
| --------------------------- | -------- | -------------------------------------------- |
| `SUPABASE_URL`              | Yes      | Your Supabase project URL                    |
| `SUPABASE_SERVICE_ROLE_KEY` | Yes      | Supabase service role key (server-side only) |
| `PORT`                      | No       | Server port (default: `3003`)                |
| `NODE_ENV`                  | No       | `development` or `production`                |
