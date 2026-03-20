import { NextResponse } from 'next/server';
import { db } from '../../../../lib/db';

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  const todo = db.prepare('SELECT * FROM todos WHERE id = ?').get(id);
  if (!todo) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  db.prepare('DELETE FROM todos WHERE id = ?').run(id);
  return NextResponse.json({ success: true });
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const body = await req.json();

  db.prepare('UPDATE todos SET done = ? WHERE id = ?').run(
    body.done ? 1 : 0,
    id,
  );

  const updated = db.prepare('SELECT * FROM todos WHERE id = ?').get(id);
  return NextResponse.json(updated);
}
