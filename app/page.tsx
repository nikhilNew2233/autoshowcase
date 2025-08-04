'use client'

import { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import useSWR from 'swr'
import { Header } from '@/components/Header'
import { SearchAndFilters } from '@/components/SearchAndFilters'
import { CarCard } from '@/components/CarCard'
import { Car, SortField, SortOrder } from '@/types/car'

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export default function Home() {
  const router = useRouter()
  const { data: cars = [], error, isLoading } = useSWR<Car[]>('/api/cars', fetcher)
  
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedType, setSelectedType] = useState('All')
  const [sortField, setSortField] = useState<SortField>('type')
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc')

  const filteredAndSortedCars = useMemo(() => {
    let filtered = cars.filter((car) => {
      const matchesSearch = car.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          car.type.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesType = selectedType === 'All' || car.type === selectedType
      return matchesSearch && matchesType
    })

    filtered.sort((a, b) => {
      const aValue = a[sortField]
      const bValue = b[sortField]
      
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        const aLower = aValue.toLowerCase()
        const bLower = bValue.toLowerCase()
        if (aLower < bLower) return sortOrder === 'asc' ? -1 : 1
        if (aLower > bLower) return sortOrder === 'asc' ? 1 : -1
        return 0
      }
      
      if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1
      if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1
      return 0
    })

    return filtered
  }, [cars, searchTerm, selectedType, sortField, sortOrder])

  const handleCarClick = (car: Car) => {
    router.push(`/cars/${car.id}`)
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Error loading cars
            </h2>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              Please try refreshing the page.
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <SearchAndFilters
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          selectedType={selectedType}
          setSelectedType={setSelectedType}
          sortField={sortField}
          setSortField={setSortField}
          sortOrder={sortOrder}
          setSortOrder={setSortOrder}
        />

        {isLoading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
            <p className="mt-2 text-gray-600 dark:text-gray-400">Loading cars...</p>
          </div>
        ) : filteredAndSortedCars.length === 0 ? (
          <div className="text-center py-12">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              No cars found
            </h3>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              Try adjusting your search or filter criteria.
            </p>
          </div>
        ) : (
          <>
            <div className="mb-6">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Showing {filteredAndSortedCars.length} of {cars.length} cars
              </p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredAndSortedCars.map((car) => (
                <CarCard
                  key={car.id}
                  car={car}
                  onClick={handleCarClick}
                />
              ))}
            </div>
          </>
        )}
      </main>
    </div>
  )
} 