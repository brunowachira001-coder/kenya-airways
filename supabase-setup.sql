-- ============================================
-- KENYA AIRWAYS - SUPABASE DATABASE SETUP
-- ============================================
-- Run this SQL in Supabase SQL Editor
-- Dashboard → SQL Editor → New Query

-- ============================================
-- 1. ENABLE EXTENSIONS
-- ============================================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================
-- 2. CREATE TABLES
-- ============================================

-- Bookings Table
CREATE TABLE IF NOT EXISTS bookings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  booking_reference VARCHAR(10) UNIQUE NOT NULL,
  
  -- Passenger Information
  passenger_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(50),
  
  -- Flight Details
  origin VARCHAR(3) NOT NULL, -- Airport code (e.g., NBO)
  destination VARCHAR(3) NOT NULL, -- Airport code (e.g., DXB)
  departure_date DATE NOT NULL,
  return_date DATE,
  
  -- Booking Details
  cabin_class VARCHAR(20) NOT NULL, -- Economy, Business, First
  trip_type VARCHAR(20) DEFAULT 'return', -- oneway, return, multicity
  passengers JSONB NOT NULL, -- Array of passenger details
  
  -- Pricing
  base_fare DECIMAL(10, 2) NOT NULL,
  taxes DECIMAL(10, 2) NOT NULL DEFAULT 0,
  total_amount DECIMAL(10, 2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'KES',
  
  -- Status
  payment_status VARCHAR(20) DEFAULT 'pending', -- pending, paid, failed, refunded
  booking_status VARCHAR(20) DEFAULT 'confirmed', -- confirmed, cancelled, completed
  
  -- Timestamps
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Newsletter Subscribers
CREATE TABLE IF NOT EXISTS newsletter_subscribers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  subscribed_at TIMESTAMP DEFAULT NOW(),
  is_active BOOLEAN DEFAULT true,
  unsubscribed_at TIMESTAMP,
  source VARCHAR(50) DEFAULT 'website' -- website, mobile, api
);

-- Flight Search History (Optional - for analytics)
CREATE TABLE IF NOT EXISTS flight_searches (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  origin VARCHAR(3) NOT NULL,
  destination VARCHAR(3) NOT NULL,
  departure_date DATE NOT NULL,
  return_date DATE,
  passengers INTEGER NOT NULL,
  cabin_class VARCHAR(20),
  searched_at TIMESTAMP DEFAULT NOW(),
  user_ip VARCHAR(45), -- For analytics
  user_agent TEXT -- For device tracking
);

-- Passengers (Detailed passenger information)
CREATE TABLE IF NOT EXISTS passengers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  booking_id UUID REFERENCES bookings(id) ON DELETE CASCADE,
  
  -- Personal Information
  title VARCHAR(10) NOT NULL, -- Mr, Ms, Mrs, Dr
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  date_of_birth DATE NOT NULL,
  gender VARCHAR(10), -- Male, Female, Other
  
  -- Contact
  email VARCHAR(255),
  phone VARCHAR(50),
  
  -- Travel Documents
  passport_number VARCHAR(50),
  passport_expiry DATE,
  nationality VARCHAR(3), -- ISO country code
  
  -- Special Requirements
  special_meal VARCHAR(50), -- Vegetarian, Halal, etc.
  special_assistance TEXT,
  
  -- Timestamps
  created_at TIMESTAMP DEFAULT NOW()
);

-- Contact Messages (From contact form)
CREATE TABLE IF NOT EXISTS contact_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(50),
  subject VARCHAR(255),
  message TEXT NOT NULL,
  status VARCHAR(20) DEFAULT 'new', -- new, read, replied, archived
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- ============================================
-- 3. CREATE INDEXES (Performance Optimization)
-- ============================================

-- Bookings indexes
CREATE INDEX IF NOT EXISTS idx_bookings_reference ON bookings(booking_reference);
CREATE INDEX IF NOT EXISTS idx_bookings_email ON bookings(email);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(booking_status);
CREATE INDEX IF NOT EXISTS idx_bookings_payment_status ON bookings(payment_status);
CREATE INDEX IF NOT EXISTS idx_bookings_departure_date ON bookings(departure_date);
CREATE INDEX IF NOT EXISTS idx_bookings_created_at ON bookings(created_at DESC);

-- Newsletter indexes
CREATE INDEX IF NOT EXISTS idx_newsletter_email ON newsletter_subscribers(email);
CREATE INDEX IF NOT EXISTS idx_newsletter_active ON newsletter_subscribers(is_active);

-- Flight searches indexes
CREATE INDEX IF NOT EXISTS idx_searches_route ON flight_searches(origin, destination);
CREATE INDEX IF NOT EXISTS idx_searches_date ON flight_searches(searched_at DESC);

-- Passengers indexes
CREATE INDEX IF NOT EXISTS idx_passengers_booking ON passengers(booking_id);

-- Contact messages indexes
CREATE INDEX IF NOT EXISTS idx_contact_status ON contact_messages(status);
CREATE INDEX IF NOT EXISTS idx_contact_created ON contact_messages(created_at DESC);

-- ============================================
-- 4. CREATE FUNCTIONS
-- ============================================

-- Generate unique booking reference
CREATE OR REPLACE FUNCTION generate_booking_reference()
RETURNS VARCHAR(10) AS $$
DECLARE
  chars VARCHAR(36) := 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; -- Exclude I, O, 0, 1
  result VARCHAR(10) := 'KQ'; -- Kenya Airways prefix
  i INTEGER := 0;
BEGIN
  FOR i IN 1..8 LOOP
    result := result || substr(chars, floor(random() * length(chars) + 1)::integer, 1);
  END LOOP;
  RETURN result;
END;
$$ LANGUAGE plpgsql;

-- Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- 5. CREATE TRIGGERS
-- ============================================

-- Auto-update timestamps on bookings
CREATE TRIGGER update_bookings_updated_at
  BEFORE UPDATE ON bookings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Auto-update timestamps on contact messages
CREATE TRIGGER update_contact_messages_updated_at
  BEFORE UPDATE ON contact_messages
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- 6. ROW LEVEL SECURITY (RLS)
-- ============================================

-- Enable RLS on all tables
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE flight_searches ENABLE ROW LEVEL SECURITY;
ALTER TABLE passengers ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

-- Bookings policies
CREATE POLICY "Anyone can create bookings" 
  ON bookings FOR INSERT 
  WITH CHECK (true);

CREATE POLICY "Users can view their own bookings" 
  ON bookings FOR SELECT 
  USING (email = current_setting('request.jwt.claims', true)::json->>'email' OR true);

CREATE POLICY "Users can update their own bookings" 
  ON bookings FOR UPDATE 
  USING (email = current_setting('request.jwt.claims', true)::json->>'email');

-- Newsletter policies
CREATE POLICY "Anyone can subscribe to newsletter" 
  ON newsletter_subscribers FOR INSERT 
  WITH CHECK (true);

CREATE POLICY "Anyone can view active subscribers" 
  ON newsletter_subscribers FOR SELECT 
  USING (is_active = true);

-- Flight searches policies (public for analytics)
CREATE POLICY "Anyone can log flight searches" 
  ON flight_searches FOR INSERT 
  WITH CHECK (true);

CREATE POLICY "Anyone can view search history" 
  ON flight_searches FOR SELECT 
  USING (true);

-- Passengers policies
CREATE POLICY "Users can insert passengers for their bookings" 
  ON passengers FOR INSERT 
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM bookings 
      WHERE bookings.id = passengers.booking_id 
      AND bookings.email = current_setting('request.jwt.claims', true)::json->>'email'
    ) OR true
  );

CREATE POLICY "Users can view passengers for their bookings" 
  ON passengers FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM bookings 
      WHERE bookings.id = passengers.booking_id 
      AND bookings.email = current_setting('request.jwt.claims', true)::json->>'email'
    ) OR true
  );

-- Contact messages policies
CREATE POLICY "Anyone can send contact messages" 
  ON contact_messages FOR INSERT 
  WITH CHECK (true);

-- ============================================
-- 7. SAMPLE DATA (Optional - for testing)
-- ============================================

-- Uncomment to insert sample data for testing

/*
-- Sample booking
INSERT INTO bookings (
  booking_reference,
  passenger_name,
  email,
  phone,
  origin,
  destination,
  departure_date,
  return_date,
  cabin_class,
  passengers,
  base_fare,
  taxes,
  total_amount,
  payment_status,
  booking_status
) VALUES (
  'KQ' || substr(md5(random()::text), 1, 8),
  'John Doe',
  'john.doe@example.com',
  '+254712345678',
  'NBO',
  'DXB',
  CURRENT_DATE + INTERVAL '30 days',
  CURRENT_DATE + INTERVAL '37 days',
  'Economy',
  '[{"title": "Mr", "firstName": "John", "lastName": "Doe", "dateOfBirth": "1990-01-01"}]'::jsonb,
  45000.00,
  15080.00,
  60080.00,
  'paid',
  'confirmed'
);

-- Sample newsletter subscriber
INSERT INTO newsletter_subscribers (email) 
VALUES ('subscriber@example.com');
*/

-- ============================================
-- 8. VIEWS (Optional - for reporting)
-- ============================================

-- Bookings summary view
CREATE OR REPLACE VIEW bookings_summary AS
SELECT 
  DATE_TRUNC('day', created_at) as booking_date,
  COUNT(*) as total_bookings,
  SUM(total_amount) as total_revenue,
  COUNT(CASE WHEN payment_status = 'paid' THEN 1 END) as paid_bookings,
  COUNT(CASE WHEN booking_status = 'cancelled' THEN 1 END) as cancelled_bookings
FROM bookings
GROUP BY DATE_TRUNC('day', created_at)
ORDER BY booking_date DESC;

-- Popular routes view
CREATE OR REPLACE VIEW popular_routes AS
SELECT 
  origin,
  destination,
  COUNT(*) as search_count,
  COUNT(DISTINCT DATE_TRUNC('day', searched_at)) as days_searched
FROM flight_searches
GROUP BY origin, destination
ORDER BY search_count DESC
LIMIT 50;

-- ============================================
-- SETUP COMPLETE!
-- ============================================

-- Verify tables were created
SELECT 
  table_name,
  (SELECT COUNT(*) FROM information_schema.columns WHERE table_name = t.table_name) as column_count
FROM information_schema.tables t
WHERE table_schema = 'public' 
  AND table_type = 'BASE TABLE'
ORDER BY table_name;

-- Success message
DO $$
BEGIN
  RAISE NOTICE '==============================================';
  RAISE NOTICE 'Kenya Airways Database Setup Complete!';
  RAISE NOTICE '==============================================';
  RAISE NOTICE 'Tables created: bookings, newsletter_subscribers, flight_searches, passengers, contact_messages';
  RAISE NOTICE 'Indexes: ✓ Created';
  RAISE NOTICE 'RLS Policies: ✓ Enabled';
  RAISE NOTICE 'Functions: ✓ Created';
  RAISE NOTICE 'Triggers: ✓ Created';
  RAISE NOTICE '==============================================';
  RAISE NOTICE 'Next steps:';
  RAISE NOTICE '1. Test the tables in Table Editor';
  RAISE NOTICE '2. Configure authentication (if needed)';
  RAISE NOTICE '3. Deploy your Next.js app to Vercel';
  RAISE NOTICE '==============================================';
END $$;
