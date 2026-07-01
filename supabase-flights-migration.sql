-- ============================================
-- KENYA AIRWAYS - FLIGHTS TABLE MIGRATION
-- ============================================
-- This migration creates the flights table for storing flight data
-- with proper indexing for fast searches by route and date

-- ============================================
-- 1. CREATE FLIGHTS TABLE
-- ============================================

CREATE TABLE IF NOT EXISTS flights (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  -- Flight Identity
  flight_number VARCHAR(10) NOT NULL, -- e.g. "KQ101"
  airline VARCHAR(100) DEFAULT 'Kenya Airways',
  
  -- Route Information
  origin VARCHAR(3) NOT NULL, -- IATA code (e.g., "NBO")
  destination VARCHAR(3) NOT NULL, -- IATA code (e.g., "LHR")
  
  -- Schedule Information
  flight_date DATE NOT NULL, -- Date of the flight
  departure_time TIME NOT NULL, -- Local departure time
  arrival_time TIME NOT NULL, -- Local arrival time
  duration_minutes INTEGER NOT NULL, -- Flight duration in minutes
  
  -- Aircraft Information
  aircraft VARCHAR(100), -- e.g., "Boeing 787-8"
  
  -- Pricing
  economy_price DECIMAL(10, 2) NOT NULL,
  business_price DECIMAL(10, 2) NOT NULL,
  
  -- Flight Details
  stops INTEGER DEFAULT 0, -- 0 = direct, 1 = one-stop, etc.
  available_seats INTEGER DEFAULT 100,
  
  -- Operating Days (optional - NULL means operates daily)
  operating_days INTEGER[], -- Array: [0,1,2,3,4,5,6] for Sun-Sat
  
  -- Status
  status VARCHAR(20) DEFAULT 'scheduled', -- scheduled, departed, arrived, cancelled, delayed
  
  -- Timestamps
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- ============================================
-- 2. CREATE INDEXES FOR PERFORMANCE
-- ============================================

-- Core search indexes
CREATE INDEX IF NOT EXISTS idx_flights_route ON flights(origin, destination);
CREATE INDEX IF NOT EXISTS idx_flights_date ON flights(flight_date);
CREATE INDEX IF NOT EXISTS idx_flights_route_date ON flights(origin, destination, flight_date);
CREATE INDEX IF NOT EXISTS idx_flights_flight_number ON flights(flight_number);
CREATE INDEX IF NOT EXISTS idx_flights_status ON flights(status);

-- Composite index for common search pattern
CREATE INDEX IF NOT EXISTS idx_flights_search ON flights(origin, destination, flight_date, status)
  WHERE status = 'scheduled';

-- ============================================
-- 3. CREATE TRIGGER FOR AUTO-UPDATE TIMESTAMP
-- ============================================

CREATE TRIGGER update_flights_updated_at
  BEFORE UPDATE ON flights
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- 4. ENABLE ROW LEVEL SECURITY
-- ============================================

ALTER TABLE flights ENABLE ROW LEVEL SECURITY;

-- Public read access to flights
CREATE POLICY "Anyone can view scheduled flights" 
  ON flights FOR SELECT 
  USING (status = 'scheduled');

-- Service role can manage all flights
CREATE POLICY "Service role can manage flights" 
  ON flights FOR ALL 
  USING (true)
  WITH CHECK (true);

-- ============================================
-- 5. CREATE HELPER FUNCTIONS
-- ============================================

-- Function to get available flights for a route on a specific date
CREATE OR REPLACE FUNCTION get_flights_for_route(
  p_origin VARCHAR(3),
  p_destination VARCHAR(3),
  p_date DATE
)
RETURNS TABLE (
  id UUID,
  flight_number VARCHAR(10),
  departure_time TIME,
  arrival_time TIME,
  duration_minutes INTEGER,
  aircraft VARCHAR(100),
  economy_price DECIMAL(10, 2),
  business_price DECIMAL(10, 2),
  stops INTEGER,
  available_seats INTEGER
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    f.id,
    f.flight_number,
    f.departure_time,
    f.arrival_time,
    f.duration_minutes,
    f.aircraft,
    f.economy_price,
    f.business_price,
    f.stops,
    f.available_seats
  FROM flights f
  WHERE f.origin = p_origin
    AND f.destination = p_destination
    AND f.flight_date = p_date
    AND f.status = 'scheduled'
    AND f.available_seats > 0
    AND (
      f.operating_days IS NULL 
      OR EXTRACT(DOW FROM p_date)::INTEGER = ANY(f.operating_days)
    )
  ORDER BY f.departure_time;
END;
$$ LANGUAGE plpgsql;

-- Function to get flight count for date range (for calendar UI)
CREATE OR REPLACE FUNCTION get_flight_counts_for_range(
  p_origin VARCHAR(3),
  p_destination VARCHAR(3),
  p_start_date DATE,
  p_end_date DATE
)
RETURNS TABLE (
  flight_date DATE,
  flight_count BIGINT,
  min_economy_price DECIMAL(10, 2)
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    f.flight_date,
    COUNT(*) as flight_count,
    MIN(f.economy_price) as min_economy_price
  FROM flights f
  WHERE f.origin = p_origin
    AND f.destination = p_destination
    AND f.flight_date BETWEEN p_start_date AND p_end_date
    AND f.status = 'scheduled'
    AND f.available_seats > 0
  GROUP BY f.flight_date
  ORDER BY f.flight_date;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- 6. CREATE VIEW FOR DEALS
-- ============================================

-- View for popular routes with best prices
CREATE OR REPLACE VIEW flight_deals AS
SELECT DISTINCT ON (f.origin, f.destination)
  f.origin,
  f.destination,
  MIN(f.flight_date) OVER (PARTITION BY f.origin, f.destination) as earliest_date,
  MAX(f.flight_date) OVER (PARTITION BY f.origin, f.destination) as latest_date,
  MIN(f.economy_price) OVER (PARTITION BY f.origin, f.destination) as min_economy_price,
  MIN(f.business_price) OVER (PARTITION BY f.origin, f.destination) as min_business_price,
  COUNT(*) OVER (PARTITION BY f.origin, f.destination) as flight_count
FROM flights f
WHERE f.status = 'scheduled'
  AND f.flight_date >= CURRENT_DATE
  AND f.flight_date <= CURRENT_DATE + INTERVAL '30 days'
ORDER BY f.origin, f.destination, f.economy_price;

-- ============================================
-- SUCCESS MESSAGE
-- ============================================

DO $$
BEGIN
  RAISE NOTICE '============================================';
  RAISE NOTICE 'Flights Table Migration Complete!';
  RAISE NOTICE '============================================';
  RAISE NOTICE 'Tables: flights';
  RAISE NOTICE 'Indexes: ✓ Created (6 indexes)';
  RAISE NOTICE 'Functions: ✓ Created (2 helper functions)';
  RAISE NOTICE 'Views: ✓ Created (flight_deals)';
  RAISE NOTICE 'RLS: ✓ Enabled';
  RAISE NOTICE '============================================';
  RAISE NOTICE 'Next: Run seed script to populate flights';
  RAISE NOTICE '============================================';
END $$;
