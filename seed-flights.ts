/**
 * Seed script to populate flights table with current dates
 * Run with: npx tsx seed-flights.ts
 */

import { createClient } from '@supabase/supabase-js'
import { addDays, format } from 'date-fns'

// Environment variables
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || ''

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error('❌ Missing environment variables!')
  console.error('Required: NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY')
  process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY)

// Base flight schedules (without dates)
interface BaseFlightSchedule {
  flightNumber: string
  origin: string
  destination: string
  departureTime: string
  arrivalTime: string
  durationMinutes: number
  aircraft: string
  economyPrice: number
  businessPrice: number
  stops: number
  operatingDays?: number[] // 0=Sun, 1=Mon, ..., 6=Sat
}

const BASE_FLIGHT_SCHEDULES: BaseFlightSchedule[] = [
  // NBO ↔ MBA — Domestic, multiple daily
  { flightNumber: 'KQ601', origin: 'NBO', destination: 'MBA', departureTime: '06:30', arrivalTime: '07:55', durationMinutes: 85, aircraft: 'Boeing 737-800', economyPrice: 2950, businessPrice: 7200, stops: 0 },
  { flightNumber: 'KQ603', origin: 'NBO', destination: 'MBA', departureTime: '09:00', arrivalTime: '10:25', durationMinutes: 85, aircraft: 'Boeing 737-800', economyPrice: 3350, businessPrice: 8100, stops: 0 },
  { flightNumber: 'KQ605', origin: 'NBO', destination: 'MBA', departureTime: '12:00', arrivalTime: '13:25', durationMinutes: 85, aircraft: 'Boeing 737-800', economyPrice: 2900, businessPrice: 6900, stops: 0 },
  { flightNumber: 'KQ607', origin: 'NBO', destination: 'MBA', departureTime: '14:30', arrivalTime: '15:55', durationMinutes: 85, aircraft: 'Embraer E190', economyPrice: 2600, businessPrice: 6300, stops: 0 },
  { flightNumber: 'KQ609', origin: 'NBO', destination: 'MBA', departureTime: '17:00', arrivalTime: '18:25', durationMinutes: 85, aircraft: 'Boeing 737-800', economyPrice: 3200, businessPrice: 7500, stops: 0 },
  { flightNumber: 'KQ611', origin: 'NBO', destination: 'MBA', departureTime: '20:00', arrivalTime: '21:25', durationMinutes: 85, aircraft: 'Embraer E190', economyPrice: 2400, businessPrice: 6000, stops: 0 },
  
  { flightNumber: 'KQ600', origin: 'MBA', destination: 'NBO', departureTime: '06:00', arrivalTime: '07:25', durationMinutes: 85, aircraft: 'Boeing 737-800', economyPrice: 2950, businessPrice: 7200, stops: 0 },
  { flightNumber: 'KQ602', origin: 'MBA', destination: 'NBO', departureTime: '08:30', arrivalTime: '09:55', durationMinutes: 85, aircraft: 'Boeing 737-800', economyPrice: 3350, businessPrice: 8100, stops: 0 },
  { flightNumber: 'KQ604', origin: 'MBA', destination: 'NBO', departureTime: '11:00', arrivalTime: '12:25', durationMinutes: 85, aircraft: 'Boeing 737-800', economyPrice: 2900, businessPrice: 6900, stops: 0 },
  { flightNumber: 'KQ608', origin: 'MBA', destination: 'NBO', departureTime: '16:30', arrivalTime: '17:55', durationMinutes: 85, aircraft: 'Embraer E190', economyPrice: 2600, businessPrice: 6300, stops: 0 },
  { flightNumber: 'KQ610', origin: 'MBA', destination: 'NBO', departureTime: '19:30', arrivalTime: '20:55', durationMinutes: 85, aircraft: 'Boeing 737-800', economyPrice: 3200, businessPrice: 7500, stops: 0 },

  // NBO ↔ LHR — Long-haul
  { flightNumber: 'KQ101', origin: 'NBO', destination: 'LHR', departureTime: '23:30', arrivalTime: '06:00', durationMinutes: 510, aircraft: 'Boeing 787-8', economyPrice: 26700, businessPrice: 114000, stops: 0 },
  { flightNumber: 'KQ100', origin: 'LHR', destination: 'NBO', departureTime: '11:30', arrivalTime: '20:30', durationMinutes: 480, aircraft: 'Boeing 787-8', economyPrice: 26100, businessPrice: 111000, stops: 0 },
  
  // NBO ↔ DXB
  { flightNumber: 'KQ301', origin: 'NBO', destination: 'DXB', departureTime: '22:00', arrivalTime: '04:30', durationMinutes: 330, aircraft: 'Boeing 787-8', economyPrice: 17400, businessPrice: 63000, stops: 0 },
  { flightNumber: 'KQ300', origin: 'DXB', destination: 'NBO', departureTime: '02:00', arrivalTime: '06:30', durationMinutes: 330, aircraft: 'Boeing 787-8', economyPrice: 16800, businessPrice: 61500, stops: 0 },
  { flightNumber: 'KQ303', origin: 'NBO', destination: 'DXB', departureTime: '10:00', arrivalTime: '14:30', durationMinutes: 330, aircraft: 'Boeing 737-800', economyPrice: 15600, businessPrice: 57000, stops: 0 },

  // NBO ↔ JNB
  { flightNumber: 'KQ401', origin: 'NBO', destination: 'JNB', departureTime: '08:00', arrivalTime: '12:00', durationMinutes: 240, aircraft: 'Boeing 787-8', economyPrice: 12600, businessPrice: 52500, stops: 0 },
  { flightNumber: 'KQ403', origin: 'NBO', destination: 'JNB', departureTime: '20:00', arrivalTime: '00:00', durationMinutes: 240, aircraft: 'Boeing 737-800', economyPrice: 11400, businessPrice: 48000, stops: 0 },
  { flightNumber: 'KQ400', origin: 'JNB', destination: 'NBO', departureTime: '06:00', arrivalTime: '10:00', durationMinutes: 240, aircraft: 'Boeing 787-8', economyPrice: 12600, businessPrice: 52500, stops: 0 },
  { flightNumber: 'KQ402', origin: 'JNB', destination: 'NBO', departureTime: '17:00', arrivalTime: '21:00', durationMinutes: 240, aircraft: 'Boeing 737-800', economyPrice: 11400, businessPrice: 48000, stops: 0 },

  // NBO ↔ JFK
  { flightNumber: 'KQ002', origin: 'NBO', destination: 'JFK', departureTime: '23:59', arrivalTime: '06:59', durationMinutes: 900, aircraft: 'Boeing 787-8', economyPrice: 49500, businessPrice: 204000, stops: 0 },
  { flightNumber: 'KQ001', origin: 'JFK', destination: 'NBO', departureTime: '18:00', arrivalTime: '15:00', durationMinutes: 840, aircraft: 'Boeing 787-8', economyPrice: 48600, businessPrice: 201000, stops: 0 },

  // NBO ↔ CDG (Paris)
  { flightNumber: 'KQ113', origin: 'NBO', destination: 'CDG', departureTime: '22:00', arrivalTime: '05:30', durationMinutes: 510, aircraft: 'Boeing 787-8', economyPrice: 23400, businessPrice: 99000, stops: 0, operatingDays: [1, 3, 5, 6] },
  { flightNumber: 'KQ112', origin: 'CDG', destination: 'NBO', departureTime: '10:00', arrivalTime: '19:30', durationMinutes: 510, aircraft: 'Boeing 787-8', economyPrice: 22800, businessPrice: 96000, stops: 0, operatingDays: [1, 3, 5, 6] },

  // NBO ↔ AMS (Amsterdam)
  { flightNumber: 'KQ115', origin: 'NBO', destination: 'AMS', departureTime: '21:00', arrivalTime: '04:30', durationMinutes: 510, aircraft: 'Boeing 787-8', economyPrice: 22500, businessPrice: 94500, stops: 0, operatingDays: [0, 2, 4] },
  { flightNumber: 'KQ114', origin: 'AMS', destination: 'NBO', departureTime: '11:00', arrivalTime: '20:30', durationMinutes: 510, aircraft: 'Boeing 787-8', economyPrice: 21900, businessPrice: 91500, stops: 0, operatingDays: [0, 2, 4] },

  // NBO ↔ DOH (Doha)
  { flightNumber: 'KQ305', origin: 'NBO', destination: 'DOH', departureTime: '22:30', arrivalTime: '03:00', durationMinutes: 330, aircraft: 'Boeing 737-800', economyPrice: 16500, businessPrice: 60000, stops: 0 },

  // NBO ↔ BOM (Mumbai)
  { flightNumber: 'KQ201', origin: 'NBO', destination: 'BOM', departureTime: '20:30', arrivalTime: '04:00', durationMinutes: 330, aircraft: 'Boeing 787-8', economyPrice: 21600, businessPrice: 84000, stops: 0 },
  { flightNumber: 'KQ200', origin: 'BOM', destination: 'NBO', departureTime: '05:30', arrivalTime: '10:00', durationMinutes: 330, aircraft: 'Boeing 787-8', economyPrice: 21600, businessPrice: 84000, stops: 0 },

  // NBO ↔ DEL (Delhi)
  { flightNumber: 'KQ203', origin: 'NBO', destination: 'DEL', departureTime: '21:30', arrivalTime: '05:30', durationMinutes: 360, aircraft: 'Boeing 787-8', economyPrice: 22500, businessPrice: 87000, stops: 0 },
  { flightNumber: 'KQ202', origin: 'DEL', destination: 'NBO', departureTime: '06:30', arrivalTime: '11:30', durationMinutes: 360, aircraft: 'Boeing 787-8', economyPrice: 22500, businessPrice: 87000, stops: 0 },

  // Regional East Africa
  { flightNumber: 'KQ510', origin: 'NBO', destination: 'EBB', departureTime: '08:00', arrivalTime: '09:30', durationMinutes: 90, aircraft: 'Embraer E190', economyPrice: 6600, businessPrice: 16500, stops: 0 },
  { flightNumber: 'KQ512', origin: 'NBO', destination: 'EBB', departureTime: '14:00', arrivalTime: '15:30', durationMinutes: 90, aircraft: 'Embraer E190', economyPrice: 5900, businessPrice: 14400, stops: 0 },
  { flightNumber: 'KQ511', origin: 'EBB', destination: 'NBO', departureTime: '10:00', arrivalTime: '11:30', durationMinutes: 90, aircraft: 'Embraer E190', economyPrice: 6600, businessPrice: 16500, stops: 0 },

  { flightNumber: 'KQ530', origin: 'NBO', destination: 'DAR', departureTime: '07:00', arrivalTime: '08:20', durationMinutes: 80, aircraft: 'Boeing 737-800', economyPrice: 5400, businessPrice: 13500, stops: 0 },
  { flightNumber: 'KQ534', origin: 'NBO', destination: 'DAR', departureTime: '13:00', arrivalTime: '14:20', durationMinutes: 80, aircraft: 'Boeing 737-800', economyPrice: 4800, businessPrice: 12000, stops: 0 },
  { flightNumber: 'KQ531', origin: 'DAR', destination: 'NBO', departureTime: '09:00', arrivalTime: '10:20', durationMinutes: 80, aircraft: 'Boeing 737-800', economyPrice: 5400, businessPrice: 13500, stops: 0 },

  { flightNumber: 'KQ540', origin: 'NBO', destination: 'ZNZ', departureTime: '09:30', arrivalTime: '10:45', durationMinutes: 75, aircraft: 'Embraer E190', economyPrice: 5100, businessPrice: 12600, stops: 0 },
  { flightNumber: 'KQ544', origin: 'NBO', destination: 'ZNZ', departureTime: '15:30', arrivalTime: '16:45', durationMinutes: 75, aircraft: 'Boeing 737-800', economyPrice: 4700, businessPrice: 11400, stops: 0 },
  { flightNumber: 'KQ541', origin: 'ZNZ', destination: 'NBO', departureTime: '11:15', arrivalTime: '12:30', durationMinutes: 75, aircraft: 'Embraer E190', economyPrice: 5100, businessPrice: 12600, stops: 0 },

  { flightNumber: 'KQ450', origin: 'NBO', destination: 'ADD', departureTime: '08:30', arrivalTime: '12:30', durationMinutes: 120, aircraft: 'Boeing 737-800', economyPrice: 8400, businessPrice: 22500, stops: 0 },
  { flightNumber: 'KQ451', origin: 'ADD', destination: 'NBO', departureTime: '13:00', arrivalTime: '17:00', durationMinutes: 120, aircraft: 'Boeing 737-800', economyPrice: 8400, businessPrice: 22500, stops: 0 },

  // Domestic Kenya
  { flightNumber: 'KQ620', origin: 'NBO', destination: 'KIS', departureTime: '07:00', arrivalTime: '08:15', durationMinutes: 75, aircraft: 'Embraer E190', economyPrice: 2300, businessPrice: 5400, stops: 0 },
  { flightNumber: 'KQ622', origin: 'NBO', destination: 'KIS', departureTime: '13:00', arrivalTime: '14:15', durationMinutes: 75, aircraft: 'Embraer E190', economyPrice: 2100, businessPrice: 5100, stops: 0 },
  { flightNumber: 'KQ621', origin: 'KIS', destination: 'NBO', departureTime: '09:00', arrivalTime: '10:15', durationMinutes: 75, aircraft: 'Embraer E190', economyPrice: 2300, businessPrice: 5400, stops: 0 },

  // More European routes
  { flightNumber: 'KQ117', origin: 'NBO', destination: 'FRA', departureTime: '21:30', arrivalTime: '05:30', durationMinutes: 480, aircraft: 'Boeing 787-8', economyPrice: 24000, businessPrice: 102000, stops: 0, operatingDays: [1, 3, 5] },
  { flightNumber: 'KQ121', origin: 'NBO', destination: 'FCO', departureTime: '22:00', arrivalTime: '06:00', durationMinutes: 480, aircraft: 'Boeing 787-8', economyPrice: 23700, businessPrice: 100500, stops: 0, operatingDays: [1, 3, 5, 6] },

  // Middle East
  { flightNumber: 'KQ307', origin: 'NBO', destination: 'AUH', departureTime: '21:00', arrivalTime: '03:00', durationMinutes: 300, aircraft: 'Boeing 787-8', economyPrice: 16200, businessPrice: 62400, stops: 0 },
  { flightNumber: 'KQ310', origin: 'NBO', destination: 'JED', departureTime: '22:30', arrivalTime: '03:30', durationMinutes: 300, aircraft: 'Boeing 787-8', economyPrice: 16500, businessPrice: 64500, stops: 0 },

  // Southern Africa
  { flightNumber: 'KQ580', origin: 'NBO', destination: 'MRU', departureTime: '09:00', arrivalTime: '13:00', durationMinutes: 240, aircraft: 'Boeing 787-8', economyPrice: 20400, businessPrice: 78000, stops: 0, operatingDays: [1, 4, 6] },
  { flightNumber: 'KQ581', origin: 'MRU', destination: 'NBO', departureTime: '14:00', arrivalTime: '18:00', durationMinutes: 240, aircraft: 'Boeing 787-8', economyPrice: 20400, businessPrice: 78000, stops: 0, operatingDays: [1, 4, 6] },

  { flightNumber: 'KQ405', origin: 'NBO', destination: 'CPT', departureTime: '08:30', arrivalTime: '14:30', durationMinutes: 300, aircraft: 'Boeing 737-800', economyPrice: 14400, businessPrice: 58500, stops: 1 },

  // Asia
  { flightNumber: 'KQ886', origin: 'NBO', destination: 'BKK', departureTime: '22:00', arrivalTime: '10:00', durationMinutes: 600, aircraft: 'Boeing 787-8', economyPrice: 29400, businessPrice: 117000, stops: 0 },

  // North America
  { flightNumber: 'KQ104', origin: 'NBO', destination: 'YYZ', departureTime: '22:00', arrivalTime: '06:00', durationMinutes: 840, aircraft: 'Boeing 787-8', economyPrice: 46500, businessPrice: 186000, stops: 0, operatingDays: [1, 4, 6] },

  // West Africa
  { flightNumber: 'KQ492', origin: 'NBO', destination: 'LOS', departureTime: '22:00', arrivalTime: '04:00', durationMinutes: 360, aircraft: 'Boeing 737-800', economyPrice: 22500, businessPrice: 88500, stops: 0 },
]

