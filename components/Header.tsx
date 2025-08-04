'use client'

import { useState } from 'react'
import { AiOutlineCar } from 'react-icons/ai'
import { BsSun, BsMoon, BsPerson, BsBoxArrowRight } from 'react-icons/bs'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useTheme } from './ThemeProvider'
import { useAuth } from './AuthProvider'

export function Header() {
  const { theme, toggleTheme } = useTheme()
  const { user, logout } = useAuth()
  const pathname = usePathname()
  const router = useRouter()
  const [showUserMenu, setShowUserMenu] = useState(false)

  const navigation = [
    { name: 'Showroom', href: '/' },
    { name: 'About', href: '/about' },
    { name: 'Contact', href: '/contact' },
  ]

  const handleLogout = () => {
    logout()
    setShowUserMenu(false)
    router.push('/')
  }

  return (
    <header className="bg-white dark:bg-gray-900 shadow-sm border-b border-gray-200 dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-8">
            <Link href="/" className="flex items-center space-x-3">
              <div className="flex-shrink-0">
                <AiOutlineCar className="h-8 w-8 text-primary-600" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                  AutoShowcase
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Premium Car Showroom
                </p>
              </div>
            </Link>

            <nav className="hidden md:flex space-x-8">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`text-sm font-medium transition-colors duration-200 ${
                    pathname === item.href
                      ? 'text-primary-600 dark:text-primary-400'
                      : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>
          
          <div className="flex items-center space-x-4">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200"
              aria-label="Toggle theme"
            >
              {theme === 'light' ? (
                <BsMoon className="h-5 w-5" />
              ) : (
                <BsSun className="h-5 w-5" />
              )}
            </button>

            {user ? (
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center space-x-2 p-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200"
                >
                  <BsPerson className="h-5 w-5" />
                  <span className="hidden sm:block text-sm font-medium">{user.name}</span>
                </button>

                                       {showUserMenu && (
                         <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-2 z-50">
                           <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700">
                             <p className="text-sm font-medium text-gray-900 dark:text-white">{user.name}</p>
                             <p className="text-xs text-gray-500 dark:text-gray-400">{user.email}</p>
                           </div>
                           <Link
                             href="/dashboard"
                             className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center space-x-2"
                             onClick={() => setShowUserMenu(false)}
                           >
                             <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                             </svg>
                             <span>Dashboard</span>
                           </Link>
                           {user.email === 'admin@autoshowcase.com' && (
                             <Link
                               href="/admin"
                               className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center space-x-2"
                               onClick={() => setShowUserMenu(false)}
                             >
                               <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                               </svg>
                               <span>Admin Panel</span>
                             </Link>
                           )}
                           <button
                             onClick={handleLogout}
                             className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center space-x-2"
                           >
                             <BsBoxArrowRight className="h-4 w-4" />
                             <span>Logout</span>
                           </button>
                         </div>
                       )}
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  href="/login"
                  className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                >
                  Login
                </Link>
                <Link
                  href="/signup"
                  className="btn-primary text-sm"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
} 