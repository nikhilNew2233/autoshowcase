'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { User, LoginFormData, SignupFormData, AuthContextType } from '@/types/auth'

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check for stored user data on mount
    const checkAuth = async () => {
      try {
        const storedUser = localStorage.getItem('user')
        if (storedUser) {
          const parsedUser = JSON.parse(storedUser)
          
          // Validate the stored user data with the server
          try {
            const response = await fetch('/api/auth/validate', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ userId: parsedUser.id, email: parsedUser.email }),
            })

            if (response.ok) {
              const result = await response.json()
              setUser(result.user)
            } else {
              // Invalid stored data, clear it
              localStorage.removeItem('user')
              setUser(null)
            }
          } catch (error) {
            console.error('Error validating stored user:', error)
            // If validation fails, clear stored data
            localStorage.removeItem('user')
            setUser(null)
          }
        }
      } catch (error) {
        console.error('Error checking authentication:', error)
        localStorage.removeItem('user')
        setUser(null)
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [])

  const login = async (data: LoginFormData) => {
    setIsLoading(true)
    
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Login failed')
      }

      setUser(result.user)
      localStorage.setItem('user', JSON.stringify(result.user))
    } catch (error) {
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const signup = async (data: SignupFormData) => {
    setIsLoading(true)
    
    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Signup failed')
      }

      setUser(result.user)
      localStorage.setItem('user', JSON.stringify(result.user))
    } catch (error) {
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('user')
  }

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
} 