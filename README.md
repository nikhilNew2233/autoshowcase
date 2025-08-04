# AutoShowcase - Premium Car Showroom

A complete, professional car dealership website built with Next.js 14, TypeScript, and Tailwind CSS. Features a full website experience with detailed car pages, buy forms, contact forms, and comprehensive navigation - replicating real car dealership website functionality.

## ✨ Features

- **Complete Website Experience** - Full navigation with multiple pages
- **Detailed Car Pages** - Individual car detail pages with specifications
- **Buy/Inquiry Forms** - Collect customer information for car purchases
- **Contact Forms** - Professional contact page with business information
- **Similar Car Recommendations** - Prevent blank pages with relevant suggestions
- **User Authentication** - Login, signup, and logout functionality
- **Payment System** - UPI, Credit Card, and Net Banking payment options
- **Reservation System** - 10% advance booking with remaining payment
- **Test Drive Scheduling** - Schedule test drives for cars
- **User Dashboard** - View bookings and test drive schedules
- **Admin Panel** - Complete backend management system
- **Mobile-first responsive design** with beautiful UI
- **Dark/Light mode toggle** with persistent theme preference
- **Search functionality** - search by car model or type
- **Filtering** - filter cars by type (SUV, Sedan, Hatchback)
- **Sorting** - sort by type, year, or price (ascending/descending)
- **Real-time data** - powered by Supabase database
- **TypeScript** - full type safety throughout the application
- **Optimized images** - using Next.js Image component
- **SWR integration** - for efficient data fetching and caching

## 🚀 Quick Start

### Prerequisites

- Node.js 18 or higher
- npm or yarn package manager

### Local Development

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd autoshowcase
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

The development server will automatically start both the frontend and API routes. Any changes you make to the code will be reflected immediately.

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier

## 🚀 Deploy to Vercel

### Option 1: One-Click Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/autoshowcase)

### Option 2: Manual Deployment

1. **Push your code to GitHub**
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Connect to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Sign up/Login with your GitHub account
   - Click "New Project"
   - Import your repository
   - Vercel will automatically detect it's a Next.js project

3. **Deploy**
   - Click "Deploy"
   - Your site will be live in minutes!

## Database Setup

1. **Set up Supabase Database:**
   - Go to your Supabase project dashboard
   - Navigate to the SQL Editor
   - Run the `database-setup.sql` file to create all necessary tables and sample data
   - Run the `update-images.sql` file to update car images with better URLs

2. **Environment Variables:**
   - The Supabase connection is already configured in `lib/supabase.ts`
   - No additional environment variables needed for this demo

## Recent Fixes

The following issues have been resolved:

### ✅ Schedules and Bookings Creation
- Created `/api/schedules` endpoint for creating and fetching schedules
- Updated `ScheduleVisitForm` to call the real API instead of simulating
- Updated dashboard to fetch user schedules from the API

### ✅ Image Display Issues
- Updated car images to use reliable Unsplash URLs
- Added Unsplash to Next.js image configuration
- Created `update-images.sql` script to update existing database

### ✅ Admin Panel Authentication
- Fixed admin role checking to prevent login prompts on refresh
- Updated authentication logic to check both role field and email

### ✅ Mock Data Removal
- Removed all mock data from admin panel
- All data now comes from Supabase database
- Fixed duplicate schedules issue in admin panel

### ✅ Add Car Form
- Specifications section has been removed as requested
- Form now only includes essential car information

## Features

- **Mobile-first responsive design** with Tailwind CSS
- **Dark/Light mode toggle** with persistent theme
- **Real-time search and filtering** of car inventory
- **Sortable car grid** by type, year, and price
- **Detailed car information pages** with similar recommendations
- **User authentication** with login/signup functionality
- **Payment processing** with multiple payment methods (UPI, Credit Card, Net Banking)
- **Car reservation system** with 10% advance payment option
- **User dashboard** showing booking history and schedules
- **Admin panel** for managing users, orders, schedules, and car inventory
- **Schedule test drive** functionality
- **Supabase integration** for real data persistence

## 📁 Project Structure

```
autoshowcase/
├── app/
│   ├── api/cars/route.ts    # API endpoint for car data
│   ├── globals.css          # Global styles with Tailwind
│   ├── layout.tsx           # Root layout with theme provider
│   └── page.tsx             # Main page component
├── components/
│   ├── CarCard.tsx          # Individual car card component
│   ├── CarModal.tsx         # Car details modal
│   ├── Header.tsx           # Header with logo and theme toggle
│   ├── SearchAndFilters.tsx # Search and filter controls
│   └── ThemeProvider.tsx    # Dark/light mode context
├── types/
│   └── car.ts               # TypeScript type definitions
├── package.json             # Dependencies and scripts
├── tailwind.config.js       # Tailwind CSS configuration
├── tsconfig.json            # TypeScript configuration
└── README.md               # This file
```

## 🛠️ Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS 3
- **UI Components**: Headless UI
- **Icons**: React Icons + Heroicons
- **Data Fetching**: SWR
- **Deployment**: Vercel

## 🔐 Admin Panel

The application includes a comprehensive admin panel for backend management:

### Admin Access
- **Email**: `admin@autoshowcase.com`
- **Password**: `admin123`

### Admin Features
- **Analytics Dashboard** - Revenue charts, top-selling cars, monthly statistics
- **User Management** - View all users, their roles, and account status
- **Order Management** - Track all car reservations and purchases
- **Test Drive Management** - Manage scheduled test drives
- **Car Inventory** - Add, edit, and remove cars from the showroom
- **Real-time Data** - All data served through Next.js API routes

### API Endpoints
- `GET /api/admin/analytics` - Analytics data
- `GET /api/admin/users` - User management
- `GET /api/admin/orders` - Order management
- `PATCH /api/admin/orders` - Update order status
- `GET /api/admin/cars` - Get all cars
- `POST /api/admin/cars` - Add new car
- `PUT /api/admin/cars` - Update car
- `DELETE /api/admin/cars` - Delete car

## 📊 Sample Data

```typescript
interface Car {
  id: number
  type: string          // "SUV", "Sedan", "Hatchback"
  model: string         // Car model name
  units_available: number // Stock quantity
  model_year: number    // Manufacturing year
  price: number         // Price in INR
  image_url?: string    // Optional image URL
  description?: string  // Car description
  specifications?: object // Car specifications
}
```

## 🎨 Customization

### Adding More Cars

Use the admin panel to add cars, or directly insert into the Supabase database:

```typescript
const cars: Car[] = [
  // Add your cars here
  {
    id: 11,
    type: 'SUV',
    model: 'Your Car Model',
    unitsAvailable: 5,
    modelYear: 2023,
    price: 1500000,
    imageUrl: 'https://source.unsplash.com/featured/?your-car',
  },
]
```

### Styling

The project uses Tailwind CSS with custom components. You can modify:
- `tailwind.config.js` - Theme customization
- `app/globals.css` - Custom component styles
- Individual component files for specific styling

### Theme Colors

The primary color scheme can be modified in `tailwind.config.js`:

```javascript
theme: {
  extend: {
    colors: {
      primary: {
        50: '#eff6ff',
        500: '#3b82f6',  // Change this for main color
        600: '#2563eb',
        700: '#1d4ed8',
      },
    },
  },
}
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 🆘 Support

If you encounter any issues:

1. Check the [Next.js documentation](https://nextjs.org/docs)
2. Review the [Tailwind CSS documentation](https://tailwindcss.com/docs)
3. Open an issue in this repository

---

**Built with ❤️ using Next.js, TypeScript, and Tailwind CSS** 