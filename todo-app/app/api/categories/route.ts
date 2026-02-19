import { NextRequest, NextResponse } from 'next/server'
import { connectToMongoDB } from '@/lib/mongodb'
import { CategoryModel } from '@/lib/models/Category'

function toApiCategory(doc: any) {
  return {
    id: doc.id,
    name: doc.name,
    color: doc.color,
  }
}

const DEFAULT_CATEGORIES = [
  { id: 'general', name: 'General', color: '#3b82f6' },
  { id: 'work', name: 'Work', color: '#10b981' },
  { id: 'personal', name: 'Personal', color: '#f59e0b' },
  { id: 'shopping', name: 'Shopping', color: '#ef4444' },
]

export async function GET() {
  try {
    await connectToMongoDB()

    const count = await CategoryModel.countDocuments()
    if (count === 0) {
      await CategoryModel.insertMany(DEFAULT_CATEGORIES, { ordered: false })
    }

    const docs = await CategoryModel.find().sort({ name: 1 })
    return NextResponse.json({ categories: docs.map(toApiCategory) }, { status: 200 })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch categories' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectToMongoDB()

    const body = await request.json()
    const { name, color, id } = body

    if (!name || !color) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const finalId =
      (typeof id === 'string' && id.trim()) ||
      String(name).toLowerCase().trim().replace(/\s+/g, '-')

    const doc = await CategoryModel.create({ id: finalId, name, color })
    return NextResponse.json({ category: toApiCategory(doc) }, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create category' },
      { status: 500 }
    )
  }
}
