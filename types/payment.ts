export interface PaymentFormData {
  paymentMethod: 'UPI' | 'Credit Card' | 'Net Banking'
  upiId?: string
  cardNumber?: string
  cardHolder?: string
  expiryDate?: string
  cvv?: string
  address: string
  city: string
  postalCode: string
  reservationAmount: number
  fullPayment: boolean
}

export interface ReservationData {
  carId: number
  carModel: string
  carPrice: number
  reservationAmount: number
  customerName: string
  customerEmail: string
  customerPhone: string
  reservationDate: string
  deliveryDate?: string
  paymentMethod: string
  orderId: string
}

export interface PaymentSuccessData {
  orderId: string
  carModel: string
  amountPaid: number
  reservationAmount: number
  remainingAmount: number
  paymentMethod: string
  deliveryDate: string
} 