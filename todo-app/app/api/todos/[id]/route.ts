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

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectToMongoDB()

    if (!mongoose.isValidObjectId(params.id)) {
      return NextResponse.json(
        { error: 'Invalid todo id' },
        { status: 400 }
      );
    }

    const doc = await TodoModel.findById(params.id)
    if (!doc) {
      return NextResponse.json({ error: 'Todo not found' }, { status: 404 })
    }

    return NextResponse.json({ todo: toApiTodo(doc) }, { status: 200 })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch todo' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectToMongoDB()

    if (!mongoose.isValidObjectId(params.id)) {
      return NextResponse.json({ error: 'Invalid todo id' }, { status: 400 })
    }

    const body = await request.json()
    const updates: Record<string, any> = {}
    const allowed = ['title', 'description', 'completed', 'priority', 'category', 'dueDate', 'tags']
    for (const key of allowed) {
      if (key in body) updates[key] = body[key]
    }
    if ('dueDate' in updates) {
      updates.dueDate = updates.dueDate ? new Date(updates.dueDate) : undefined
    }
    if ('tags' in updates) {
      updates.tags = Array.isArray(updates.tags)
        ? updates.tags.filter(Boolean)
        : typeof updates.tags === 'string'
          ? [updates.tags]
          : []
    }

    const doc = await TodoModel.findByIdAndUpdate(params.id, updates, {
      new: true,
      runValidators: true,
    })

    if (!doc) {
      return NextResponse.json({ error: 'Todo not found' }, { status: 404 })
    }

    return NextResponse.json({ todo: toApiTodo(doc) }, { status: 200 })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update todo' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectToMongoDB()

    if (!mongoose.isValidObjectId(params.id)) {
      return NextResponse.json({ error: 'Invalid todo id' }, { status: 400 })
    }

    const res = await TodoModel.findByIdAndDelete(params.id)
    if (!res) {
      return NextResponse.json({ error: 'Todo not found' }, { status: 404 })
    }

    return NextResponse.json({ message: 'Todo deleted successfully' }, { status: 200 })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to delete todo' },
      { status: 500 }
    )
  }
}
