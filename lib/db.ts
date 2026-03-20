import Database from 'better-sqlite3';

function getDb() {
  const db = new Database('todos.sqlite');

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
