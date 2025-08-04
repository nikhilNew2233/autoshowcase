'use client'

import { useState } from 'react'
import { Fragment } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { XMarkIcon } from '@heroicons/react/24/outline'
import { Car } from '@/types/car'
import { useAuth } from './AuthProvider'

interface ScheduleVisitFormProps {
  car: Car
  onClose: () => void
}

export function ScheduleVisitForm({ car, onClose }: ScheduleVisitFormProps) {
  const { user } = useAuth()
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    preferredDate: '',
    preferredTime: '',
    message: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError('')
    
    try {
      const response = await fetch('/api/schedules', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          carId: car.id,
          carModel: car.model,
          customerName: formData.name,
          customerEmail: formData.email,
          customerPhone: formData.phone,
          preferredDate: formData.preferredDate,
          preferredTime: formData.preferredTime,
          additionalNotes: formData.message,
          userId: user?.id,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to schedule visit')
      }

      setIsSubmitted(true)
      
      // Close form after 3 seconds
      setTimeout(() => {
        onClose()
        setIsSubmitted(false)
        setFormData({ name: '', email: '', phone: '', preferredDate: '', preferredTime: '', message: '' })
      }, 3000)
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to schedule visit')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
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
                    <Dialog.Title as="h3" className="text-lg font-semibold leading-6 text-gray-900 dark:text-white mb-4">
                      Schedule Test Drive - {car.model}
                    </Dialog.Title>
                    
                    {error && (
                      <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                        <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
                      </div>
                    )}

                    {isSubmitted ? (
                      <div className="text-center">
                        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/20">
                          <svg className="h-6 w-6 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                          </svg>
                        </div>
                        <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">Test Drive Scheduled!</h3>
                        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                          We&apos;ll contact you soon to confirm your appointment.
                        </p>
                      </div>
                    ) : (
                      <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                          <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Full Name *
                          </label>
                          <input
                            type="text"
                            id="name"
                            name="name"
                            required
                            value={formData.name}
                            onChange={handleChange}
                            className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:border-primary-500 focus:ring-primary-500"
                          />
                        </div>

                        <div>
                          <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Email *
                          </label>
                          <input
                            type="email"
                            id="email"
                            name="email"
                            required
                            value={formData.email}
                            onChange={handleChange}
                            className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:border-primary-500 focus:ring-primary-500"
                          />
                        </div>

                        <div>
                          <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Phone Number
                          </label>
                          <input
                            type="tel"
                            id="phone"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:border-primary-500 focus:ring-primary-500"
                          />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label htmlFor="preferredDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                              Preferred Date *
                            </label>
                            <input
                              type="date"
                              id="preferredDate"
                              name="preferredDate"
                              required
                              min={new Date().toISOString().split('T')[0]}
                              value={formData.preferredDate}
                              onChange={handleChange}
                              className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:border-primary-500 focus:ring-primary-500"
                            />
                          </div>

                          <div>
                            <label htmlFor="preferredTime" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                              Preferred Time *
                            </label>
                            <select
                              id="preferredTime"
                              name="preferredTime"
                              required
                              value={formData.preferredTime}
                              onChange={handleChange}
                              className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:border-primary-500 focus:ring-primary-500"
                            >
                              <option value="">Select Time</option>
                              <option value="09:00 AM">09:00 AM</option>
                              <option value="10:00 AM">10:00 AM</option>
                              <option value="11:00 AM">11:00 AM</option>
                              <option value="12:00 PM">12:00 PM</option>
                              <option value="01:00 PM">01:00 PM</option>
                              <option value="02:00 PM">02:00 PM</option>
                              <option value="03:00 PM">03:00 PM</option>
                              <option value="04:00 PM">04:00 PM</option>
                              <option value="05:00 PM">05:00 PM</option>
                            </select>
                          </div>
                        </div>

                        <div>
                          <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Additional Notes
                          </label>
                          <textarea
                            id="message"
                            name="message"
                            rows={3}
                            value={formData.message}
                            onChange={handleChange}
                            className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:border-primary-500 focus:ring-primary-500"
                            placeholder="Any specific requirements or questions..."
                          />
                        </div>

                        <div className="mt-6 sm:mt-4 sm:flex sm:flex-row-reverse">
                          <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full btn-primary sm:w-auto sm:ml-3 disabled:opacity-50"
                          >
                            {isSubmitting ? 'Scheduling...' : 'Schedule Test Drive'}
                          </button>
                          <button
                            type="button"
                            onClick={onClose}
                            className="mt-3 w-full btn-secondary sm:mt-0 sm:w-auto"
                          >
                            Cancel
                          </button>
                        </div>
                      </form>
                    )}
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