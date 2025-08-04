'use client'

import { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import useSWR from 'swr'
import Image from 'next/image'
import { Header } from '@/components/Header'
import { BuyForm } from '@/components/BuyForm'
import { ScheduleVisitForm } from '@/components/ScheduleVisitForm'
import { CarRecommendations } from '@/components/CarRecommendations'
import { Car } from '@/types/car'

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export default function CarDetailPage() {
  const params = useParams()
  const router = useRouter()
  const carId = params.id as string
  
  const { data: cars = [] } = useSWR<Car[]>('/api/cars', fetcher)
  const car = cars.find(c => c.id === parseInt(carId))
  
  const [showBuyForm, setShowBuyForm] = useState(false)
  const [showScheduleForm, setShowScheduleForm] = useState(false)

  if (!car) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Car not found
            </h2>
            <button 
              onClick={() => router.push('/')}
              className="mt-4 btn-primary"
            >
              Back to Showroom
            </button>
          </div>
        </div>
      </div>
    )
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
    }).format(price)
  }

  const similarCars = cars
    .filter(c => c.id !== car.id && c.type === car.type)
    .slice(0, 3)

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="mb-8">
          <ol className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
            <li>
              <button 
                onClick={() => router.push('/')}
                className="hover:text-primary-600 dark:hover:text-primary-400"
              >
                Showroom
              </button>
            </li>
            <li>/</li>
            <li>{car.type}</li>
            <li>/</li>
            <li className="text-gray-900 dark:text-white">{car.model}</li>
          </ol>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Car Image */}
          <div className="aspect-video relative rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700">
            {car.image_url ? (
              <Image
                src={car.image_url}
                alt={car.model}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            ) : (
              <div className="flex items-center justify-center h-full">
                <span className="text-gray-400 dark:text-gray-500">No image</span>
              </div>
            )}
          </div>

          {/* Car Details */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                {car.model}
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-400">
                {car.type} • {car.model_year}
              </p>
            </div>

            <div className="text-3xl font-bold text-primary-600">
              {formatPrice(car.price)}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white dark:bg-gray-800 p-4 rounded-lg">
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Available Units</h3>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{car.units_available}</p>
              </div>
              <div className="bg-white dark:bg-gray-800 p-4 rounded-lg">
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Model Year</h3>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{car.model_year}</p>
              </div>
            </div>

            <div className="space-y-4">
              <button
                onClick={() => setShowBuyForm(true)}
                className="w-full btn-primary text-lg py-3"
              >
                Buy Now
              </button>
              <button 
                onClick={() => setShowScheduleForm(true)}
                className="w-full btn-secondary text-lg py-3"
              >
                Schedule Test Drive
              </button>
            </div>
          </div>
        </div>

        {/* Specifications */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Specifications
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Type:</span>
                <span className="font-medium text-gray-900 dark:text-white">{car.type}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Model Year:</span>
                <span className="font-medium text-gray-900 dark:text-white">{car.model_year}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Price:</span>
                <span className="font-medium text-gray-900 dark:text-white">{formatPrice(car.price)}</span>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Available Units:</span>
                <span className="font-medium text-gray-900 dark:text-white">{car.units_available} units</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Status:</span>
                <span className="font-medium text-green-600">In Stock</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Warranty:</span>
                <span className="font-medium text-gray-900 dark:text-white">3 Years</span>
              </div>
            </div>
          </div>
        </div>

        {/* Buy Form Modal */}
        {showBuyForm && (
          <BuyForm 
            car={car} 
            onClose={() => setShowBuyForm(false)} 
          />
        )}

        {/* Schedule Visit Form Modal */}
        {showScheduleForm && (
          <ScheduleVisitForm 
            car={car} 
            onClose={() => setShowScheduleForm(false)} 
          />
        )}

        {/* Similar Cars */}
        {similarCars.length > 0 && (
          <CarRecommendations cars={similarCars} />
        )}
      </main>
    </div>
  )
} 