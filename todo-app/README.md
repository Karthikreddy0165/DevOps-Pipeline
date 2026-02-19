# Todo Manager - Fullstack Application

A modern, fullstack todo management application built with **Next.js 14**, **TypeScript**, and **Tailwind CSS**. This application demonstrates a complete CRUD application with RESTful API routes, modern UI/UX, and environment variable configuration.

## Features

- ✅ **Full CRUD Operations** - Create, Read, Update, and Delete todos
- 🎨 **Modern UI** - Beautiful, responsive design with Tailwind CSS
- 📊 **Statistics Dashboard** - View total, completed, pending, and high-priority tasks
- 🏷️ **Categories** - Organize todos by categories (General, Work, Personal, Shopping)
- ⚡ **Priority Levels** - Set priority (Low, Medium, High) for each todo
- 📅 **Due Dates** - Add due dates to track deadlines
- 🔎 **Search** - Search by title/description/tags
- 🏷️ **Tags** - Add tags like `#bills`, `#health`, `#errands`
- 🗓️ **Smart Views** - All / Today / Overdue / Upcoming
- 🔍 **Category Filtering** - Filter todos by category
- ✅ **Toggle Completion** - Mark todos as complete/incomplete
- 🔐 **Environment Variables** - Configured with dummy values for development

## Tech Stack

- **Frontend**: Next.js 14 (App Router), React 18, TypeScript
- **Styling**: Tailwind CSS
- **Backend**: Next.js API Routes (Node.js)
- **Data Storage**: MongoDB Atlas (Mongoose)

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager

### Installation

1. **Navigate to the todo-app directory:**
   ```bash
   cd todo-app
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   
   Create a `.env.local` file in the `todo-app` directory with the following content:
   
   ```env
   # Dummy Environment Variables for Todo App
   NEXT_PUBLIC_APP_NAME=Todo Manager
   NEXT_PUBLIC_API_URL=http://localhost:3000/api
   NEXT_PUBLIC_MAX_TODOS=100
   NEXT_PUBLIC_ENABLE_ANALYTICS=false

   # MongoDB (Required)
   # Put your real password in place of <db_password> (do NOT commit it)
   MONGODB_URI=mongodb+srv://karthikreddy0165_db_user:<db_password>@cluster0.zyyhwbt.mongodb.net/
   # Optional (if you want to force a specific DB name)
   # MONGODB_DB_NAME=todo_app

   # Database Configuration (Dummy)
   DATABASE_URL=postgresql://user:password@localhost:5432/todo_db
   DATABASE_HOST=localhost
   DATABASE_PORT=5432
   DATABASE_NAME=todo_db
   DATABASE_USER=dummy_user
   DATABASE_PASSWORD=dummy_password_123

   # API Keys (Dummy)
   API_KEY=sk_test_1234567890abcdefghijklmnopqrstuvwxyz
   SECRET_KEY=dummy_secret_key_for_development_only

   # Feature Flags
   ENABLE_DARK_MODE=true
   ENABLE_NOTIFICATIONS=true
   ENABLE_SYNC=false

   # External Services (Dummy)
   EXTERNAL_API_URL=https://api.example.com/v1
   EXTERNAL_API_KEY=dummy_external_api_key_12345

   # Session Configuration
   SESSION_SECRET=dummy_session_secret_change_in_production
   SESSION_MAX_AGE=86400

   # Email Configuration (Dummy)
   SMTP_HOST=smtp.example.com
   SMTP_PORT=587
   SMTP_USER=dummy_email@example.com
   SMTP_PASSWORD=dummy_email_password

   # Redis Configuration (Dummy)
   REDIS_HOST=localhost
   REDIS_PORT=6379
   REDIS_PASSWORD=dummy_redis_password
   ```

4. **Run the development server:**
   ```bash
   npm run dev
   ```

5. **Open your browser:**
   
   Navigate to [http://localhost:3000](http://localhost:3000)

## Project Structure

```
todo-app/
├── app/
│   ├── api/              # API routes (backend)
│   │   ├── todos/        # Todo CRUD endpoints
│   │   └── categories/   # Category endpoints
│   ├── globals.css       # Global styles
│   ├── layout.tsx        # Root layout
│   └── page.tsx          # Main page component
├── components/           # React components
│   ├── TodoForm.tsx     # Todo creation form
│   ├── TodoList.tsx     # Todo list display
│   ├── CategoryFilter.tsx # Category filtering
│   └── Stats.tsx        # Statistics dashboard
├── lib/
│   └── data-store.ts    # In-memory data store
├── .env.local           # Environment variables (create this)
├── package.json         # Dependencies
├── tsconfig.json        # TypeScript configuration
├── tailwind.config.js   # Tailwind CSS configuration
└── README.md            # This file
```

## API Endpoints

### Todos

- `GET /api/todos` - Get all todos (supports query params: `?category=work&completed=false`)
- `GET /api/todos/[id]` - Get a specific todo
- `POST /api/todos` - Create a new todo
- `PUT /api/todos/[id]` - Update a todo
- `DELETE /api/todos/[id]` - Delete a todo
- `POST /api/todos/[id]/toggle` - Toggle todo completion status

### Categories

- `GET /api/categories` - Get all categories
- `POST /api/categories` - Create a new category

## Environment Variables

All environment variables are configured with dummy values for development. In production, replace these with actual values:

- `NEXT_PUBLIC_APP_NAME` - Application name displayed in the UI
- `NEXT_PUBLIC_API_URL` - Base URL for API calls
- `NEXT_PUBLIC_MAX_TODOS` - Maximum number of todos allowed
- `DATABASE_*` - Database configuration (currently using in-memory store)
- `API_KEY`, `SECRET_KEY` - API authentication keys
- `SMTP_*` - Email service configuration
- `REDIS_*` - Redis cache configuration

## Features in Detail

### Todo Management
- Create todos with title, description, priority, category, and due date
- Mark todos as complete/incomplete
- Delete todos
- Filter todos by category
- View statistics (total, completed, pending, high priority)

### Categories
- Pre-defined categories: General, Work, Personal, Shopping
- Each category has a unique color
- Filter todos by category

### Priority Levels
- **Low** - Green badge
- **Medium** - Yellow badge
- **High** - Red badge

## Development

### Build for Production

```bash
npm run build
npm start
```

### Run Linter

```bash
npm run lint
```

## Future Enhancements

- [ ] Add database integration (PostgreSQL/MongoDB)
- [ ] User authentication and authorization
- [ ] Dark mode support
- [ ] Todo search functionality
- [ ] Drag and drop reordering
- [ ] Todo sharing and collaboration
- [ ] Email notifications for due dates
- [ ] Export todos to PDF/CSV
- [ ] Mobile app (React Native)

## License

This project is open source and available for learning purposes.

## Contributing

Feel free to fork this project and submit pull requests for any improvements!
