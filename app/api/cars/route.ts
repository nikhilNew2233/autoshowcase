import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { Car } from '@/types/car'

export async function GET() {
  try {
    const { data: cars, error } = await supabase
      .from('cars')
      .select('*')
      .order('id', { ascending: true })

    if (error) {
      console.error('Error fetching cars:', error)
      return NextResponse.json(
        { error: 'Failed to fetch cars' },
        { status: 500 }
      )
    }

    return NextResponse.json(cars || [])
  } catch (error) {
    console.error('Error in cars API:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 