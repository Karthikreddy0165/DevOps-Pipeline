import Database from 'better-sqlite3';
import path from 'path';

// Vercel & other serverless platforms have a read-only filesystem.
// The only writable directory is /tmp — use it when detected.
const DB_PATH = process.env.VERCEL
  ? '/tmp/todos.sqlite'
  : path.join(process.cwd(), 'todos.sqlite');

function getDb() {
  const db = new Database(DB_PATH);

  db.exec(`
    CREATE TABLE IF NOT EXISTS todos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      done INTEGER DEFAULT 0,
      created_at TEXT DEFAULT (datetime('now'))
    );
  `);

  return db;
}

export const db = getDb();
