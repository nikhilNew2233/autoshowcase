-- Database setup for AutoShowcase application
-- Run this in your Supabase SQL editor

-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    role VARCHAR(50) DEFAULT 'user' CHECK (role IN ('user', 'admin')),
    status VARCHAR(50) DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create cars table
CREATE TABLE IF NOT EXISTS cars (
    id SERIAL PRIMARY KEY,
    type VARCHAR(100) NOT NULL CHECK (type IN ('SUV', 'Sedan', 'Hatchback', 'MUV', 'Luxury')),
    model VARCHAR(255) NOT NULL,
    units_available INTEGER NOT NULL DEFAULT 0 CHECK (units_available >= 0),
    model_year INTEGER NOT NULL CHECK (model_year >= 2015 AND model_year <= 2030),
    price DECIMAL(12,2) NOT NULL CHECK (price > 0),
    image_url TEXT,
    description TEXT,
    specifications JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create orders table
CREATE TABLE IF NOT EXISTS orders (
    id SERIAL PRIMARY KEY,
    order_id VARCHAR(50) UNIQUE NOT NULL,
    car_id INTEGER REFERENCES cars(id) ON DELETE SET NULL,
    car_model VARCHAR(255) NOT NULL,
    car_price DECIMAL(12,2) NOT NULL CHECK (car_price > 0),
    customer_name VARCHAR(255) NOT NULL,
    customer_email VARCHAR(255) NOT NULL,
    customer_phone VARCHAR(20),
    payment_type VARCHAR(50) NOT NULL CHECK (payment_type IN ('full', 'reservation')),
    reservation_amount DECIMAL(12,2) NOT NULL CHECK (reservation_amount >= 0),
    remaining_amount DECIMAL(12,2) NOT NULL DEFAULT 0 CHECK (remaining_amount >= 0),
    payment_method VARCHAR(50) NOT NULL CHECK (payment_method IN ('UPI', 'Credit Card', 'Net Banking')),
    status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled')),
    user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
    admin_notes TEXT,
    delivery_date TIMESTAMP WITH TIME ZONE,
    booking_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create schedules table
CREATE TABLE IF NOT EXISTS schedules (
    id SERIAL PRIMARY KEY,
    car_id INTEGER REFERENCES cars(id) ON DELETE SET NULL,
    car_model VARCHAR(255) NOT NULL,
    customer_name VARCHAR(255) NOT NULL,
    customer_email VARCHAR(255) NOT NULL,
    customer_phone VARCHAR(20),
    preferred_date DATE NOT NULL CHECK (preferred_date >= CURRENT_DATE),
    preferred_time VARCHAR(20) NOT NULL,
    additional_notes TEXT,
    status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled')),
    schedule_date TIMESTAMP WITH TIME ZONE,
    user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert sample cars data
INSERT INTO cars (type, model, units_available, model_year, price, image_url, description) VALUES
('SUV', 'Mahindra XUV700', 5, 2023, 1999000, 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800&h=600&fit=crop', 'Premium SUV with advanced features'),
('Sedan', 'Honda City', 8, 2019, 1199000, 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800&h=600&fit=crop', 'Comfortable sedan for family'),
('Hatchback', 'Maruti Swift', 12, 2020, 699000, 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800&h=600&fit=crop', 'Compact and fuel efficient'),
('SUV', 'Tata Nexon EV', 3, 2023, 1499000, 'https://images.unsplash.com/photo-1593941707882-a5bba6c3a8cc?w=800&h=600&fit=crop', 'Electric SUV with long range'),
('Sedan', 'Hyundai Verna', 6, 2022, 1099000, 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800&h=600&fit=crop', 'Sporty sedan with modern design'),
('SUV', 'MG Hector', 4, 2023, 1599000, 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800&h=600&fit=crop', 'Connected SUV with internet features'),
('Hatchback', 'Tata Punch', 10, 2022, 599000, 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800&h=600&fit=crop', 'Micro SUV with great safety'),
('Sedan', 'Toyota Camry', 2, 2024, 4199000, 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800&h=600&fit=crop', 'Luxury sedan with hybrid option'),
('SUV', 'Kia Seltos', 7, 2024, 1199000, 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800&h=600&fit=crop', 'Feature-rich SUV with premium feel'),
('Hatchback', 'Hyundai i20', 9, 2025, 799000, 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800&h=600&fit=crop', 'Premium hatchback with modern features');

-- Insert sample users (password is 'password123' for demo)
INSERT INTO users (name, email, password, phone, role) VALUES
('John Doe', 'john@example.com', 'password123', '+91 98765 43210', 'user'),
('Jane Smith', 'jane@example.com', 'password123', '+91 98765 43211', 'user'),
('Admin User', 'admin@autoshowcase.com', 'admin123', '+91 98765 43212', 'admin');

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_booking_date ON orders(booking_date);
CREATE INDEX IF NOT EXISTS idx_cars_type ON cars(type);
CREATE INDEX IF NOT EXISTS idx_cars_price ON cars(price);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_schedules_user_id ON schedules(user_id);
CREATE INDEX IF NOT EXISTS idx_schedules_status ON schedules(status);
CREATE INDEX IF NOT EXISTS idx_schedules_preferred_date ON schedules(preferred_date);

-- Create triggers to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_cars_updated_at BEFORE UPDATE ON cars
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_schedules_updated_at BEFORE UPDATE ON schedules
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column(); 