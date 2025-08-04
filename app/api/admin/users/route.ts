import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET() {
  try {
    const { data: users, error } = await supabase
      .from('users')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching users:', error)
      return NextResponse.json(
        { error: 'Failed to fetch users' },
        { status: 500 }
      )
    }

    return NextResponse.json(users || [])
  } catch (error) {
    console.error('Error in users API:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    
    // Create new user in Supabase
    const { data: newUser, error } = await supabase
      .from('users')
      .insert([{
        name: body.name,
        email: body.email,
        phone: body.phone,
        role: body.role || 'user',
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

    return NextResponse.json(newUser, { status: 201 })
  } catch (error) {
    console.error('Error in POST users API:', error)
    return NextResponse.json(
      { error: 'Failed to create user' },
      { status: 500 }
    )
  }
} 