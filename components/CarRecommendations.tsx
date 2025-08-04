'use client'

import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { Car } from '@/types/car'

interface CarRecommendationsProps {
  cars: Car[]
}

export function CarRecommendations({ cars }: CarRecommendationsProps) {
  const router = useRouter()

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
    }).format(price)
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-6">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
        Similar Cars You Might Like
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {cars.map((car) => (
          <div
            key={car.id}
            className="card p-4 cursor-pointer hover:scale-105 transition-transform duration-200"
            onClick={() => router.push(`/cars/${car.id}`)}
          >
            <div className="aspect-video relative mb-4 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700">
                      {car.image_url ? (
          <Image
            src={car.image_url}
                  alt={car.model}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 25vw"
                />
              ) : (
                <div className="flex items-center justify-center h-full">
                  <span className="text-gray-400 dark:text-gray-500">No image</span>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white truncate">
                {car.model}
              </h3>
              
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-200">
                  {car.type}
                </span>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {car.model_year}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-lg font-bold text-gray-900 dark:text-white">
                  {formatPrice(car.price)}
                </span>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {car.units_available} available
                </span>
              </div>

              <button className="w-full btn-primary text-sm">
                View Details
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
} 