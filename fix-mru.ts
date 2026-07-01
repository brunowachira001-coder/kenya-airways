import { createClient } from '@supabase/supabase-js'
import { addDays, format } from 'date-fns'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

async function fixMRU() {
  console.log('🔧 Inserting missing MRU flights...')
  
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  
  const flights = []
  
  for (let dayOffset = 0; dayOffset < 7; dayOffset++) {
    const flightDate = addDays(today, dayOffset)
    const dateStr = format(flightDate, 'yyyy-MM-dd')
    
    // NBO → MRU
    flights.push({
      flight_number: 'KQ580',
      origin: 'NBO',
      destination: 'MRU',
      flight_date: dateStr,
      departure_time: '09:00:00',
      arrival_time: '13:00:00',
      duration_minutes: 240,
      aircraft: 'Boeing 787-8',
      airline: 'Kenya Airways',
      economy_price: 20400,
      business_price: 78000,
      stops: 0,
      available_seats: 180,
      status: 'scheduled'
    })
  }
  
  // Delete existing MRU outbound flights first
  const { error: delError } = await supabase
    .from('flights')
    .delete()
    .eq('origin', 'NBO')
    .eq('destination', 'MRU')
    .gte('flight_date', format(today, 'yyyy-MM-dd'))
  
  if (delError) console.error('Delete error:', delError)
  
  // Insert new ones
  const { error, count } = await supabase
    .from('flights')
    .insert(flights)
  
  if (error) {
    console.error('Insert error:', error)
  } else {
    console.log(`✅ Inserted ${flights.length} NBO→MRU flights`)
  }
  
  // Verify
  const { data, error: verifyErr } = await supabase
    .from('flights')
    .select('flight_date, economy_price')
    .eq('origin', 'NBO')
    .eq('destination', 'MRU')
    .gte('flight_date', format(today, 'yyyy-MM-dd'))
    .order('flight_date')
  
  if (!verifyErr) {
    console.log(`✅ Verified: ${data?.length} MRU flights in database`)
    data?.forEach(f => console.log(`   ${f.flight_date}: KES ${f.economy_price}`))
  }
}

fixMRU()
