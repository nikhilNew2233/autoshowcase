'use client'

import { useState } from 'react'
import { Header } from '@/components/Header'
import { BsTelephone, BsEnvelope, BsGeoAlt } from 'react-icons/bs'

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    setIsSubmitting(false)
    setIsSubmitted(true)
    
    // Reset form after 3 seconds
    setTimeout(() => {
      setIsSubmitted(false)
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' })
    }, 3000)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-8">
            Contact Us
          </h1>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Contact Form */}
            <div className="bg-white dark:bg-gray-800 rounded-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                Send us a Message
              </h2>
              
              {isSubmitted ? (
                <div className="text-center py-8">
                  <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 dark:bg-green-900">
                    <svg className="h-6 w-6 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">
                    Message Sent!
                  </h3>
                  <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                    We&apos;ll get back to you within 24 hours.
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

                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Subject *
                    </label>
                    <input
                      type="text"
                      id="subject"
                      name="subject"
                      required
                      value={formData.subject}
                      onChange={handleChange}
                      className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:border-primary-500 focus:ring-primary-500"
                    />
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Message *
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      rows={4}
                      required
                      value={formData.message}
                      onChange={handleChange}
                      className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:border-primary-500 focus:ring-primary-500"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full btn-primary disabled:opacity-50"
                  >
                    {isSubmitting ? 'Sending...' : 'Send Message'}
                  </button>
                </form>
              )}
            </div>

            {/* Contact Information */}
            <div className="space-y-6">
              <div className="bg-white dark:bg-gray-800 rounded-lg p-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                  Get in Touch
                </h2>
                
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <BsTelephone className="text-primary-600 text-xl" />
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">Phone</p>
                      <p className="text-gray-600 dark:text-gray-400">+91 98765 43210</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <BsEnvelope className="text-primary-600 text-xl" />
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">Email</p>
                      <p className="text-gray-600 dark:text-gray-400">info@autoshowcase.com</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <BsGeoAlt className="text-primary-600 text-xl" />
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">Address</p>
                      <p className="text-gray-600 dark:text-gray-400">
                        123 Auto Street, Car City<br />
                        Maharashtra, India 400001
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-lg p-6">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                  Business Hours
                </h3>
                <div className="space-y-2 text-gray-600 dark:text-gray-400">
                  <div className="flex justify-between">
                    <span>Monday - Friday</span>
                    <span>9:00 AM - 7:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Saturday</span>
                    <span>9:00 AM - 6:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Sunday</span>
                    <span>10:00 AM - 4:00 PM</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
} 