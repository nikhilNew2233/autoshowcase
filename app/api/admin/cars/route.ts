import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { Car, NewCar } from '@/types/car'

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
    console.error('Error in admin cars API:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const body: NewCar = await request.json()
    
    // Validate required fields
    if (!body.type || !body.model || !body.units_available || !body.model_year || !body.price) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Create new car in Supabase
    const { data: newCar, error } = await supabase
      .from('cars')
      .insert([{
        type: body.type,
        model: body.model,
        units_available: body.units_available,
        model_year: body.model_year,
        price: body.price,
        image_url: body.image_url || `https://picsum.photos/seed/${body.model.toLowerCase().replace(/\s+/g, '-')}/400/300`,
        description: body.description,
      }])
      .select()
      .single()

    if (error) {
      console.error('Error creating car:', error)
      return NextResponse.json(
        { error: 'Failed to add car' },
        { status: 500 }
      )
    }

    return NextResponse.json(newCar, { status: 201 })
  } catch (error) {
    console.error('Error in POST admin cars API:', error)
    return NextResponse.json(
      { error: 'Failed to add car' },
      { status: 500 }
    )
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json()
    const { id, ...updateData } = body

    // Update car in Supabase
    const { data: updatedCar, error } = await supabase
      .from('cars')
      .update({
        type: updateData.type,
        model: updateData.model,
        units_available: updateData.units_available,
        model_year: updateData.model_year,
        price: updateData.price,
        image_url: updateData.image_url,
        description: updateData.description,
      })
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Error updating car:', error)
      return NextResponse.json(
        { error: 'Failed to update car' },
        { status: 500 }
      )
    }

    return NextResponse.json(updatedCar)
  } catch (error) {
    console.error('Error in PUT admin cars API:', error)
    return NextResponse.json(
      { error: 'Failed to update car' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = parseInt(searchParams.get('id') || '0')

    // Delete car from Supabase
    const { data: deletedCar, error } = await supabase
      .from('cars')
      .delete()
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Error deleting car:', error)
      return NextResponse.json(
        { error: 'Failed to delete car' },
        { status: 500 }
      )
    }

    return NextResponse.json({ message: 'Car deleted successfully', car: deletedCar })
  } catch (error) {
    console.error('Error in DELETE admin cars API:', error)
    return NextResponse.json(
      { error: 'Failed to delete car' },
      { status: 500 }
    )
  }
} 