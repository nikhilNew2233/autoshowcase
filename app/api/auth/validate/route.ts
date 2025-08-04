import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { userId, email } = body

    if (!userId || !email) {
      return NextResponse.json(
        { error: 'Missing user ID or email' },
        { status: 400 }
      )
    }

    // Check if user exists in database
    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .eq('email', email)
      .single()

    if (error || !user) {
      return NextResponse.json(
        { error: 'Invalid user credentials' },
        { status: 401 }
      )
    }

    // Return the validated user data
    return NextResponse.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        status: user.status,
      }
    })
  } catch (error) {
    console.error('Error in validate API:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 