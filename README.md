# TaskFlow — Production-Grade Todo Manager

<div align="center">

**A beautiful, collaborative task management app built with Next.js 14, MongoDB, and modern DevOps practices.**

[![CI Pipeline](https://github.com/Karthikreddy0165/DevOps-Pipeline/actions/workflows/ci.yml/badge.svg)](https://github.com/Karthikreddy0165/DevOps-Pipeline/actions/workflows/ci.yml)
[![Security Scan](https://github.com/Karthikreddy0165/DevOps-Pipeline/actions/workflows/security.yml/badge.svg)](https://github.com/Karthikreddy0165/DevOps-Pipeline/actions/workflows/security.yml)

</div>

## ✨ Features

### Core
- ✅ **Full CRUD** — Create, read, update, delete todos
- 🎨 **Stunning UI** — Glassmorphism, dark/light mode, Framer Motion animations
- 📊 **Animated Stats** — Progress rings, animated counters, completion tracking
- 🗂️ **Kanban Board** — Drag-and-drop board view (Todo → In Progress → Done)
- ⌨️ **Quick Add** — `⌘K` / `Ctrl+K` command palette for instant task creation
- 🔍 **Smart Search** — Real-time search across titles, descriptions, and tags

### Task Management
- 📋 **Sub-tasks** — Checklists within each todo with progress bars
- 🔄 **Recurring Tasks** — Daily, weekdays, weekly, monthly schedules
- 🏷️ **Categories & Tags** — Organize with custom categories and hashtags
- ⚡ **Priority Levels** — Low / Medium / High visual indicators
- 📅 **Smart Views** — All / Today / Overdue / Upcoming filters
- ✅ **Bulk Actions** — Multi-select for batch operations

### Collaboration
- 👤 **User Auth** — Email/password + Google OAuth ready
- 🤝 **Sharing** — Share todos with view/edit permissions
- 💬 **Comments** — Comment threads on shared todos

### DevOps
- 🚀 **CI Pipeline** — Lint → Type-check → Test → Build → Docker
- 📦 **CD Pipeline** — Automated Vercel deployment (preview + production)
- 🔒 **Security** — CodeQL analysis + dependency auditing
- 🐳 **Dockerized** — Multi-stage build, Docker Compose with MongoDB
- 🔄 **Dependabot** — Automated dependency updates

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | Next.js 14, React 18, TypeScript |
| **Styling** | Tailwind CSS + Custom CSS (Glassmorphism) |
| **Animations** | Framer Motion |
| **Icons** | Lucide React |
| **Backend** | Next.js API Routes |
| **Database** | MongoDB Atlas (Mongoose) |
| **Auth** | JWT + NextAuth.js (Google OAuth) |
| **CI/CD** | GitHub Actions |
| **Container** | Docker + Docker Compose |

## 🚀 Quick Start

### Prerequisites
- Node.js 20+
- MongoDB Atlas account (or local MongoDB via Docker)

### Local Development

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your MongoDB URI and secrets

# Start dev server
npm run dev
```

### Docker

```bash
# Start app + MongoDB
docker-compose up -d

# Or build image only
docker build -t taskflow .
```

### Environment Variables

```env
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/
JWT_SECRET=your-secret-key-min-32-characters
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-nextauth-secret
GOOGLE_CLIENT_ID=your-google-client-id        # Optional
GOOGLE_CLIENT_SECRET=your-google-client-secret  # Optional
```

## 📁 Project Structure

```
├── app/
│   ├── api/
│   │   ├── auth/          # Auth endpoints
│   │   ├── categories/    # Category CRUD
│   │   ├── health/        # Health check
│   │   └── todos/         # Todo CRUD + toggle
│   ├── globals.css        # Design system
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Dashboard
├── components/
│   ├── AuthForm.tsx       # Login/signup + Google
│   ├── KanbanBoard.tsx    # Board view
│   ├── QuickAdd.tsx       # ⌘K command palette
│   ├── Sidebar.tsx        # Navigation
│   ├── Stats.tsx          # Animated stats
│   ├── ThemeToggle.tsx    # Dark/light toggle
│   ├── TodoForm.tsx       # Task creation
│   └── TodoList.tsx       # Task list
├── contexts/
│   ├── AuthContext.tsx     # Auth state
│   └── ThemeContext.tsx    # Theme state
├── lib/
│   ├── models/            # Mongoose schemas
│   ├── auth.ts            # JWT utilities
│   └── mongodb.ts         # DB connection
├── .github/
│   ├── workflows/
│   │   ├── ci.yml         # CI pipeline
│   │   ├── cd.yml         # CD pipeline
│   │   └── security.yml   # Security scans
│   └── dependabot.yml     # Auto-updates
├── Dockerfile             # Multi-stage build
├── docker-compose.yml     # App + MongoDB
└── package.json
```

## 🔬 CI/CD Pipeline

```
Push to main → Lint → Type Check → Unit Tests → Build → Docker Build → Deploy
                                      ↓
                              Coverage Report (artifact)
```

### Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start dev server |
| `npm run build` | Production build |
| `npm run lint` | Run ESLint |
| `npm run type-check` | TypeScript check |
| `npm run test` | Unit tests |
| `npm run test:coverage` | Tests + coverage |
| `npm run test:e2e` | Playwright E2E |
| `npm run docker:build` | Build Docker image |
| `npm run docker:up` | Start with Docker Compose |

## 📄 License

Open source — MIT License.
