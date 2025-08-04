import { Header } from '@/components/Header'

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-8">
            About AutoShowcase
          </h1>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Your Trusted Car Dealership
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 mb-6">
              AutoShowcase has been serving customers for over 15 years, providing premium vehicles 
              with exceptional service. We pride ourselves on offering a wide selection of cars, 
              from affordable hatchbacks to luxury sedans and powerful SUVs.
            </p>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Our commitment to quality, transparency, and customer satisfaction has made us 
              the preferred choice for car buyers in the region.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg text-center">
              <div className="text-3xl font-bold text-primary-600 mb-2">500+</div>
              <div className="text-gray-600 dark:text-gray-400">Happy Customers</div>
            </div>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg text-center">
              <div className="text-3xl font-bold text-primary-600 mb-2">50+</div>
              <div className="text-gray-600 dark:text-gray-400">Car Models</div>
            </div>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg text-center">
              <div className="text-3xl font-bold text-primary-600 mb-2">15+</div>
              <div className="text-gray-600 dark:text-gray-400">Years Experience</div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Why Choose Us?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  ✓ Quality Assurance
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  All our vehicles undergo thorough inspection and come with warranty coverage.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  ✓ Competitive Pricing
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  We offer the best prices in the market with transparent pricing policies.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  ✓ Expert Support
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Our team of experts is here to help you find the perfect car for your needs.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  ✓ After-Sales Service
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Comprehensive after-sales support including maintenance and service.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
} 