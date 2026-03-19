# TaskFlow — Dockerized Todo Manager

A clean, user-specific task management app built with Next.js, NextAuth, and MongoDB.

## ✨ Features

- 🐳 **Docker Simplicity** — One command to run app and database flawlessly.
- 👤 **NextAuth Users** — Email/Password Login + Google Account support securely encrypted via `bcrypt`.
- 🤝 **Collaboration Sharing** — Allow specified emails to concurrently view and modify your tasks.
- 📝 **Detailed Notes** — Append detailed notes on tasks natively.
- 📱 **WhatsApp Notice Integration** — Configure precise reminder times integrated smoothly into a backend worker for Twilio.

## 🛠 Tech Stack

- **Container**: `docker-compose` & `Dockerfile`
- **Frontend/Backend:** Next.js App Router (React, Auth, RESTful calls)
- **Database:** MongoDB Atlas/Docker (Mongoose)

## 🚀 Quick Start

### Prerequisites

- Docker Engine installed locally OR Node.js + MongoDB

### Simple Docker Local Development

1. **Environment Variables**
   Create a `.env` in root explicitly. (Docker defines its own for `MONGO` connection in compose defaults, so simply putting Google Client info is enough).
   ```env
   GOOGLE_CLIENT_ID=your_id_optional
   GOOGLE_CLIENT_SECRET=your_secret_optional
   TWILIO_ACCOUNT_SID=xyz_optional
   TWILIO_AUTH_TOKEN=xyz_optional
   ```
2. **Launch Compose App**
   ```bash
   docker-compose up -d --build
   ```

Open [http://localhost:3000](http://localhost:3000) to view it in your browser.
