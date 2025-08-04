'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { Header } from '@/components/Header'
import { useAuth } from '@/components/AuthProvider'

export default function PaymentSuccessPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { user } = useAuth()

  const carId = searchParams.get('carId')
  const carPrice = searchParams.get('price')
  const carModel = searchParams.get('model')
  const paymentType = searchParams.get('type') || 'reservation'
  const reservationAmount = searchParams.get('reservationAmount') || '0'

  const formatPrice = (price: string) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
    }).format(parseInt(price))
  }

  if (!carId || !carPrice || !carModel) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Invalid order
            </h2>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              Please try again.
            </p>
          </div>
        </div>
      </div>
    )
  }

  const isReservation = paymentType === 'reservation'
  const amountPaid = parseInt(reservationAmount)
  const totalPrice = parseInt(carPrice)
  const remainingAmount = totalPrice - amountPaid

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      
      <main className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-8 text-center">
          {/* Success Icon */}
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 dark:bg-green-900 mb-6">
            <svg className="h-8 w-8 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>

                     <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
             {isReservation ? 'Reservation Successful!' : 'Payment Successful!'}
           </h1>
           
           <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
             {isReservation 
               ? 'Thank you for reserving your car. Your booking has been confirmed.'
               : 'Thank you for your purchase. Your order has been confirmed.'
             }
           </p>

          {/* Order Details */}
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6 mb-8">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Order Details
            </h2>
            
                         <div className="space-y-3 text-left">
               <div className="flex justify-between">
                 <span className="text-gray-600 dark:text-gray-400">Order ID:</span>
                 <span className="font-medium text-gray-900 dark:text-white">
                   #{Date.now().toString().slice(-8)}
                 </span>
               </div>
               
               <div className="flex justify-between">
                 <span className="text-gray-600 dark:text-gray-400">Car Model:</span>
                 <span className="font-medium text-gray-900 dark:text-white">{carModel}</span>
               </div>
               
               {isReservation ? (
                 <>
                   <div className="flex justify-between">
                     <span className="text-gray-600 dark:text-gray-400">Total Price:</span>
                     <span className="font-medium text-gray-900 dark:text-white">{formatPrice(carPrice)}</span>
                   </div>
                   
                   <div className="flex justify-between">
                     <span className="text-gray-600 dark:text-gray-400">Reservation Amount:</span>
                     <span className="font-medium text-primary-600">{formatPrice(reservationAmount)}</span>
                   </div>
                   
                   <div className="flex justify-between">
                     <span className="text-gray-600 dark:text-gray-400">Remaining Amount:</span>
                     <span className="font-medium text-gray-900 dark:text-white">{formatPrice(remainingAmount.toString())}</span>
                   </div>
                   
                   <div className="flex justify-between">
                     <span className="text-gray-600 dark:text-gray-400">Payment Method:</span>
                     <span className="font-medium text-gray-900 dark:text-white">UPI</span>
                   </div>
                   
                   <div className="flex justify-between">
                     <span className="text-gray-600 dark:text-gray-400">Reservation Date:</span>
                     <span className="font-medium text-gray-900 dark:text-white">
                       {new Date().toLocaleDateString()}
                     </span>
                   </div>
                   
                   <div className="flex justify-between">
                     <span className="text-gray-600 dark:text-gray-400">Valid Until:</span>
                     <span className="font-medium text-gray-900 dark:text-white">
                       {new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString()}
                     </span>
                   </div>
                 </>
               ) : (
                 <>
                   <div className="flex justify-between">
                     <span className="text-gray-600 dark:text-gray-400">Amount Paid:</span>
                     <span className="font-medium text-primary-600">{formatPrice(carPrice)}</span>
                   </div>
                   
                   <div className="flex justify-between">
                     <span className="text-gray-600 dark:text-gray-400">Payment Method:</span>
                     <span className="font-medium text-gray-900 dark:text-white">UPI</span>
                   </div>
                   
                   <div className="flex justify-between">
                     <span className="text-gray-600 dark:text-gray-400">Date:</span>
                     <span className="font-medium text-gray-900 dark:text-white">
                       {new Date().toLocaleDateString()}
                     </span>
                   </div>
                 </>
               )}
             </div>
          </div>

          {/* Next Steps */}
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6 mb-8">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              What&apos;s Next?
            </h3>
            
                         <div className="space-y-3 text-left">
               {isReservation ? (
                 <>
                   <div className="flex items-start space-x-3">
                     <div className="flex-shrink-0 w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
                       <span className="text-white text-xs font-bold">1</span>
                     </div>
                     <div>
                       <p className="text-sm font-medium text-gray-900 dark:text-white">
                         Reservation Confirmation
                       </p>
                       <p className="text-sm text-gray-600 dark:text-gray-400">
                         Your car is reserved for 7 days. Pay remaining amount to confirm.
                       </p>
                     </div>
                   </div>
                   
                   <div className="flex items-start space-x-3">
                     <div className="flex-shrink-0 w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
                       <span className="text-white text-xs font-bold">2</span>
                     </div>
                     <div>
                       <p className="text-sm font-medium text-gray-900 dark:text-white">
                         Complete Payment
                       </p>
                       <p className="text-sm text-gray-600 dark:text-gray-400">
                         Pay remaining ₹{remainingAmount.toLocaleString()} within 7 days.
                       </p>
                     </div>
                   </div>
                   
                   <div className="flex items-start space-x-3">
                     <div className="flex-shrink-0 w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
                       <span className="text-white text-xs font-bold">3</span>
                     </div>
                     <div>
                       <p className="text-sm font-medium text-gray-900 dark:text-white">
                         Vehicle Delivery
                       </p>
                       <p className="text-sm text-gray-600 dark:text-gray-400">
                         After full payment, we&apos;ll arrange delivery within 48 hours.
                       </p>
                     </div>
                   </div>
                 </>
               ) : (
                 <>
                   <div className="flex items-start space-x-3">
                     <div className="flex-shrink-0 w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
                       <span className="text-white text-xs font-bold">1</span>
                     </div>
                     <div>
                       <p className="text-sm font-medium text-gray-900 dark:text-white">
                         Order Confirmation Email
                       </p>
                       <p className="text-sm text-gray-600 dark:text-gray-400">
                         You&apos;ll receive a confirmation email within 5 minutes.
                       </p>
                     </div>
                   </div>
                   
                   <div className="flex items-start space-x-3">
                     <div className="flex-shrink-0 w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
                       <span className="text-white text-xs font-bold">2</span>
                     </div>
                     <div>
                       <p className="text-sm font-medium text-gray-900 dark:text-white">
                         Vehicle Delivery
                       </p>
                       <p className="text-sm text-gray-600 dark:text-gray-400">
                         Our team will contact you within 24 hours to arrange delivery.
                       </p>
                     </div>
                   </div>
                   
                   <div className="flex items-start space-x-3">
                     <div className="flex-shrink-0 w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
                       <span className="text-white text-xs font-bold">3</span>
                     </div>
                     <div>
                       <p className="text-sm font-medium text-gray-900 dark:text-white">
                         Documentation
                       </p>
                       <p className="text-sm text-gray-600 dark:text-gray-400">
                         All vehicle documents will be provided upon delivery.
                       </p>
                     </div>
                   </div>
                 </>
               )}
             </div>
          </div>

          {/* Contact Information */}
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6 mb-8">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Need Help?
            </h3>
            
            <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <p><strong>Phone:</strong> +91 98765 43210</p>
              <p><strong>Email:</strong> support@autoshowcase.com</p>
              <p><strong>Hours:</strong> Monday - Sunday, 9:00 AM - 7:00 PM</p>
            </div>
          </div>

                     {/* Action Buttons */}
           <div className="space-y-4">
             <button
               onClick={() => router.push('/dashboard')}
               className="w-full btn-primary"
             >
               View My Orders
             </button>
             
             <button
               onClick={() => router.push('/')}
               className="w-full btn-secondary"
             >
               Continue Shopping
             </button>
           </div>
        </div>
      </main>
    </div>
  )
} 