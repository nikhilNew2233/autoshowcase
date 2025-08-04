export interface Car {
  id: number
  type: string
  model: string
  units_available: number
  model_year: number
  price: number
  image_url?: string
  description?: string
  specifications?: {
    engine?: string
    transmission?: string
    fuelType?: string
    mileage?: string
    seating?: number
  }
}

export type SortField = 'type' | 'model_year' | 'price'
export type SortOrder = 'asc' | 'desc'

export interface NewCar {
  type: string
  model: string
  units_available: number
  model_year: number
  price: number
  image_url?: string
  description?: string
} 