import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET() {
  try {
    console.log('Admin schedules API called')
    
    const { data: schedules, error } = await supabase
      .from('schedules')
      .select('*')
      .order('created_at', { ascending: false })

    console.log('Schedules fetched:', schedules?.length || 0)
    console.log('Schedules data:', schedules)

    if (error) {
      console.error('Error fetching schedules:', error)
      return NextResponse.json(
        { error: 'Failed to fetch schedules' },
        { status: 500 }
      )
    }

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