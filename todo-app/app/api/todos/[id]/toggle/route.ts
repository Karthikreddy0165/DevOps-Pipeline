import mongoose from 'mongoose'
import { NextRequest, NextResponse } from 'next/server'
import { connectToMongoDB } from '@/lib/mongodb'
import { TodoModel } from '@/lib/models/Todo'

function toApiTodo(doc: any) {
  return {
    id: doc._id.toString(),
    title: doc.title,
    description: doc.description ?? undefined,
    completed: Boolean(doc.completed),
    priority: doc.priority,
    category: doc.category,
    dueDate: doc.dueDate ? new Date(doc.dueDate).toISOString().slice(0, 10) : undefined,
    tags: Array.isArray(doc.tags) ? doc.tags : [],
    createdAt: new Date(doc.createdAt).toISOString(),
    updatedAt: new Date(doc.updatedAt).toISOString(),
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectToMongoDB()

    if (!mongoose.isValidObjectId(params.id)) {
      return NextResponse.json({ error: 'Invalid todo id' }, { status: 400 })
    }

    const doc = await TodoModel.findById(params.id)
    if (!doc) {
      return NextResponse.json({ error: 'Todo not found' }, { status: 404 })
    }

    doc.completed = !doc.completed
    await doc.save()

    return NextResponse.json({ todo: toApiTodo(doc) }, { status: 200 })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to toggle todo' },
      { status: 500 }
    )
  }
}
