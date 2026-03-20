import { NextResponse } from 'next/server';
import { db } from '../../../lib/db';

// Ensure the todos table exists
db.exec(`
  CREATE TABLE IF NOT EXISTS todos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    done INTEGER DEFAULT 0,
    created_at TEXT DEFAULT (datetime('now'))
  );
`);

export async function GET() {
  const todos = db
    .prepare('SELECT * FROM todos ORDER BY created_at DESC')
    .all();
  return NextResponse.json(todos);
}

export async function POST(req: Request) {
  const body = await req.json();
  if (!body.title)
    return NextResponse.json({ error: 'Title required' }, { status: 400 });

  const result = db
    .prepare('INSERT INTO todos (title) VALUES (?)')
    .run(body.title.trim());

  const newTodo = db
    .prepare('SELECT * FROM todos WHERE id = ?')
    .get(result.lastInsertRowid);

  return NextResponse.json(newTodo, { status: 201 });
}
