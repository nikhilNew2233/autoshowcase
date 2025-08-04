import Link from 'next/link'
import { AiOutlineCar } from 'react-icons/ai'
import { BsTelephone, BsEnvelope, BsGeoAlt } from 'react-icons/bs'

export function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-3 mb-4">
              <AiOutlineCar className="h-8 w-8 text-primary-400" />
              <div>
                <h3 className="text-xl font-bold">AutoShowcase</h3>
                <p className="text-gray-400 text-sm">Premium Car Showroom</p>
              </div>
            </div>
            <p className="text-gray-400 mb-4">
              Your trusted partner for premium vehicles. We offer a wide selection of cars 
              with exceptional service and competitive pricing.
            </p>
            <div className="space-y-2">
              <div className="flex items-center space-x-3">
                <BsTelephone className="text-primary-400" />
                <span className="text-gray-400">+91 98765 43210</span>
              </div>
              <div className="flex items-center space-x-3">
                <BsEnvelope className="text-primary-400" />
                <span className="text-gray-400">info@autoshowcase.com</span>
              </div>
              <div className="flex items-center space-x-3">
                <BsGeoAlt className="text-primary-400" />
                <span className="text-gray-400">123 Auto Street, Car City, Maharashtra</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-gray-400 hover:text-white transition-colors">
                  Showroom
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-gray-400 hover:text-white transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-400 hover:text-white transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Services</h4>
            <ul className="space-y-2">
              <li>
                <span className="text-gray-400">Car Sales</span>
              </li>
              <li>
                <span className="text-gray-400">Test Drives</span>
              </li>
              <li>
                <span className="text-gray-400">Financing</span>
              </li>
              <li>
                <span className="text-gray-400">After Sales</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p className="text-gray-400">
            © 2024 AutoShowcase. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
} 