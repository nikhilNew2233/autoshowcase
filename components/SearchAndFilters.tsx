'use client'

import { useState } from 'react'
import { BsSearch } from 'react-icons/bs'

import { SortField, SortOrder } from '@/types/car'

interface SearchAndFiltersProps {
  searchTerm: string
  setSearchTerm: (term: string) => void
  selectedType: string
  setSelectedType: (type: string) => void
  sortField: SortField
  setSortField: (field: SortField) => void
  sortOrder: SortOrder
  setSortOrder: (order: SortOrder) => void
}

export function SearchAndFilters({
  searchTerm,
  setSearchTerm,
  selectedType,
  setSelectedType,
  sortField,
  setSortField,
  sortOrder,
  setSortOrder,
}: SearchAndFiltersProps) {
  const carTypes = ['All', 'SUV', 'Sedan', 'Hatchback']
  const sortFields = [
    { value: 'type', label: 'Type' },
    { value: 'model_year', label: 'Year' },
    { value: 'price', label: 'Price' },
  ]

  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 mb-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Search */}
        <div className="relative">
          <BsSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search cars..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>

        {/* Type Filter */}
        <select
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value)}
          className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
        >
          {carTypes.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>

        {/* Sort Field */}
        <select
          value={sortField}
          onChange={(e) => setSortField(e.target.value as SortField)}
          className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
        >
          {sortFields.map((field) => (
            <option key={field.value} value={field.value}>
              Sort by {field.label}
            </option>
          ))}
        </select>

        {/* Sort Order */}
        <select
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value as SortOrder)}
          className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
        >
          <option value="asc">Ascending</option>
          <option value="desc">Descending</option>
        </select>
      </div>
    </div>
  )
} 