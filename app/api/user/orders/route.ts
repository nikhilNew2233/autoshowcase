import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      )
    }

    // Convert userId to integer and validate
    const userIdInt = parseInt(userId)
    if (isNaN(userIdInt)) {
      return NextResponse.json(
        { error: 'Invalid user ID' },
        { status: 400 }
      )
    }

    console.log('Fetching orders for user ID:', userIdInt)

    // Fetch user orders from database
    const { data: orders, error } = await supabase
      .from('orders')
      .select('*')
      .eq('user_id', userIdInt)
      .order('booking_date', { ascending: false })

    if (error) {
      console.error('Error fetching user orders:', error)
      return NextResponse.json(
        { error: 'Failed to fetch orders' },
        { status: 500 }
      )
    }

    console.log('Found orders:', orders?.length || 0)
    
    // Transform snake_case to camelCase to match frontend expectations
    const transformedOrders = (orders || []).map(order => ({
      id: order.id,
      orderId: order.order_id,
      carId: order.car_id,
      carModel: order.car_model,
      carPrice: order.car_price,
      customerName: order.customer_name,
      customerEmail: order.customer_email,
      customerPhone: order.customer_phone,
      bookingDate: order.booking_date,
      paymentType: order.payment_type,
      reservationAmount: order.reservation_amount,
      remainingAmount: order.remaining_amount,
      paymentMethod: order.payment_method,
      status: order.status,
      deliveryDate: order.delivery_date,
      adminNotes: order.admin_notes,
    }))

    console.log('Transformed user orders:', transformedOrders)
    return NextResponse.json(transformedOrders)
  } catch (error) {
    console.error('Error in user orders API:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 