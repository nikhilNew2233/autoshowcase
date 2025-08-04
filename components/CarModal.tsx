'use client'

import { Fragment } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { XMarkIcon } from '@heroicons/react/24/outline'
import Image from 'next/image'
import { Car } from '@/types/car'

interface CarModalProps {
  car: Car | null
  isOpen: boolean
  onClose: () => void
}

export function CarModal({ car, isOpen, onClose }: CarModalProps) {
  if (!car) return null

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
    }).format(price)
  }

  return (
    <Transition.Root show={isOpen} as={Fragment}>
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
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white dark:bg-gray-800 px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-2xl sm:p-6">
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
                    <div className="aspect-video relative mb-6 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700">
                              {car.image_url ? (
          <Image
            src={car.image_url}
                          alt={`${car.model}`}
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

                    <div className="space-y-4">
                      <div>
                        <Dialog.Title as="h3" className="text-2xl font-bold text-gray-900 dark:text-white">
                          {car.model}
                        </Dialog.Title>
                        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                          {car.type} • {car.model_year}
                        </p>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                          <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">Price</h4>
                          <p className="text-xl font-bold text-gray-900 dark:text-white">
                            {formatPrice(car.price)}
                          </p>
                        </div>
                        <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                          <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">Available Units</h4>
                          <p className="text-xl font-bold text-gray-900 dark:text-white">
                            {car.units_available}
                          </p>
                        </div>
                      </div>

                      <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                        <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Specifications</h4>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-gray-500 dark:text-gray-400">Type:</span>
                            <span className="ml-2 text-gray-900 dark:text-white font-medium">{car.type}</span>
                          </div>
                          <div>
                            <span className="text-gray-500 dark:text-gray-400">Model Year:</span>
                            <span className="ml-2 text-gray-900 dark:text-white font-medium">{car.model_year}</span>
                          </div>
                          <div>
                            <span className="text-gray-500 dark:text-gray-400">Price:</span>
                            <span className="ml-2 text-gray-900 dark:text-white font-medium">{formatPrice(car.price)}</span>
                          </div>
                          <div>
                            <span className="text-gray-500 dark:text-gray-400">Stock:</span>
                            <span className="ml-2 text-gray-900 dark:text-white font-medium">{car.units_available} units</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-6 sm:mt-4 sm:flex sm:flex-row-reverse">
                  <button
                    type="button"
                    className="btn-primary w-full sm:w-auto sm:ml-3"
                    onClick={onClose}
                  >
                    Close
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  )
} 