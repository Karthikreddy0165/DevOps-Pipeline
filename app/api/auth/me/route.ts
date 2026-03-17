import { NextResponse } from 'next/server'
import { connectToMongoDB } from '@/lib/mongodb'
import { UserModel } from '@/lib/models/User'
import { getCurrentUser } from '@/lib/auth'

export async function GET() {
  try {
    const currentUser = await getCurrentUser()
    if (!currentUser) {
      return NextResponse.json({ user: null }, { status: 200 })
    }

    await connectToMongoDB()
    const user = await UserModel.findById(currentUser.userId).select('-password')
    
    if (!user) {
      return NextResponse.json({ user: null }, { status: 200 })
    }

    return NextResponse.json({
      user: {
        id: user._id.toString(),
        email: user.email,
        name: user.name,
      },
    })
  } catch (error) {
    return NextResponse.json({ user: null }, { status: 200 })
  }
}
