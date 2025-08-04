'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Header } from '@/components/Header'
import { useAuth } from '@/components/AuthProvider'
import { Booking, Schedule } from '@/types/booking'

export default function DashboardPage() {
  const router = useRouter()
  const { user, isLoading: authLoading } = useAuth()
  const [activeTab, setActiveTab] = useState<'bookings' | 'schedules'>('bookings')
  const [bookings, setBookings] = useState<Booking[]>([])
  const [schedules, setSchedules] = useState<Schedule[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Don't load data if still checking authentication
    if (authLoading) {
      return
    }

    // Redirect to login if not authenticated
    if (!user) {
      router.push('/login')
      return
    }

    // Load user data from database
    const loadUserData = async () => {
      setIsLoading(true)
      
      try {
        console.log('Loading data for user:', user)
        console.log('User ID:', user.id)

        // Fetch user orders
        const ordersResponse = await fetch(`/api/user/orders?userId=${user.id}`)
        console.log('Orders response status:', ordersResponse.status)
        if (ordersResponse.ok) {
          const ordersData = await ordersResponse.json()
          console.log('Orders data:', ordersData)
          setBookings(ordersData)
        } else {
          console.error('Failed to fetch orders:', await ordersResponse.text())
        }

        // Fetch user schedules from API
        const schedulesResponse = await fetch(`/api/schedules?userId=${user.id}`)
        console.log('Schedules response status:', schedulesResponse.status)
        if (schedulesResponse.ok) {
          const schedulesData = await schedulesResponse.json()
          console.log('Schedules data:', schedulesData)
          setSchedules(schedulesData)
        } else {
          console.error('Failed to fetch schedules:', await schedulesResponse.text())
          setSchedules([])
        }
      } catch (error) {
        console.error('Error loading user data:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadUserData()
  }, [user, authLoading, router])

  // Show loading state while checking authentication
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Header />
        <div className="flex items-center justify-center min-h-[calc(100vh-64px)]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400">Loading...</p>
          </div>
        </div>
      </div>
    )
  }

  // Don't render anything if not authenticated
  if (!user) {
    return null
  }

  const formatPrice = (price: number | null | undefined) => {
    if (price === null || price === undefined || isNaN(price)) {
      return '₹0'
    }
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
    }).format(price)
  }

  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString || dateString === 'Invalid Date' || dateString === 'null') {
      return 'N/A'
    }
    try {
      const date = new Date(dateString)
      if (isNaN(date.getTime())) {
        return 'N/A'
      }
      return new Date(dateString).toLocaleDateString('en-IN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    } catch (error) {
      return 'N/A'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-200'
      case 'confirmed':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-200'
      case 'completed':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-200'
      case 'cancelled':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-200'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-200'
    }
  }

  const getStatusText = (status: string) => {
    return status.charAt(0).toUpperCase() + status.slice(1)
  }

  const totalSpent = bookings
    .filter(booking => booking.status === 'confirmed' || booking.status === 'completed')
    .reduce((sum, booking) => sum + booking.reservationAmount, 0)

  const pendingPayments = bookings
    .filter(booking => booking.status === 'pending' && booking.paymentType === 'reservation')
    .reduce((sum, booking) => sum + booking.remainingAmount, 0)

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Dashboard Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Welcome back, {user.name}!
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage your bookings and test drive schedules
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Bookings</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{bookings.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Test Drives</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{schedules.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-yellow-100 dark:bg-yellow-900/20 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-yellow-600 dark:text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                  </svg>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Pending Payment</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{formatPrice(pendingPayments)}</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                  </svg>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Spent</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{formatPrice(totalSpent)}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
          <div className="border-b border-gray-200 dark:border-gray-700">
            <nav className="flex space-x-8 px-6">
              <button
                onClick={() => setActiveTab('bookings')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'bookings'
                    ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                    : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                }`}
              >
                Bookings ({bookings.length})
              </button>
              <button
                onClick={() => setActiveTab('schedules')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'schedules'
                    ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                    : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                }`}
              >
                Test Drives ({schedules.length})
              </button>
            </nav>
          </div>

          <div className="p-6">
            {activeTab === 'bookings' ? (
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Your Bookings</h3>
                {bookings.length === 0 ? (
                  <div className="text-center py-8">
                    <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No bookings yet</h3>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Start by browsing our car collection.</p>
                    <div className="mt-6">
                      <button
                        onClick={() => router.push('/')}
                        className="btn-primary"
                      >
                        Browse Cars
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {bookings.map((booking) => (
                      <div key={booking.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-6">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h4 className="text-lg font-medium text-gray-900 dark:text-white">{booking.carModel}</h4>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Order ID: {booking.orderId}</p>
                          </div>
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
                            {getStatusText(booking.status)}
                          </span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                          <div>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Booking Date</p>
                            <p className="font-medium text-gray-900 dark:text-white">{formatDate(booking.bookingDate)}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Payment Type</p>
                            <p className="font-medium text-gray-900 dark:text-white capitalize">{booking.paymentType}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Total Price</p>
                            <p className="font-medium text-gray-900 dark:text-white">{formatPrice(booking.carPrice)}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Amount Paid</p>
                            <p className="font-medium text-primary-600">{formatPrice(booking.reservationAmount)}</p>
                          </div>
                          {booking.paymentType === 'reservation' && (
                            <div>
                              <p className="text-sm text-gray-600 dark:text-gray-400">Remaining Amount</p>
                              <p className="font-medium text-gray-900 dark:text-white">{formatPrice(booking.remainingAmount)}</p>
                            </div>
                          )}
                          {booking.deliveryDate && (
                            <div>
                              <p className="text-sm text-gray-600 dark:text-gray-400">Delivery Date</p>
                              <p className="font-medium text-gray-900 dark:text-white">{formatDate(booking.deliveryDate)}</p>
                            </div>
                          )}
                        </div>

                        {booking.status === 'pending' && booking.paymentType === 'reservation' && (
                          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
                            <p className="text-sm text-yellow-800 dark:text-yellow-200">
                              <strong>Action Required:</strong> Complete your payment of {formatPrice(booking.remainingAmount)} to confirm your booking.
                            </p>
                            <button
                              onClick={() => router.push(`/payment?carId=${booking.carId}&price=${booking.carPrice}&model=${encodeURIComponent(booking.carModel)}&type=full&reservationAmount=${booking.remainingAmount}`)}
                              className="mt-2 btn-primary text-sm"
                            >
                              Complete Payment
                            </button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Your Test Drive Schedules</h3>
                {schedules.length === 0 ? (
                  <div className="text-center py-8">
                    <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No test drives scheduled</h3>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Schedule a test drive to experience our cars.</p>
                    <div className="mt-6">
                      <button
                        onClick={() => router.push('/')}
                        className="btn-primary"
                      >
                        Browse Cars
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {schedules.map((schedule) => (
                      <div key={schedule.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-6">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h4 className="text-lg font-medium text-gray-900 dark:text-white">{schedule.carModel}</h4>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Schedule ID: {schedule.id}</p>
                          </div>
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(schedule.status)}`}>
                            {getStatusText(schedule.status)}
                          </span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                          <div>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Preferred Date</p>
                            <p className="font-medium text-gray-900 dark:text-white">{formatDate(schedule.preferredDate)}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Preferred Time</p>
                            <p className="font-medium text-gray-900 dark:text-white">{schedule.preferredTime}</p>
                          </div>
                          {schedule.additionalNotes && (
                            <div className="md:col-span-2">
                              <p className="text-sm text-gray-600 dark:text-gray-400">Additional Notes</p>
                              <p className="font-medium text-gray-900 dark:text-white">{schedule.additionalNotes}</p>
                            </div>
                          )}
                        </div>

                        {schedule.status === 'confirmed' && (
                          <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
                            <p className="text-sm text-green-800 dark:text-green-200">
                              <strong>Confirmed:</strong> Your test drive is confirmed. Please arrive 10 minutes before your scheduled time.
                            </p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
} 