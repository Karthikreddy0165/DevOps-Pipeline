# Project Explanation & DevOps Documentation

## Architecture

The application is a minimal, focused **To-Do web app** built on a simple monolithic stack and deployed via Docker on AWS EC2.

- **Frontend/Backend**: Next.js App Router — client-side React UI plus serverless API routes (`app/api/todos`).
- **Database**: SQLite (`todos.sqlite`) via `better-sqlite3` — zero-config, file-based, no external service needed.
- **Containerisation**: Docker + Docker Compose for consistent local and production environments.

```
Browser
  └─► Next.js (port 3000)
        ├─► app/page.tsx          (React UI — add, toggle, delete, filter)
        └─► app/api/todos/        (REST API — GET / POST / PATCH / DELETE)
              └─► lib/db.ts       (SQLite via better-sqlite3)
```

## DevOps Workflow

### Commit History
Work is developed incrementally with descriptive, scoped commits so the history shows logical progress rather than a single bulk push.

### Dependabot
`.github/dependabot.yml` automatically opens PRs when `npm` or GitHub Actions dependencies go stale (checked weekly).

### CI Pipeline (`.github/workflows/ci.yml`)
Triggered on every `push` and `pull_request`:

| Step | Command | Purpose |
|---|---|---|
| Install | `npm ci` | Reproducible, lockfile-exact install |
| Lint | `npm run lint` | Prettier formatting check |
| Unit tests | `npm test` | Jest — DB schema & CRUD |
| Integration tests | `npm test` | Jest — full CRUD cycle via DB layer |
| E2E tests | `npx playwright test` | Playwright — add task, toggle done |

### CD Pipeline (`.github/workflows/deploy.yml`)
Triggered on push to `main`. Uses `appleboy/ssh-action` to SSH into EC2 and run `scripts/deploy.sh`.

## Design Decisions

- **SQLite over MongoDB**: For a standalone To-Do app, SQLite requires zero infrastructure (no connection pooling, no replica sets). `better-sqlite3` is synchronous and fast — ideal for a simple API layer.
- **No authentication**: Removed login complexity deliberately. The app demonstrates clean DevOps practices without auth overhead muddying the tests and CI pipeline.
- **Docker Compose**: `docker-compose up -d --build` is idempotent — running it multiple times in CI/CD does not break state.
- **Prettier as linter**: Enforces consistent formatting as a hard CI gate, keeping PRs diff-clean.

## Challenges

- **Next.js 16 App Router + SQLite**: `better-sqlite3` is a native module — it only runs server-side. All DB calls are confined to API routes to prevent accidental client-side imports.
- **Playwright in CI**: Playwright requires browser binaries. The workflow installs them with `npx playwright install --with-deps chromium` before running tests.
- **Idempotent deploy script**: `scripts/deploy.sh` uses `mkdir -p`, `touch .env` (safe if exists), and `docker-compose up -d --build` — all safely re-runnable with no side effects.
