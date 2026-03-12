-- Coollooks23 Booking System Database Schema

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT UNIQUE NOT NULL,
    phone TEXT,
    name TEXT,
    stripe_customer_id TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Services table
CREATE TABLE IF NOT EXISTS services (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    duration_minutes INTEGER NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    category TEXT,
    description TEXT,
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Bookings table
CREATE TABLE IF NOT EXISTS bookings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    service_id UUID REFERENCES services(id),
    date_time TIMESTAMP WITH TIME ZONE NOT NULL,
    status TEXT DEFAULT 'pending',
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Subscriptions table
CREATE TABLE IF NOT EXISTS subscriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    stripe_subscription_id TEXT UNIQUE,
    status TEXT DEFAULT 'active',
    current_period_start TIMESTAMP WITH TIME ZONE,
    current_period_end TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert services
INSERT INTO services (name, duration_minutes, price, category) VALUES
    ('Haircut', 35, 40.00, 'mens'),
    ('Haircut and Beard', 40, 50.00, 'mens'),
    ('High School Cuts', 30, 30.00, 'kids'),
    ('Hair Dye (Black)', 15, 30.00, 'styling'),
    ('Hair Dye/Bleach', 40, 70.00, 'styling'),
    ('Pensioners Haircut', 30, 30.00, 'pensioners'),
    ('Facials', 60, 100.00, 'face'),
    ('Braiding', 120, 200.00, 'extra')
ON CONFLICT DO NOTHING;

-- Operating hours table
CREATE TABLE IF NOT EXISTS operating_hours (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    day_of_week INTEGER NOT NULL, -- 0=Sunday, 1=Monday, etc.
    open_time TIME NOT NULL,
    close_time TIME NOT NULL,
    closed BOOLEAN DEFAULT false
);

-- Insert operating hours (Monday-Saturday 8am-6pm)
INSERT INTO operating_hours (day_of_week, open_time, close_time) VALUES
    (1, '08:00', '18:00'),
    (2, '08:00', '18:00'),
    (3, '08:00', '18:00'),
    (4, '08:00', '18:00'),
    (5, '08:00', '18:00'),
    (6, '08:00', '18:00')
ON CONFLICT DO NOTHING;

-- Enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE operating_hours ENABLE ROW LEVEL SECURITY;

-- Create policies (allow all for now - tighten later)
CREATE POLICY "Allow all" ON users FOR ALL USING (true);
CREATE POLICY "Allow all" ON services FOR ALL USING (true);
CREATE POLICY "Allow all" ON bookings FOR ALL USING (true);
CREATE POLICY "Allow all" ON subscriptions FOR ALL USING (true);
CREATE POLICY "Allow all" ON operating_hours FOR ALL USING (true);
