# build-planner

An AI-powered business plan generator. Answer a short questionnaire and get a
complete, editable business plan (executive summary, market analysis,
competitive landscape, SWOT, and more), exportable to PDF.

Inspired by [BizPlanner AI](https://bizplanner.ai/), built from scratch as an
MVP first, with room to grow (persistence, payments, RAG for local market
context, and more, added incrementally).

## Repo structure

This is an npm-workspaces monorepo with two independently deployable apps and
one shared package:

```
build-planner/
├── apps/
│   ├── backend/     # Express + TypeScript API (routes, services, models)
│   └── web/         # Next.js + TypeScript + Tailwind frontend
└── packages/
    └── shared/      # Zod schemas & types shared by both apps
```

- **`apps/backend`** exposes the API: generating plans via OpenAI, exporting
  PDFs, regenerating individual sections. Follows a routes → services → models
  layering (routes stay thin, business logic lives in services).
- **`apps/web`** is the user-facing app: the questionnaire, the plan preview/
  editor, and the download flow.
- **`packages/shared`** holds the Zod schemas (`Plan`, `QuestionnaireAnswers`,
  etc.) that both apps import, so the API contract between frontend and
  backend can't silently drift.

For the reasoning behind these choices (why a monorepo, why Express instead
of Next.js API routes, why no database yet), see
[`docs/ARCHITECTURE.md`](./docs/ARCHITECTURE.md) *(coming soon)*.

## Prerequisites

- Node.js 20+
- npm 10+
- An OpenAI API key ([platform.openai.com](https://platform.openai.com))

## Setup

1. **Clone the repo**
   ```bash
   git clone git@github.com:elcareem/build-planner.git
   cd build-planner
   ```

2. **Install dependencies** (installs all workspaces from the root)
   ```bash
   npm install
   ```

3. **Configure environment variables**
   ```bash
   cp apps/backend/.env.example apps/backend/.env
   ```
   Then open `apps/backend/.env` and fill in your `OPENAI_API_KEY`.

4. **Run the apps**

   In one terminal:
   ```bash
   npm run dev:backend
   ```
   Runs on `http://localhost:4000`. Confirm it's up:
   ```bash
   curl http://localhost:4000/health
   ```

   In another terminal:
   ```bash
   npm run dev:web
   ```
   Runs on `http://localhost:3000`.

## Useful commands (run from repo root)

| Command                | What it does                                  |
|-------------------------|------------------------------------------------|
| `npm run dev:backend`   | Start the backend in watch mode                |
| `npm run dev:web`       | Start the frontend dev server                  |
| `npm run build --workspaces --if-present` | Build all workspaces           |
| `npm run lint --workspaces --if-present`  | Lint all workspaces            |
| `npm ls --workspaces --depth=0` | Sanity-check workspace linking          |

## Contributing

See [`CONTRIBUTING.md`](./CONTRIBUTING.md) for branch naming, commit
conventions, and the checklist to run before opening a PR.

## Status

Pre-MVP. No database, no auth, no payments yet — deliberately deferred until
the core generate → preview → edit → export flow is proven out. See open
issues for current scope and sequencing.