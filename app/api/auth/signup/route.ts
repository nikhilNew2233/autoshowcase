import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST(request: Request) {
  try {
    const { name, email, password, phone } = await request.json()

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: 'Name, email, and password are required' },
        { status: 400 }
      )
    }

    // Check if user already exists
    const { data: existingUser } = await supabase
      .from('users')
      .select('id')
      .eq('email', email)
      .single()

    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 409 }
      )
    }

    // Create new user in database
    const { data: newUser, error } = await supabase
      .from('users')
      .insert([{
        name,
        email,
        password, // In production, hash the password
        phone: phone || null,
        role: 'user',
        status: 'active',
      }])
      .select()
      .single()

    if (error) {
      console.error('Error creating user:', error)
      return NextResponse.json(
        { error: 'Failed to create user' },
        { status: 500 }
      )
    }

    // Return user data (without password)
    const { password: _, ...userWithoutPassword } = newUser
    return NextResponse.json({
      user: userWithoutPassword,
      message: 'User created successfully'
    }, { status: 201 })
  } catch (error) {
    console.error('Error in signup API:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 