// Helper to add small random price variation (±10%)
function addPriceVariation(basePrice: number, date: Date): number {
  // Use date as seed for consistent but varied pricing
  const seed = date.getTime() / (1000 * 60 * 60 * 24)
  const variation = (Math.sin(seed) * 0.1) // -10% to +10%
  return Math.round(basePrice * (1 + variation) / 100) * 100 // Round to nearest 100
}

// Check if flight operates on a given day
function operatesOnDay(schedule: BaseFlightSchedule, date: Date): boolean {
  if (!schedule.operatingDays) return true // Daily
  const dayOfWeek = date.getDay()
  return schedule.operatingDays.includes(dayOfWeek)
}

async function seedFlights() {
  console.log('🌱 Starting flight seeding...')
  console.log(`📅 Generating flights for next 7 days from ${format(new Date(), 'yyyy-MM-dd')}`)
  
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  
  const flights = []
  
  // Generate flights for next 7 days
  for (let dayOffset = 0; dayOffset < 7; dayOffset++) {
    const flightDate = addDays(today, dayOffset)
    const dateStr = format(flightDate, 'yyyy-MM-dd')
    
    for (const schedule of BASE_FLIGHT_SCHEDULES) {
      // Check if flight operates on this day
      if (!operatesOnDay(schedule, flightDate)) {
        continue
      }
      
      // Add price variation based on date
      const economyPrice = addPriceVariation(schedule.economyPrice, flightDate)
      const businessPrice = addPriceVariation(schedule.businessPrice, flightDate)
      
      flights.push({
        flight_number: schedule.flightNumber,
        airline: 'Kenya Airways',
        origin: schedule.origin,
        destination: schedule.destination,
        flight_date: dateStr,
        departure_time: schedule.departureTime,
        arrival_time: schedule.arrivalTime,
        duration_minutes: schedule.durationMinutes,
        aircraft: schedule.aircraft,
        economy_price: economyPrice,
        business_price: businessPrice,
        stops: schedule.stops,
        available_seats: 100 + Math.floor(Math.random() * 100), // Random between 100-200
        operating_days: schedule.operatingDays || null,
        status: 'scheduled',
      })
    }
  }
  
  console.log(`✈️  Generated ${flights.length} flight records`)
  
  // Delete existing future flights
  console.log('🗑️  Clearing existing future flights...')
  const { error: deleteError } = await supabase
    .from('flights')
    .delete()
    .gte('flight_date', format(today, 'yyyy-MM-dd'))
  
  if (deleteError) {
    console.error('❌ Error clearing flights:', deleteError)
    process.exit(1)
  }
  
  // Insert in batches of 100
  console.log('📥 Inserting flights into database...')
  const batchSize = 100
  let inserted = 0
  
  for (let i = 0; i < flights.length; i += batchSize) {
    const batch = flights.slice(i, i + batchSize)
    const { error } = await supabase.from('flights').insert(batch)
    
    if (error) {
      console.error(`❌ Error inserting batch ${i / batchSize + 1}:`, error)
      process.exit(1)
    }
    
    inserted += batch.length
    console.log(`  ✓ Inserted ${inserted}/${flights.length} flights`)
  }
  
  console.log('✅ Flight seeding complete!')
  console.log('')
  console.log('📊 Summary:')
  console.log(`   Total flights: ${flights.length}`)
  console.log(`   Date range: ${format(today, 'MMM dd')} - ${format(addDays(today, 6), 'MMM dd, yyyy')}`)
  console.log(`   Routes: ${new Set(flights.map(f => `${f.origin}-${f.destination}`)).size}`)
  console.log('')
}

// Run the seed
seedFlights()
  .then(() => {
    console.log('🎉 Done!')
    process.exit(0)
  })
  .catch((err) => {
    console.error('💥 Fatal error:', err)
    process.exit(1)
  })
