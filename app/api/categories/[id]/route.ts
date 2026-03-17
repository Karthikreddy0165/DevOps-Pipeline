import mongoose from 'mongoose'
import { NextRequest, NextResponse } from 'next/server'
import { connectToMongoDB } from '@/lib/mongodb'
import { CategoryModel } from '@/lib/models/Category'
import { TodoModel } from '@/lib/models/Todo'
import { getCurrentUser } from '@/lib/auth'

const DEFAULT_CATEGORY_IDS = ['general', 'work', 'personal', 'shopping']

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const currentUser = await getCurrentUser()
    if (!currentUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Prevent deletion of default categories
    if (DEFAULT_CATEGORY_IDS.includes(params.id)) {
      return NextResponse.json(
        { error: 'Cannot delete default categories' },
        { status: 400 }
      )
    }

    await connectToMongoDB()

    const userId = new mongoose.Types.ObjectId(currentUser.userId)

    // Check if category exists and belongs to user
    const category = await CategoryModel.findOne({
      userId,
      id: params.id,
    })

    if (!category) {
      return NextResponse.json({ error: 'Category not found' }, { status: 404 })
    }

    // Check if any todos are using this category
    const todosUsingCategory = await TodoModel.countDocuments({
      userId,
      category: params.id,
    })

    if (todosUsingCategory > 0) {
      return NextResponse.json(
        {
          error: `Cannot delete category: ${todosUsingCategory} todo(s) are using it. Please reassign them first.`,
        },
        { status: 400 }
      )
    }

    // Delete the category
    await CategoryModel.findOneAndDelete({ userId, id: params.id })

    return NextResponse.json(
      { message: 'Category deleted successfully' },
      { status: 200 }
    )
  } catch (error: any) {
    console.error('Category DELETE error:', error)
    return NextResponse.json(
      { error: error?.message || 'Failed to delete category' },
      { status: 500 }
    )
  }
}
