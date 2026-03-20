# TaskFlow

A clean, minimal **To-Do app** built with Next.js and SQLite — no login, no external services, just tasks.

## ✨ Features

- ✅ Add, complete, and delete tasks
- 🔢 Live stats — Total / Active / Done
- 🔍 Filter by All / Active / Done
- 🗑️ Clear all completed tasks at once
- 🐳 Docker ready for EC2 deployment

## 🛠 Tech Stack

| Layer | Tech |
|---|---|
| Frontend / Backend | Next.js 16 App Router |
| Database | SQLite via `better-sqlite3` |
| Testing | Jest (unit + integration) + Playwright (E2E) |
| Linting | Prettier |
| CI/CD | GitHub Actions |
| Deployment | Docker + AWS EC2 |

## 🚀 Running Locally

```bash
# Install dependencies
npm install

# Start dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## 🧪 Running Tests

```bash
# Unit + integration tests
npm test

# E2E tests (starts dev server automatically)
npx playwright test
```

## 🐳 Running with Docker

```bash
docker-compose up -d --build
```

## 📁 Project Structure

```
app/
  page.tsx              # Todo UI
  api/todos/            # REST API — GET, POST
  api/todos/[id]/       # REST API — PATCH (toggle), DELETE
  globals.css           # Dark theme styles
lib/
  db.ts                 # SQLite connection + table setup
__tests__/
  unit/db.test.ts       # DB schema & CRUD unit tests
  integration/api.test.ts # Full CRUD integration tests
e2e/
  home.spec.ts          # Playwright E2E — add & complete tasks
.github/
  workflows/ci.yml      # CI: lint → test → E2E
  workflows/deploy.yml  # CD: SSH → git pull → docker-compose
  dependabot.yml        # Auto dependency updates
scripts/
  deploy.sh             # Idempotent EC2 deploy script
```

## 🔐 GitHub Secrets (for CD)

| Secret | Value |
|---|---|
| `EC2_HOST` | Your EC2 public IP |
| `EC2_USERNAME` | `ubuntu` or `ec2-user` |
| `EC2_SSH_KEY` | Full contents of your `.pem` private key |

CI requires **no secrets** — it runs entirely on the GitHub-hosted runner.
