import mongoose from 'mongoose'
import { NextRequest, NextResponse } from 'next/server'
import { connectToMongoDB } from '@/lib/mongodb'
import { CategoryModel } from '@/lib/models/Category'
import { getCurrentUser } from '@/lib/auth'

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
    const currentUser = await getCurrentUser()
    if (!currentUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    await connectToMongoDB()

    const userId = new mongoose.Types.ObjectId(currentUser.userId)
    let userCategories = await CategoryModel.find({ userId })
    
    if (userCategories.length === 0) {
      // Create default categories for this user
      // Use try-catch to handle race conditions where another request already created them
      try {
        const defaultCats = DEFAULT_CATEGORIES.map(cat => ({
          ...cat,
          userId,
        }))
        await CategoryModel.insertMany(defaultCats, { ordered: false })
      } catch (insertError: any) {
        // If duplicate key error (race condition), just fetch existing categories
        if (insertError.code !== 11000) {
          throw insertError
        }
      }
      // Re-fetch categories after insert attempt
      userCategories = await CategoryModel.find({ userId })
    }

    const docs = await CategoryModel.find({ userId }).sort({ name: 1 })
    return NextResponse.json({ categories: docs.map(toApiCategory) }, { status: 200 })
  } catch (error: any) {
    console.error('Categories GET error:', error)
    return NextResponse.json(
      { error: error?.message || 'Failed to fetch categories' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const currentUser = await getCurrentUser()
    if (!currentUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

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

    const userId = new mongoose.Types.ObjectId(currentUser.userId)
    const doc = await CategoryModel.create({
      userId,
      id: finalId,
      name,
      color,
    })
    return NextResponse.json({ category: toApiCategory(doc) }, { status: 201 })
  } catch (error: any) {
    console.error('Categories POST error:', error)
    if (error.code === 11000) {
      return NextResponse.json(
        { error: 'Category with this ID already exists' },
        { status: 400 }
      )
    }
    return NextResponse.json(
      { error: error?.message || 'Failed to create category' },
      { status: 500 }
    )
  }
}
