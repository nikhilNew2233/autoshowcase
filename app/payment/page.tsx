'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Header } from '@/components/Header'
import { useAuth } from '@/components/AuthProvider'
import { Car } from '@/types/car'
import { PaymentFormData } from '@/types/payment'

export default function PaymentPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { user } = useAuth()
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState('')

  // Get car details from URL params (in real app, this would come from API)
  const carId = searchParams.get('carId')
  const carPrice = searchParams.get('price')
  const carModel = searchParams.get('model')
  const paymentType = searchParams.get('type') || 'reservation'
  const reservationAmount = searchParams.get('reservationAmount') || '0'

  const [formData, setFormData] = useState<PaymentFormData>({
    paymentMethod: 'UPI',
    upiId: '',
    cardNumber: '',
    cardHolder: '',
    expiryDate: '',
    cvv: '',
    address: '',
    city: '',
    postalCode: '',
    reservationAmount: parseInt(reservationAmount),
    fullPayment: paymentType === 'full',
  })

  const formatPrice = (price: string) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
    }).format(parseInt(price))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsProcessing(true)
    setError('')

    try {
      // Create order in database
      const orderData = {
        carId: parseInt(carId!),
        carModel: carModel!,
        carPrice: parseInt(carPrice!),
        customerName: user!.name,
        customerEmail: user!.email,
        customerPhone: user!.phone || '',
        paymentType,
        reservationAmount: parseInt(reservationAmount),
        remainingAmount: paymentType === 'reservation' ? parseInt(carPrice!) - parseInt(reservationAmount) : 0,
        paymentMethod: formData.paymentMethod,
        userId: user!.id,
      }

      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to create order')
      }

      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000))

      // Simulate payment success (90% success rate)
      const isSuccess = Math.random() > 0.1

      if (isSuccess) {
        router.push(`/payment-success?carId=${carId}&price=${carPrice}&model=${carModel}&type=${paymentType}&reservationAmount=${reservationAmount}`)
      } else {
        setError('Payment failed. Please try again.')
        setIsProcessing(false)
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to process payment')
      setIsProcessing(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Please login to continue
            </h2>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              You need to be logged in to complete your purchase.
            </p>
          </div>
        </div>
      </div>
    )
  }

  if (!carId || !carPrice || !carModel) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Invalid payment request
            </h2>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              Please select a car to purchase.
            </p>
          </div>
        </div>
      </div>
    )
  }

  const isReservation = paymentType === 'reservation'
  const amountToPay = isReservation ? parseInt(reservationAmount) : parseInt(carPrice)
  const remainingAmount = isReservation ? parseInt(carPrice) - parseInt(reservationAmount) : 0

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Payment Form */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-8">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              Payment Details
            </h1>

            {error && (
              <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Payment Method Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  Payment Method
                </label>
                <div className="space-y-3">
                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="UPI"
                      checked={formData.paymentMethod === 'UPI'}
                      onChange={(e) => setFormData({...formData, paymentMethod: e.target.value as 'UPI'})}
                      className="text-primary-600 focus:ring-primary-500"
                    />
                    <div>
                      <span className="text-sm font-medium text-gray-900 dark:text-white">UPI Payment</span>
                      <p className="text-xs text-gray-600 dark:text-gray-400">Pay using UPI ID</p>
                    </div>
                  </label>
                  
                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="Credit Card"
                      checked={formData.paymentMethod === 'Credit Card'}
                      onChange={(e) => setFormData({...formData, paymentMethod: e.target.value as 'Credit Card'})}
                      className="text-primary-600 focus:ring-primary-500"
                    />
                    <div>
                      <span className="text-sm font-medium text-gray-900 dark:text-white">Credit/Debit Card</span>
                      <p className="text-xs text-gray-600 dark:text-gray-400">Pay using card details</p>
                    </div>
                  </label>
                  
                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="Net Banking"
                      checked={formData.paymentMethod === 'Net Banking'}
                      onChange={(e) => setFormData({...formData, paymentMethod: e.target.value as 'Net Banking'})}
                      className="text-primary-600 focus:ring-primary-500"
                    />
                    <div>
                      <span className="text-sm font-medium text-gray-900 dark:text-white">Net Banking</span>
                      <p className="text-xs text-gray-600 dark:text-gray-400">Pay using net banking</p>
                    </div>
                  </label>
                </div>
              </div>

              {/* UPI Payment Fields */}
              {formData.paymentMethod === 'UPI' && (
                <div>
                  <label htmlFor="upiId" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    UPI ID
                  </label>
                  <input
                    type="text"
                    id="upiId"
                    name="upiId"
                    required
                    value={formData.upiId}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:border-primary-500 focus:ring-primary-500"
                    placeholder="example@upi"
                  />
                </div>
              )}

                             {/* Card Payment Fields */}
               {formData.paymentMethod === 'Credit Card' && (
                 <>
                   <div>
                     <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                       Card Number
                     </label>
                     <input
                       type="text"
                       id="cardNumber"
                       name="cardNumber"
                       required
                       value={formData.cardNumber}
                       onChange={handleChange}
                       className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:border-primary-500 focus:ring-primary-500"
                       placeholder="1234 5678 9012 3456"
                       maxLength={19}
                     />
                   </div>

                   <div className="grid grid-cols-2 gap-4">
                     <div>
                       <label htmlFor="cardHolder" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                         Card Holder Name
                       </label>
                       <input
                         type="text"
                         id="cardHolder"
                         name="cardHolder"
                         required
                         value={formData.cardHolder}
                         onChange={handleChange}
                         className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:border-primary-500 focus:ring-primary-500"
                         placeholder="John Doe"
                       />
                     </div>
                     <div>
                       <label htmlFor="expiryDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                         Expiry Date
                       </label>
                       <input
                         type="text"
                         id="expiryDate"
                         name="expiryDate"
                         required
                         value={formData.expiryDate}
                         onChange={handleChange}
                         className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:border-primary-500 focus:ring-primary-500"
                         placeholder="MM/YY"
                         maxLength={5}
                       />
                     </div>
                   </div>

                   <div className="grid grid-cols-2 gap-4">
                     <div>
                       <label htmlFor="cvv" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                         CVV
                       </label>
                       <input
                         type="text"
                         id="cvv"
                         name="cvv"
                         required
                         value={formData.cvv}
                         onChange={handleChange}
                         className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:border-primary-500 focus:ring-primary-500"
                         placeholder="123"
                         maxLength={4}
                       />
                     </div>
                   </div>

                   <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                     <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                       Billing Address
                     </h3>
                     
                     <div className="space-y-4">
                       <div>
                         <label htmlFor="address" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                           Address
                         </label>
                         <input
                           type="text"
                           id="address"
                           name="address"
                           required
                           value={formData.address}
                           onChange={handleChange}
                           className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:border-primary-500 focus:ring-primary-500"
                           placeholder="123 Main Street"
                         />
                       </div>

                       <div className="grid grid-cols-2 gap-4">
                         <div>
                           <label htmlFor="city" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                             City
                           </label>
                           <input
                             type="text"
                             id="city"
                             name="city"
                             required
                             value={formData.city}
                             onChange={handleChange}
                             className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:border-primary-500 focus:ring-primary-500"
                             placeholder="Mumbai"
                           />
                         </div>
                         <div>
                           <label htmlFor="postalCode" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                             Postal Code
                           </label>
                           <input
                             type="text"
                             id="postalCode"
                             name="postalCode"
                             required
                             value={formData.postalCode}
                             onChange={handleChange}
                             className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:border-primary-500 focus:ring-primary-500"
                             placeholder="400001"
                           />
                         </div>
                       </div>
                     </div>
                   </div>
                 </>
               )}

               <button
                 type="submit"
                 disabled={isProcessing}
                 className="w-full btn-primary disabled:opacity-50"
               >
                 {isProcessing ? 'Processing Payment...' : `Pay ${formatPrice(amountToPay.toString())}`}
               </button>
             </form>
                     </div>

           {/* Order Summary */}
           <div className="bg-white dark:bg-gray-800 rounded-lg p-8">
             <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
               Order Summary
             </h2>

             <div className="space-y-4">
               <div className="flex justify-between items-center">
                 <span className="text-gray-600 dark:text-gray-400">Car Model:</span>
                 <span className="font-medium text-gray-900 dark:text-white">{carModel}</span>
               </div>
               
               <div className="flex justify-between items-center">
                 <span className="text-gray-600 dark:text-gray-400">Total Price:</span>
                 <span className="font-medium text-gray-900 dark:text-white">{formatPrice(carPrice)}</span>
               </div>

               {isReservation && (
                 <>
                   <div className="flex justify-between items-center">
                     <span className="text-gray-600 dark:text-gray-400">Reservation Amount:</span>
                     <span className="font-medium text-primary-600">{formatPrice(reservationAmount)}</span>
                   </div>
                   
                   <div className="flex justify-between items-center">
                     <span className="text-gray-600 dark:text-gray-400">Remaining Amount:</span>
                     <span className="font-medium text-gray-900 dark:text-white">{formatPrice(remainingAmount.toString())}</span>
                   </div>
                   
                   <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-3">
                     <p className="text-sm text-yellow-800 dark:text-yellow-200">
                       <strong>Reservation:</strong> Pay remaining amount within 7 days to confirm your booking.
                     </p>
                   </div>
                 </>
               )}
               
               <div className="flex justify-between items-center">
                 <span className="text-gray-600 dark:text-gray-400">Tax:</span>
                 <span className="font-medium text-gray-900 dark:text-white">₹0</span>
               </div>
               
               <div className="flex justify-between items-center">
                 <span className="text-gray-600 dark:text-gray-400">Processing Fee:</span>
                 <span className="font-medium text-gray-900 dark:text-white">₹0</span>
               </div>
               
               <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                 <div className="flex justify-between items-center">
                   <span className="text-lg font-semibold text-gray-900 dark:text-white">
                     {isReservation ? 'Amount to Pay:' : 'Total:'}
                   </span>
                   <span className="text-lg font-bold text-primary-600">{formatPrice(amountToPay.toString())}</span>
                 </div>
               </div>
             </div>

             <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
               <h3 className="font-medium text-gray-900 dark:text-white mb-2">Customer Details</h3>
               <p className="text-sm text-gray-600 dark:text-gray-400">
                 <strong>Name:</strong> {user.name}<br />
                 <strong>Email:</strong> {user.email}<br />
                 {user.phone && <><strong>Phone:</strong> {user.phone}</>}
               </p>
             </div>
           </div>
        </div>
      </main>
    </div>
  )
} 