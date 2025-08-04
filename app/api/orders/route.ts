import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const {
      carId,
      carModel,
      carPrice,
      customerName,
      customerEmail,
      customerPhone,
      paymentType,
      reservationAmount,
      remainingAmount,
      paymentMethod,
      userId
    } = body

    if (!carId || !carModel || !carPrice || !customerName || !customerEmail) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Generate order ID
    const orderId = `ORD${Date.now()}${Math.floor(Math.random() * 1000)}`

    // Create new order in database
    const { data: newOrder, error } = await supabase
      .from('orders')
      .insert([{
        order_id: orderId,
        car_id: carId,
        car_model: carModel,
        car_price: carPrice,
        customer_name: customerName,
        customer_email: customerEmail,
        customer_phone: customerPhone,
        payment_type: paymentType,
        reservation_amount: reservationAmount,
        remaining_amount: remainingAmount,
        payment_method: paymentMethod,
        status: 'pending',
        user_id: userId,
        booking_date: new Date().toISOString(),
      }])
      .select()
      .single()

    if (error) {
      console.error('Error creating order:', error)
      return NextResponse.json(
        { error: 'Failed to create order' },
        { status: 500 }
      )
    }

    return NextResponse.json(newOrder, { status: 201 })
  } catch (error) {
    console.error('Error in orders API:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 