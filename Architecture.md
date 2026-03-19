# Project Explanation & DevOps Documentation

## Architecture

The application runs on a minimal monolithic architecture packed into **Docker containers** via `docker-compose`.

- **Frontend/Backend**: Next.js App Router providing both UI Client components and Serverless API routes (`app/api/todos`).
- **Database**: MongoDB running concurrently using the `mongo:6.0` image mapped via `docker-compose.yml`.
- **Authentication**: Using `next-auth` to provide User specific tasks mapped back to Google OAuth and normal credential logins encrypted by `bcryptjs`.
- **Notification Worker**: An API route (`app/api/cron/route.ts`) checks the database dynamically to trigger mock/real **Twilio** integration for WhatsApp reminders.

## DevOps Workflow

The Continuous Integration and Continuous Deployment uses **GitHub Actions** and Docker to enforce strict code quality and shipping standards.

1. **Commit History**: Work is developed locally and pushed with descriptive commit scopes.
2. **Dependabot**: Automatically scans `package.json` for outdated items to create pull requests.
3. **Continuous Integration (CI)**:
   - On `push` or `pull_request`, GitHub Actions runs the `ci.yml` workflow.
   - Jobs install dependencies safely via `npm ci`, run `eslint` formatting checks (Linter), run isolated **Unit Tests** (Jest), and lastly runs **E2E tests** via Playwright simulating basic site visibility.
4. **Continuous Deployment (CD)**:
   - On a successful merge into `main`, GitHub Actions triggers `deploy.yml`.
   - It uses SSH keys to securely access an AWS EC2 instance.
   - It executes `scripts/deploy.sh` which runs securely and idempotently pulls branch data, updates environment files safely, and uses `docker-compose up -d --build` to deploy predictably and repeatably in production.

## Design Decisions

- **Docker Compose:** Utilizing simple Docker Compose instead of complex isolated PM2 local scripts means the deployment can guarantee identical behaviors on local machines vs production EC2 clusters with no missing node module bugs.
- **NextAuth Integration:** Implementing NextAuth simplifies providing a dual mechanism (Google Single-Sign on + Passwords), which handles massive session-tracking complexities reliably.
- **WhatsApp Twilio Mock:** Using Twilio to demonstrate advanced notification features shows production capabilities regarding event-driven task interactions while remaining elegantly simple within a single API endpoint route design.

## Challenges Faced

- **Dockerizing Next.js 14:** Next.js requires standalone exports enabled in `next.config.js` to build fully portable images without giant massive `node_modules` folders causing bloat inside the container.
- **E2E Testing Authentication:** Because Auth0/NextAuth flows involve complex cross-domain cookies, simulating full integration tests in Playwright required simplifying the initial E2E pipeline to just load tests against public gateways.
