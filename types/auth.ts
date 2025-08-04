export interface User {
  id: string
  name: string
  email: string
  phone?: string
  role?: string
}

export interface LoginFormData {
  email: string
  password: string
}

export interface SignupFormData {
  name: string
  email: string
  password: string
  confirmPassword: string
  phone?: string
}

export interface AuthContextType {
  user: User | null
  login: (data: LoginFormData) => Promise<void>
  signup: (data: SignupFormData) => Promise<void>
  logout: () => void
  isLoading: boolean
} 