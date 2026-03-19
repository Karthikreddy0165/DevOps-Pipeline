# DevOps Pipeline Explanation

## 1. System Architecture
Our system consists of three main components:
- **Frontend / Client**: A Next.js (App Router) interface featuring standard UI logic for a kanban/todo application.
- **Backend / API**: Next.js route handlers interacting with a MongoDB database for persistence.
- **Infrastructure**: Configured for containerization via Docker (`docker-compose.yml`), making deploy targets like AWS EC2 highly feasible.

## 2. CI/CD Workflow
The project implements full continuous integration and continuous deployment pipelines using **GitHub Actions**.
- **Continuous Integration (`ci.yml`)**: Triggered on `push` or `pull_request` to the `main` branch. This workflow checks out the code, installs dependencies natively, runs ESLint (`npm run lint`), runs TypeScript type-check (`tsc`), and runs automated unit/integration tests with Jest.
- **Dependabot (`dependabot.yml`)**: Automates checking for outdated npm dependencies, maintaining security standards safely.
- **Deployment & EC2 (`cd.yml` & `scripts/deploy.sh`)**: The CD pipeline leverages standard SSH actions to connect to an AWS EC2 instance. It triggers a highly **idempotent script** (`deploy.sh`)—a script structured such that running it one time has the exact same net effect as running it ten times (it checks for live containers, downs them cleanly if needed, and reboots).

## 3. Testing Strategy
- **Unit & Integration (`Jest`)**: We isolate our components (e.g., `AuthForm`) using React Testing Library. We specifically mock the Auth Context to assert the pure behavior of the UI. For the API side, testing route handlers proves our business logic integrates successfully with our responses.
- **End-to-End (`Playwright`)**: Real browser automation validating the standard user flows, such as rendering the app layout and validating text on the initial authenticated screens.

## 4. Key Design Decisions
- **Modularity**: We abstract our frontend to small React components (`QuickAdd`, `TodoList`, `KanbanBoard`) ensuring tests and lint checks remain concise.
- **Idempotency**: Standardizing scripts (like `setup-env.sh` and `deploy.sh`) to gracefully handle both initial setups and iterative runs avoids dirty overrides and prevents downtime.

## 5. Main Challenges Overcome
- **Integrating Mock State in Tests**: Setting up standard test environments using Jest and next-auth usually implies a bulky runtime. We circumvent this by cleanly mocking module-level exports to simulate React contexts.
- **Ensuring Flawless EC2 Transitions**: Dealing with dangling Docker images on AWS can fill up storage. Our pipeline approach is idempotent and inherently cleans up existing containers prior to `docker-compose up`.
