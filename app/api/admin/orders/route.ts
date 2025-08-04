import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET() {
  try {
    console.log('Admin orders API called')
    
    const { data: orders, error } = await supabase
      .from('orders')
      .select('*')
      .order('booking_date', { ascending: false })

    console.log('Orders fetched:', orders?.length || 0)
    console.log('Orders data:', orders)

    if (error) {
      console.error('Error fetching orders:', error)
      return NextResponse.json(
        { error: 'Failed to fetch orders' },
        { status: 500 }
      )
    }

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

    console.log('Transformed orders:', transformedOrders)
    return NextResponse.json(transformedOrders)
  } catch (error) {
    console.error('Error in orders API:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json()
    const { orderId, status, adminNotes } = body

    // Update order in Supabase
    const { data: updatedOrder, error } = await supabase
      .from('orders')
      .update({
        status,
        admin_notes: adminNotes,
        updated_at: new Date().toISOString(),
      })
      .eq('order_id', orderId)
      .select()
      .single()

    if (error) {
      console.error('Error updating order:', error)
      return NextResponse.json(
        { error: 'Failed to update order' },
        { status: 500 }
      )
    }

    return NextResponse.json(updatedOrder)
  } catch (error) {
    console.error('Error in PATCH orders API:', error)
    return NextResponse.json(
      { error: 'Failed to update order' },
      { status: 500 }
    )
  }
} 