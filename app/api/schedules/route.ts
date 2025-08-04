import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const {
      carId,
      carModel,
      customerName,
      customerEmail,
      customerPhone,
      preferredDate,
      preferredTime,
      additionalNotes,
      userId
    } = body

    if (!carId || !carModel || !customerName || !customerEmail || !preferredDate || !preferredTime) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Create new schedule in database
    const { data: newSchedule, error } = await supabase
      .from('schedules')
      .insert([{
        car_id: carId,
        car_model: carModel,
        customer_name: customerName,
        customer_email: customerEmail,
        customer_phone: customerPhone,
        preferred_date: preferredDate,
        preferred_time: preferredTime,
        additional_notes: additionalNotes,
        status: 'pending',
        user_id: userId,
        schedule_date: new Date().toISOString(), // Use current date as fallback
      }])
      .select()
      .single()

    if (error) {
      console.error('Error creating schedule:', error)
      return NextResponse.json(
        { error: 'Failed to create schedule' },
        { status: 500 }
      )
    }

    return NextResponse.json(newSchedule, { status: 201 })
  } catch (error) {
    console.error('Error in schedules API:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    let query = supabase
      .from('schedules')
      .select('*')
      .order('created_at', { ascending: false })

    if (userId) {
      // Convert userId to integer and validate
      const userIdInt = parseInt(userId)
      if (!isNaN(userIdInt)) {
        query = query.eq('user_id', userIdInt)
        console.log('Fetching schedules for user ID:', userIdInt)
      } else {
        console.error('Invalid user ID:', userId)
      }
    }

    const { data: schedules, error } = await query

    if (error) {
      console.error('Error fetching schedules:', error)
      return NextResponse.json(
        { error: 'Failed to fetch schedules' },
        { status: 500 }
      )
    }

    console.log('Found schedules:', schedules?.length || 0)
    
    // Transform snake_case to camelCase to match frontend expectations
    const transformedSchedules = (schedules || []).map(schedule => ({
      id: schedule.id,
      carId: schedule.car_id,
      carModel: schedule.car_model,
      customerName: schedule.customer_name,
      customerEmail: schedule.customer_email,
      customerPhone: schedule.customer_phone,
      preferredDate: schedule.preferred_date,
      preferredTime: schedule.preferred_time,
      additionalNotes: schedule.additional_notes,
      status: schedule.status,
      scheduleDate: schedule.schedule_date,
      adminNotes: schedule.admin_notes,
    }))

    console.log('Transformed schedules:', transformedSchedules)
    return NextResponse.json(transformedSchedules)
  } catch (error) {
    console.error('Error in schedules API:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 