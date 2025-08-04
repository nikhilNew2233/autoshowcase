'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Fragment } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { XMarkIcon } from '@heroicons/react/24/outline'
import { Car } from '@/types/car'
import { useAuth } from './AuthProvider'

interface BuyFormProps {
  car: Car
  onClose: () => void
}

export function BuyForm({ car, onClose }: BuyFormProps) {
  const router = useRouter()
  const { user } = useAuth()
  const [paymentType, setPaymentType] = useState<'reservation' | 'full'>('reservation')

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
    }).format(price)
  }

  const calculateReservationAmount = () => {
    return Math.round(car.price * 0.1) // 10% reservation amount
  }

  const handleBuyNow = () => {
    if (!user) {
      router.push('/login')
      onClose()
      return
    }

    const reservationAmount = paymentType === 'reservation' ? calculateReservationAmount() : car.price
    // Redirect to payment page with car details and payment type
    router.push(`/payment?carId=${car.id}&price=${car.price}&model=${encodeURIComponent(car.model)}&type=${paymentType}&reservationAmount=${reservationAmount}`)
    onClose()
  }

  return (
    <Transition.Root show={true} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white dark:bg-gray-800 px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
                <div className="absolute right-0 top-0 hidden pr-4 pt-4 sm:block">
                  <button
                    type="button"
                    className="rounded-md bg-white dark:bg-gray-800 text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                    onClick={onClose}
                  >
                    <span className="sr-only">Close</span>
                    <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                  </button>
                </div>

                <div className="sm:flex sm:items-start">
                  <div className="w-full">
                    <Dialog.Title as="h3" className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                      Purchase {car.model}
                    </Dialog.Title>
                    <p className="text-lg text-primary-600 font-semibold mb-6">
                      {formatPrice(car.price)}
                    </p>

                                         <div className="space-y-4">
                       <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                         <h4 className="font-medium text-gray-900 dark:text-white mb-2">Order Summary</h4>
                         <div className="space-y-2 text-sm">
                           <div className="flex justify-between">
                             <span className="text-gray-600 dark:text-gray-400">Car Model:</span>
                             <span className="text-gray-900 dark:text-white">{car.model}</span>
                           </div>
                           <div className="flex justify-between">
                             <span className="text-gray-600 dark:text-gray-400">Type:</span>
                             <span className="text-gray-900 dark:text-white">{car.type}</span>
                           </div>
                           <div className="flex justify-between">
                             <span className="text-gray-600 dark:text-gray-400">Year:</span>
                             <span className="text-gray-900 dark:text-white">{car.model_year}</span>
                           </div>
                           <div className="flex justify-between">
                             <span className="text-gray-600 dark:text-gray-400">Available:</span>
                             <span className="text-gray-900 dark:text-white">{car.units_available} units</span>
                           </div>
                           <div className="flex justify-between">
                             <span className="text-gray-600 dark:text-gray-400">Total Price:</span>
                             <span className="text-gray-900 dark:text-white font-semibold">{formatPrice(car.price)}</span>
                           </div>
                         </div>
                       </div>

                       {/* Payment Type Selection */}
                       <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                         <h4 className="font-medium text-gray-900 dark:text-white mb-3">Payment Options</h4>
                         <div className="space-y-3">
                           <label className="flex items-center space-x-3 cursor-pointer">
                             <input
                               type="radio"
                               name="paymentType"
                               value="reservation"
                               checked={paymentType === 'reservation'}
                               onChange={(e) => setPaymentType(e.target.value as 'reservation' | 'full')}
                               className="text-primary-600 focus:ring-primary-500"
                             />
                             <div className="flex-1">
                               <div className="flex justify-between items-center">
                                 <span className="text-sm font-medium text-gray-900 dark:text-white">
                                   Reserve Car (Advance Booking)
                                 </span>
                                 <span className="text-sm font-semibold text-primary-600">
                                   {formatPrice(calculateReservationAmount())}
                                 </span>
                               </div>
                               <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                                 10% advance payment to reserve your car
                               </p>
                             </div>
                           </label>
                           
                           <label className="flex items-center space-x-3 cursor-pointer">
                             <input
                               type="radio"
                               name="paymentType"
                               value="full"
                               checked={paymentType === 'full'}
                               onChange={(e) => setPaymentType(e.target.value as 'reservation' | 'full')}
                               className="text-primary-600 focus:ring-primary-500"
                             />
                             <div className="flex-1">
                               <div className="flex justify-between items-center">
                                 <span className="text-sm font-medium text-gray-900 dark:text-white">
                                   Full Payment
                                 </span>
                                 <span className="text-sm font-semibold text-primary-600">
                                   {formatPrice(car.price)}
                                 </span>
                               </div>
                               <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                                 Pay the complete amount upfront
                               </p>
                             </div>
                           </label>
                         </div>
                       </div>

                      {user ? (
                        <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
                          <p className="text-sm text-green-800 dark:text-green-200">
                            <strong>Welcome back, {user.name}!</strong><br />
                            You&apos;re logged in and ready to complete your purchase.
                          </p>
                        </div>
                      ) : (
                        <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-4">
                          <p className="text-sm text-yellow-800 dark:text-yellow-200">
                            <strong>Login Required</strong><br />
                            Please log in to complete your purchase.
                          </p>
                        </div>
                      )}

                      <div className="space-y-3">
                        <button
                          onClick={handleBuyNow}
                          className="w-full btn-primary"
                        >
                          {user ? 'Proceed to Payment' : 'Login & Continue'}
                        </button>
                        
                        <button
                          type="button"
                          onClick={onClose}
                          className="w-full btn-secondary"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  )
} 