import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import connectToDatabase from '../../../lib/mongodb';
import Todo from '../../../lib/models/Todo';

export async function GET() {
  const session = await getServerSession();
  if (!session || !session.user) return NextResponse.json([], { status: 401 });

  await connectToDatabase();
  // Fetch tasks owned by user or shared with user
  const todos = await Todo.find({
    $or: [
      { user: (session as any).user.id },
      { sharedWith: session.user.email },
    ],
  }).sort({ createdAt: -1 });

  return NextResponse.json(todos);
}

export async function POST(req: Request) {
  const session = await getServerSession();
  if (!session || !session.user)
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await req.json();
  if (!body.title)
    return NextResponse.json({ error: 'Title required' }, { status: 400 });

  await connectToDatabase();
  const newTodo = await Todo.create({
    title: body.title,
    notes: body.notes || '',
    sharedWith: body.sharedWith
      ? body.sharedWith.split(',').map((e: string) => e.trim())
      : [],
    whatsappNumber: body.whatsappNumber || '',
    reminderTime: body.reminderTime || null,
    user: (session as any).user.id,
  });

  return NextResponse.json(newTodo, { status: 201 });
}
