export interface Booking {
  id: string
  carId: number
  carModel: string
  carPrice: number
  customerName: string
  customerEmail: string
  customerPhone?: string
  bookingDate: string
  paymentType: 'reservation' | 'full'
  reservationAmount: number
  remainingAmount: number
  paymentMethod: string
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled'
  deliveryDate?: string
  orderId: string
}

export interface Schedule {
  id: string
  carId: number
  carModel: string
  customerName: string
  customerEmail: string
  customerPhone?: string
  preferredDate: string
  preferredTime: string
  additionalNotes?: string
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled'
  scheduleDate: string
}

export interface UserDashboard {
  bookings: Booking[]
  schedules: Schedule[]
  totalBookings: number
  totalSchedules: number
  pendingPayments: number
  totalSpent: number
} 