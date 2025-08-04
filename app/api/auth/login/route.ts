import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      )
    }

    // Check user credentials in database
    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .eq('password', password) // In production, use proper password hashing
      .single()

    if (error || !user) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      )
    }

    // Return user data (without password)
    const { password: _, ...userWithoutPassword } = user
    return NextResponse.json({
      user: userWithoutPassword,
      message: 'Login successful'
    })
  } catch (error) {
    console.error('Error in login API:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 