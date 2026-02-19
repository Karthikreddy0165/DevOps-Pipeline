#!/bin/bash

# Setup script to create .env.local file with dummy environment variables

ENV_FILE=".env.local"

if [ -f "$ENV_FILE" ]; then
    echo "⚠️  .env.local already exists. Skipping..."
else
    cat > "$ENV_FILE" << 'EOF'
# Dummy Environment Variables for Todo App
NEXT_PUBLIC_APP_NAME=Todo Manager
NEXT_PUBLIC_API_URL=http://localhost:3000/api
NEXT_PUBLIC_MAX_TODOS=100
NEXT_PUBLIC_ENABLE_ANALYTICS=false

# MongoDB (Required)
# Put your real password in place of <db_password>
MONGODB_URI=mongodb+srv://karthikreddy0165_db_user:<db_password>@cluster0.zyyhwbt.mongodb.net/
# Optional
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
EOF
    echo "✅ Created .env.local file with dummy environment variables"
fi
