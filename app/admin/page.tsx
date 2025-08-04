'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Header } from '@/components/Header'
import { useAuth } from '@/components/AuthProvider'
import { AdminDashboard, AdminUser, AdminOrder, AdminSchedule, AdminAnalytics } from '@/types/admin'
import { Car } from '@/types/car'
import { AddCarForm } from '@/components/AddCarForm'
import Image from 'next/image'

export default function AdminPage() {
  const router = useRouter()
  const { user, isLoading: authLoading } = useAuth()
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'orders' | 'schedules' | 'cars'>('overview')
  const [dashboardData, setDashboardData] = useState<AdminDashboard>({
    analytics: {
      totalUsers: 0,
      totalOrders: 0,
      totalSchedules: 0,
      totalRevenue: 0,
      pendingPayments: 0,
      monthlyRevenue: [],
      topSellingCars: [],
      recentOrders: [],
      recentSchedules: [],
    },
    users: [],
    orders: [],
    schedules: [],
  })
  const [cars, setCars] = useState<Car[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showAddCarModal, setShowAddCarModal] = useState(false)
  const [showOrderModal, setShowOrderModal] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState<AdminOrder | null>(null)
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null)
  const [selectedSchedule, setSelectedSchedule] = useState<AdminSchedule | null>(null)
  const [showUserModal, setShowUserModal] = useState(false)
  const [showScheduleModal, setShowScheduleModal] = useState(false)
  const [showAddCarForm, setShowAddCarForm] = useState(false)

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

    // Check if user is admin
    const isAdmin = user.role === 'admin' || user.email === 'admin@autoshowcase.com'
    if (!isAdmin) {
      router.push('/')
      return
    }

    // Load admin data from Supabase
    const loadAdminData = async () => {
      setIsLoading(true)
      
      try {
        // Fetch all data from APIs
        const [analyticsResponse, usersResponse, ordersResponse, schedulesResponse, carsResponse] = await Promise.all([
          fetch('/api/admin/analytics'),
          fetch('/api/admin/users'),
          fetch('/api/admin/orders'),
          fetch('/api/admin/schedules'),
          fetch('/api/admin/cars')
        ])

        const analytics = analyticsResponse.ok ? await analyticsResponse.json() : {
          totalUsers: 0,
          totalOrders: 0,
          totalSchedules: 0,
          totalRevenue: 0,
          pendingPayments: 0,
          monthlyRevenue: [],
          topSellingCars: [],
          recentOrders: [],
        }

        const users = usersResponse.ok ? await usersResponse.json() : []
        const orders = ordersResponse.ok ? await ordersResponse.json() : []
        const schedules = schedulesResponse.ok ? await schedulesResponse.json() : []
        const carsData = carsResponse.ok ? await carsResponse.json() : []

        // Debug logging
        console.log('Admin data loaded:', {
          analytics,
          users: users.length,
          orders: orders.length,
          schedules: schedules.length,
          cars: carsData.length
        })

        // Detailed debugging
        console.log('Analytics data:', analytics)
        console.log('Orders data:', orders)
        console.log('Schedules data:', schedules)
        console.log('Users data:', users)
        console.log('Cars data:', carsData)

        setDashboardData({
          analytics: analytics,
          users,
          orders,
          schedules,
        })
        setCars(carsData)
      } catch (error) {
        console.error('Error loading admin data:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadAdminData()
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

  // Don't render anything if not authenticated or not admin
  if (!user) {
    return null
  }

  // Check if user is admin
  const isAdmin = user.role === 'admin' || user.email === 'admin@autoshowcase.com'
  if (!isAdmin) {
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
      return date.toLocaleDateString('en-IN', {
        year: 'numeric',
        month: 'short',
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
      case 'active':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-200'
      case 'inactive':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-200'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-200'
    }
  }

  const getStatusText = (status: string) => {
    return status.charAt(0).toUpperCase() + status.slice(1)
  }

  const handleCarAdded = async () => {
    // Reload all admin data to update counts
    setIsLoading(true)
    try {
      const [analyticsResponse, carsResponse] = await Promise.all([
        fetch('/api/admin/analytics'),
        fetch('/api/admin/cars')
      ])

      const analytics = analyticsResponse.ok ? await analyticsResponse.json() : {
        totalUsers: 0,
        totalOrders: 0,
        totalSchedules: 0,
        totalRevenue: 0,
        pendingPayments: 0,
        monthlyRevenue: [],
        topSellingCars: [],
        recentOrders: [],
      }

      const carsData = carsResponse.ok ? await carsResponse.json() : []

      setDashboardData(prev => ({
        ...prev!,
        analytics: analytics,
      }))
      setCars(carsData)
    } catch (error) {
      console.error('Error reloading admin data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteCar = async (carId: number) => {
    if (confirm('Are you sure you want to delete this car?')) {
      try {
        const response = await fetch(`/api/admin/cars?id=${carId}`, {
          method: 'DELETE',
        })
        
        if (response.ok) {
          // Remove car from state
          setCars(prev => prev.filter(car => car.id !== carId))
        } else {
          alert('Failed to delete car')
        }
      } catch (error) {
        alert('Failed to delete car')
      }
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
            <p className="mt-4 text-gray-600 dark:text-gray-400">Loading admin dashboard...</p>
          </div>
        </div>
      </div>
    )
  }

  if (!dashboardData) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <p className="text-gray-600 dark:text-gray-400">No data available</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Admin Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Admin Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage users, orders, schedules, and view analytics
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                  </svg>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Users</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{dashboardData.analytics.totalUsers}</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Orders</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{dashboardData.analytics.totalOrders}</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Test Drives</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{dashboardData.analytics.totalSchedules}</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-yellow-100 dark:bg-yellow-900/20 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-yellow-600 dark:text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c1.11 0-2.08-.402-2.599-1" />
                  </svg>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Pending Payments</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{formatPrice(dashboardData.analytics.pendingPayments)}</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-indigo-100 dark:bg-indigo-900/20 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-indigo-600 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c1.11 0-2.08-.402-2.599-1" />
                  </svg>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Revenue</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{formatPrice(dashboardData.analytics.totalRevenue)}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
          <div className="border-b border-gray-200 dark:border-gray-700">
            <nav className="flex space-x-8 px-6">
              {[
                { id: 'overview', name: 'Overview' },
                { id: 'users', name: 'Users' },
                { id: 'orders', name: 'Orders' },
                { id: 'schedules', name: 'Test Drives' },
                { id: 'cars', name: 'Cars' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                      : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                  }`}
                >
                  {tab.name}
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            {activeTab === 'overview' && (
              <div className="space-y-8">
                {/* Revenue Chart */}
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Monthly Revenue</h3>
                  <div className="flex items-end space-x-2 h-32">
                    {dashboardData.analytics.monthlyRevenue.map((item, index) => (
                      <div key={index} className="flex-1 flex flex-col items-center">
                        <div
                          className="w-full bg-primary-600 rounded-t"
                          style={{
                            height: `${(item.revenue / Math.max(...dashboardData.analytics.monthlyRevenue.map(r => r.revenue))) * 100}%`,
                          }}
                        ></div>
                        <span className="text-xs text-gray-600 dark:text-gray-400 mt-2">{item.month}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Top Selling Cars */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Top Selling Cars</h3>
                    <div className="space-y-3">
                      {dashboardData.analytics.topSellingCars.map((car, index) => (
                        <div key={index} className="flex justify-between items-center">
                          <span className="text-sm text-gray-600 dark:text-gray-400">{car.carModel}</span>
                          <span className="text-sm font-medium text-gray-900 dark:text-white">{car.orders} orders</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Recent Activity */}
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Recent Orders</h3>
                    <div className="space-y-3">
                      {dashboardData.analytics.recentOrders?.map((order) => (
                        <div key={order.id} className="flex justify-between items-center">
                          <div>
                            <p className="text-sm font-medium text-gray-900 dark:text-white">{order.carModel}</p>
                            <p className="text-xs text-gray-600 dark:text-gray-400">{order.customerName}</p>
                          </div>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                            {getStatusText(order.status)}
                          </span>
                        </div>
                      )) || (
                        <p className="text-sm text-gray-500 dark:text-gray-400">No recent orders</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'users' && (
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">User Management</h3>
                  <button className="btn-primary text-sm">Add User</button>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-700">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">User</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Role</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Joined</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                      {dashboardData.users.map((user) => (
                        <tr key={user.id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div>
                              <div className="text-sm font-medium text-gray-900 dark:text-white">{user.name}</div>
                              <div className="text-sm text-gray-500 dark:text-gray-400">{user.email}</div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              user.role === 'admin' ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-200' : 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-200'
                            }`}>
                              {user.role}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(user.status)}`}>
                              {getStatusText(user.status)}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                            {formatDate(user.createdAt)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <button
                              onClick={() => {
                                setSelectedUser(user)
                                setShowUserModal(true)
                              }}
                              className="text-primary-600 hover:text-primary-900 dark:text-primary-400 dark:hover:text-primary-300"
                            >
                              View Details
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === 'orders' && (
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">Order Management</h3>
                  <button className="btn-primary text-sm">Export Orders</button>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-700">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Order</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Customer</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Car</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Amount</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                      {dashboardData.orders.map((order) => (
                        <tr key={order.id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900 dark:text-white">{order.orderId || 'N/A'}</div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">{formatDate(order.bookingDate)}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div>
                              <div className="text-sm font-medium text-gray-900 dark:text-white">{order.customerName || 'N/A'}</div>
                              <div className="text-sm text-gray-500 dark:text-gray-400">{order.customerEmail || 'N/A'}</div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                            {order.carModel || 'N/A'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                            {formatPrice(order.carPrice)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                              {getStatusText(order.status)}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <button
                              onClick={() => {
                                setSelectedOrder(order)
                                setShowOrderModal(true)
                              }}
                              className="text-primary-600 hover:text-primary-900 dark:text-primary-400 dark:hover:text-primary-300"
                            >
                              View Details
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === 'schedules' && (
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">Test Drive Management</h3>
                  <button className="btn-primary text-sm">Export Schedules</button>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-700">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Schedule</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Customer</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Car</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Date & Time</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                      {dashboardData.schedules.map((schedule) => (
                        <tr key={schedule.id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900 dark:text-white">#{schedule.id}</div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">{formatDate(schedule.scheduleDate)}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div>
                              <div className="text-sm font-medium text-gray-900 dark:text-white">{schedule.customerName || 'N/A'}</div>
                              <div className="text-sm text-gray-500 dark:text-gray-400">{schedule.customerEmail || 'N/A'}</div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                            {schedule.carModel || 'N/A'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900 dark:text-white">{formatDate(schedule.preferredDate)}</div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">{schedule.preferredTime || 'N/A'}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(schedule.status)}`}>
                              {getStatusText(schedule.status)}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <button
                              onClick={() => {
                                setSelectedSchedule(schedule)
                                setShowScheduleModal(true)
                              }}
                              className="text-primary-600 hover:text-primary-900 dark:text-primary-400 dark:hover:text-primary-300"
                            >
                              View Details
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

                         {activeTab === 'cars' && (
               <div>
                 <div className="flex justify-between items-center mb-4">
                   <h3 className="text-lg font-medium text-gray-900 dark:text-white">Car Inventory Management</h3>
                   <button 
                     onClick={() => setShowAddCarForm(true)}
                     className="btn-primary text-sm"
                   >
                     Add New Car
                   </button>
                 </div>
                 
                 <div className="overflow-x-auto">
                   <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                     <thead className="bg-gray-50 dark:bg-gray-700">
                       <tr>
                         <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Car</th>
                         <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Type</th>
                         <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Year</th>
                         <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Price</th>
                         <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Stock</th>
                         <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
                       </tr>
                     </thead>
                     <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                       {cars.map((car) => (
                         <tr key={car.id}>
                           <td className="px-6 py-4 whitespace-nowrap">
                             <div className="flex items-center">
                               <div className="flex-shrink-0 h-12 w-12">
                                 <Image
                                   className="h-12 w-12 rounded-lg object-cover"
                                   src={car.image_url || 'https://picsum.photos/seed/car/400/300'}
                                   alt={car.model}
                                   width={48}
                                   height={48}
                                 />
                               </div>
                               <div className="ml-4">
                                 <div className="text-sm font-medium text-gray-900 dark:text-white">{car.model}</div>
                                 <div className="text-sm text-gray-500 dark:text-gray-400">ID: {car.id}</div>
                               </div>
                             </div>
                           </td>
                           <td className="px-6 py-4 whitespace-nowrap">
                             <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                               car.type === 'SUV' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-200' :
                               car.type === 'Sedan' ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-200' :
                               car.type === 'Hatchback' ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-200' :
                               'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-200'
                             }`}>
                               {car.type}
                             </span>
                           </td>
                           <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                             {car.model_year}
                           </td>
                           <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                             {formatPrice(car.price)}
                           </td>
                           <td className="px-6 py-4 whitespace-nowrap">
                             <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                               car.units_available > 5 ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-200' :
                               car.units_available > 0 ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-200' :
                               'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-200'
                             }`}>
                               {car.units_available} units
                             </span>
                           </td>
                           <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                             <button
                               onClick={() => handleDeleteCar(car.id)}
                               className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                             >
                               Delete
                             </button>
                           </td>
                         </tr>
                       ))}
                     </tbody>
                   </table>
                 </div>
               </div>
             )}
          </div>
        </div>
      </main>

      {/* User Details Modal */}
      {showUserModal && selectedUser && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white dark:bg-gray-800">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">User Details</h3>
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Name</label>
                  <p className="text-sm text-gray-900 dark:text-white">{selectedUser.name}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
                  <p className="text-sm text-gray-900 dark:text-white">{selectedUser.email}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Phone</label>
                  <p className="text-sm text-gray-900 dark:text-white">{selectedUser.phone || 'Not provided'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Role</label>
                  <p className="text-sm text-gray-900 dark:text-white capitalize">{selectedUser.role}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Status</label>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedUser.status)}`}>
                    {getStatusText(selectedUser.status)}
                  </span>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Joined</label>
                  <p className="text-sm text-gray-900 dark:text-white">{formatDate(selectedUser.createdAt)}</p>
                </div>
                {selectedUser.lastLogin && (
                  <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Last Login</label>
                    <p className="text-sm text-gray-900 dark:text-white">{formatDate(selectedUser.lastLogin)}</p>
                  </div>
                )}
              </div>
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  onClick={() => setShowUserModal(false)}
                  className="btn-secondary"
                >
                  Close
                </button>
                <button className="btn-primary">
                  Edit User
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Order Details Modal */}
      {showOrderModal && selectedOrder && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white dark:bg-gray-800">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Order Details</h3>
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Order ID</label>
                  <p className="text-sm text-gray-900 dark:text-white">{selectedOrder.orderId}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Car Model</label>
                  <p className="text-sm text-gray-900 dark:text-white">{selectedOrder.carModel}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Customer</label>
                  <p className="text-sm text-gray-900 dark:text-white">{selectedOrder.customerName}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{selectedOrder.customerEmail}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Total Price</label>
                  <p className="text-sm text-gray-900 dark:text-white">{formatPrice(selectedOrder.carPrice)}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Payment Type</label>
                  <p className="text-sm text-gray-900 dark:text-white capitalize">{selectedOrder.paymentType}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Status</label>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedOrder.status)}`}>
                    {getStatusText(selectedOrder.status)}
                  </span>
                </div>
                {selectedOrder.adminNotes && (
                  <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Admin Notes</label>
                    <p className="text-sm text-gray-900 dark:text-white">{selectedOrder.adminNotes}</p>
                  </div>
                )}
              </div>
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  onClick={() => setShowOrderModal(false)}
                  className="btn-secondary"
                >
                  Close
                </button>
                <button className="btn-primary">
                  Update Status
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Schedule Details Modal */}
      {showScheduleModal && selectedSchedule && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white dark:bg-gray-800">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Schedule Details</h3>
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Schedule ID</label>
                  <p className="text-sm text-gray-900 dark:text-white">#{selectedSchedule.id}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Car Model</label>
                  <p className="text-sm text-gray-900 dark:text-white">{selectedSchedule.carModel}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Customer</label>
                  <p className="text-sm text-gray-900 dark:text-white">{selectedSchedule.customerName}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{selectedSchedule.customerEmail}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Preferred Date</label>
                  <p className="text-sm text-gray-900 dark:text-white">{formatDate(selectedSchedule.preferredDate)}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Preferred Time</label>
                  <p className="text-sm text-gray-900 dark:text-white">{selectedSchedule.preferredTime}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Status</label>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedSchedule.status)}`}>
                    {getStatusText(selectedSchedule.status)}
                  </span>
                </div>
                {selectedSchedule.additionalNotes && (
                  <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Customer Notes</label>
                    <p className="text-sm text-gray-900 dark:text-white">{selectedSchedule.additionalNotes}</p>
                  </div>
                )}
                {selectedSchedule.adminNotes && (
                  <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Admin Notes</label>
                    <p className="text-sm text-gray-900 dark:text-white">{selectedSchedule.adminNotes}</p>
                  </div>
                )}
              </div>
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  onClick={() => setShowScheduleModal(false)}
                  className="btn-secondary"
                >
                  Close
                </button>
                <button className="btn-primary">
                  Update Status
                </button>
              </div>
            </div>
          </div>
                 </div>
       )}

       {/* Add Car Form Modal */}
       {showAddCarForm && (
         <AddCarForm
           onClose={() => setShowAddCarForm(false)}
           onSuccess={handleCarAdded}
         />
       )}
     </div>
   )
 } 