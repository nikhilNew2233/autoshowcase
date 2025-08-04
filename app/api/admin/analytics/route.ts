import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET() {
  try {
    console.log('Analytics API called')
    
    // Fetch analytics data from Supabase
    const [
      { count: totalUsers },
      { count: totalOrders },
      { count: totalSchedules },
      { data: orders },
      { data: monthlyRevenue }
    ] = await Promise.all([
      supabase.from('users').select('*', { count: 'exact', head: true }),
      supabase.from('orders').select('*', { count: 'exact', head: true }),
      supabase.from('schedules').select('*', { count: 'exact', head: true }),
      supabase.from('orders').select('car_model, car_price, status'),
      supabase.from('orders').select('booking_date, car_price').gte('booking_date', new Date(new Date().getFullYear(), 0, 1).toISOString())
    ])

    console.log('Raw counts:', { totalUsers, totalOrders, totalSchedules })
    console.log('Orders data:', orders)
    console.log('Monthly revenue data:', monthlyRevenue)

    // Calculate total revenue
    const totalRevenue = orders?.reduce((sum, order) => {
      if (order.status === 'confirmed' || order.status === 'completed') {
        return sum + (order.car_price || 0)
      }
      return sum
    }, 0) || 0

    // Calculate pending payments
    const pendingPayments = orders?.reduce((sum, order) => {
      if (order.status === 'pending') {
        return sum + (order.car_price || 0)
      }
      return sum
    }, 0) || 0

    console.log('Calculated values:', { totalRevenue, pendingPayments })

    // Calculate monthly revenue
    const monthlyRevenueData = monthlyRevenue?.reduce((acc, order) => {
      const month = new Date(order.booking_date).toLocaleString('en-US', { month: 'short' })
      const existing = acc.find(item => item.month === month)
      if (existing) {
        existing.revenue += order.car_price || 0
      } else {
        acc.push({ month, revenue: order.car_price || 0 })
      }
      return acc
    }, [] as { month: string; revenue: number }[]) || []

    // Calculate top selling cars
    const carSales = orders?.reduce((acc, order) => {
      const model = order.car_model
      if (model) {
        acc[model] = (acc[model] || 0) + 1
      }
      return acc
    }, {} as Record<string, number>) || {}

    const topSellingCars = Object.entries(carSales)
      .map(([carModel, orders]) => ({ carModel, orders }))
      .sort((a, b) => b.orders - a.orders)
      .slice(0, 5)

    // Get recent orders and schedules
    const { data: recentOrders } = await supabase
      .from('orders')
      .select('*')
      .order('booking_date', { ascending: false })
      .limit(5)

    console.log('Recent orders:', recentOrders)

    // Transform recent orders to camelCase
    const transformedRecentOrders = (recentOrders || []).map(order => ({
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

    const analytics = {
      totalUsers: totalUsers || 0,
      totalOrders: totalOrders || 0,
      totalSchedules: totalSchedules || 0,
      totalRevenue,
      pendingPayments,
      monthlyRevenue: monthlyRevenueData,
      topSellingCars,
      recentOrders: transformedRecentOrders,
    }

    console.log('Final analytics object:', analytics)
    return NextResponse.json(analytics)
  } catch (error) {
    console.error('Error in analytics API:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 