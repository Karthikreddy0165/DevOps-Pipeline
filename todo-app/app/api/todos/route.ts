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

export async function GET(request: NextRequest) {
  try {
    await connectToMongoDB()

    const searchParams = request.nextUrl.searchParams
    const category = searchParams.get('category')
    const completed = searchParams.get('completed')
    const q = searchParams.get('q')
    const view = searchParams.get('view') // today | overdue | upcoming

    const filter: Record<string, any> = {}

    if (category) filter.category = category
    if (completed !== null) filter.completed = completed === 'true'

    if (q && q.trim()) {
      filter.$text = { $search: q.trim() }
    }

    if (view) {
      const now = new Date()
      const start = new Date(now)
      start.setHours(0, 0, 0, 0)
      const end = new Date(now)
      end.setHours(23, 59, 59, 999)

      if (view === 'today') {
        filter.dueDate = { $gte: start, $lte: end }
      } else if (view === 'overdue') {
        filter.dueDate = { $lt: start }
        filter.completed = false
      } else if (view === 'upcoming') {
        const upcomingEnd = new Date(end)
        upcomingEnd.setDate(upcomingEnd.getDate() + 7)
        filter.dueDate = { $gt: end, $lte: upcomingEnd }
      }
    }

    const docs = await TodoModel.find(filter)
      .sort({ completed: 1, dueDate: 1, updatedAt: -1 })
      .limit(500)

    return NextResponse.json({ todos: docs.map(toApiTodo) }, { status: 200 })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch todos' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectToMongoDB()

    const body = await request.json()
    const { title, description, priority, category, dueDate, tags } = body

    if (!title || !priority || !category) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const maxTodos = parseInt(process.env.NEXT_PUBLIC_MAX_TODOS || '100', 10)
    const existingCount = await TodoModel.countDocuments()
    if (existingCount >= maxTodos) {
      return NextResponse.json(
        { error: `Maximum todos limit (${maxTodos}) reached` },
        { status: 400 }
      )
    }

    const doc = await TodoModel.create({
      title,
      description,
      priority,
      category,
      dueDate: dueDate ? new Date(dueDate) : undefined,
      tags:
        Array.isArray(tags) ? tags.filter(Boolean) : typeof tags === 'string' ? [tags] : [],
      completed: false,
    })

    return NextResponse.json({ todo: toApiTodo(doc) }, { status: 201 })
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || 'Failed to create todo' },
      { status: 500 }
    )
  }
}
