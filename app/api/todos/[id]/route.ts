import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import connectToDatabase from '../../../../lib/mongodb';
import Todo from '../../../../lib/models/Todo';

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } },
) {
  const session = await getServerSession();
  if (!session || !session.user)
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  await connectToDatabase();

  // Verify owner or shared
  const todo = await Todo.findById(params.id);
  if (!todo) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  // Simple check
  if (
    todo.user.toString() !== (session as any).user.id &&
    !todo.sharedWith.includes(session.user.email)
  ) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  await Todo.findByIdAndDelete(params.id);
  return NextResponse.json({ success: true, message: 'Deleted successfully' });
}
