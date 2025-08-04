export interface AdminUser {
  id: string
  name: string
  email: string
  phone?: string
  role: 'user' | 'admin'
  createdAt: string
  lastLogin?: string
  status: 'active' | 'inactive'
}

export interface AdminOrder {
  id: string
  orderId: string
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
  adminNotes?: string
}

export interface AdminSchedule {
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
  adminNotes?: string
}

export interface AdminAnalytics {
  totalUsers: number
  totalOrders: number
  totalSchedules: number
  totalRevenue: number
  pendingPayments: number
  monthlyRevenue: { month: string; revenue: number }[]
  topSellingCars: { carModel: string; orders: number }[]
  recentOrders: AdminOrder[]
  recentSchedules: AdminSchedule[]
}

export interface AdminDashboard {
  analytics: AdminAnalytics
  users: AdminUser[]
  orders: AdminOrder[]
  schedules: AdminSchedule[]
}

export interface AdminAction {
  id: string
  type: 'order_status_update' | 'schedule_status_update' | 'user_status_update' | 'car_added' | 'car_updated'
  description: string
  adminName: string
  timestamp: string
  details?: any
} 