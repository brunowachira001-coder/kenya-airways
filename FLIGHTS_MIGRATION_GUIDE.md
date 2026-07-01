# Flights Database Migration & Seeding Guide

This guide will help you migrate your flights data from hardcoded static data to a dynamic database-backed system with **current dates that update automatically**.

## 🎯 What This Migration Does

- ✅ Creates a `flights` table in Supabase with proper schema
- ✅ Adds indexes for fast route and date-based searches
- ✅ Populates flights for **the next 7 days** with current dates
- ✅ Updates the flight search API to fetch from database
- ✅ All deals and flight cards will show **real current dates**
- ✅ Date filtering works correctly for the weekly range

## 📋 Prerequisites

Make sure you have:
- Supabase project set up
- Environment variables configured in `.env.local`:
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - `SUPABASE_SERVICE_ROLE_KEY`

## 🚀 Step-by-Step Migration

### Step 1: Run Database Migration

1. Open your Supabase Dashboard
2. Go to **SQL Editor**
3. Click **New Query**
4. Copy and paste the contents of `supabase-flights-migration.sql`
5. Click **Run** (or press `Ctrl/Cmd + Enter`)

You should see a success message:
```
Flights Table Migration Complete!
Tables: flights
Indexes: ✓ Created (6 indexes)
Functions: ✓ Created (2 helper functions)
Views: ✓ Created (flight_deals)
RLS: ✓ Enabled
```

### Step 2: Install Required Dependencies

The seed script requires `date-fns` and `tsx`:

```bash
# Install date-fns if not already installed
npm install date-fns

# Install tsx globally for running TypeScript scripts
npm install -g tsx
```

### Step 3: Run Seed Script

This will populate flights for the **next 7 days from today**:

```bash
# Run from project root
npx tsx seed-flights.ts
```

You should see output like:
```
🌱 Starting flight seeding...
📅 Generating flights for next 7 days from 2026-07-01
✈️  Generated 350+ flight records
🗑️  Clearing existing future flights...
📥 Inserting flights into database...
  ✓ Inserted 100/350 flights
  ✓ Inserted 200/350 flights
  ✓ Inserted 350/350 flights
✅ Flight seeding complete!

📊 Summary:
   Total flights: 350+
   Date range: Jul 01 - Jul 07, 2026
   Routes: 50+
```

### Step 4: Verify Installation

1. **Check Database**: Go to Supabase → Table Editor → `flights` table
   - You should see flights with dates from today onwards
   
2. **Test Flight Search**: Open your app and search for flights
   - Example: NBO → MBA, departure date: today
   - You should see multiple flight results with current dates

3. **Check Deals Section**: Visit the homepage
   - Deal cards should show date ranges like "01 Jul 26 to 08 Jul 26"
   - All dates should be current, not hardcoded past dates

## 🔄 Keeping Flights Current

The seed script populates flights for 7 days. To keep your flight data current, you have two options:

### Option A: Manual Re-seeding (Recommended for Development)

Run the seed script periodically:
```bash
npx tsx seed-flights.ts
```

This will:
- Clear old flights in the future date range
- Generate new flights for the next 7 days from today

### Option B: Automated Cron Job (Recommended for Production)

Set up a daily cron job or scheduled task:

**Using Vercel Cron Jobs:**
1. Create `app/api/cron/seed-flights/route.ts`:
```typescript
import { NextResponse } from 'next/server'
// Import your seed logic here

export async function GET(request: Request) {
  // Verify cron secret
  const authHeader = request.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  
  // Run seed logic
  // ... seed flights ...
  
  return NextResponse.json({ success: true })
}
```

2. Add to `vercel.json`:
```json
{
  "crons": [{
    "path": "/api/cron/seed-flights",
    "schedule": "0 0 * * *"
  }]
}
```

**Using External Cron Services:**
- Use services like [Cron-job.org](https://cron-job.org) or [EasyCron](https://www.easycron.com)
- Set up a daily job that calls your seed endpoint

## 📊 Database Schema

### Flights Table Structure

```sql
flights (
  id UUID PRIMARY KEY,
  flight_number VARCHAR(10),    -- "KQ101"
  airline VARCHAR(100),          -- "Kenya Airways"
  origin VARCHAR(3),             -- "NBO"
  destination VARCHAR(3),        -- "LHR"
  flight_date DATE,              -- "2026-07-01"
  departure_time TIME,           -- "23:30:00"
  arrival_time TIME,             -- "06:00:00"
  duration_minutes INTEGER,      -- 510
  aircraft VARCHAR(100),         -- "Boeing 787-8"
  economy_price DECIMAL(10, 2),  -- 26700.00
  business_price DECIMAL(10, 2), -- 114000.00
  stops INTEGER,                 -- 0
  available_seats INTEGER,       -- 150
  operating_days INTEGER[],      -- [1,3,5,6] or NULL for daily
  status VARCHAR(20),            -- "scheduled"
  created_at TIMESTAMP,
  updated_at TIMESTAMP
)
```

### Indexes Created

- `idx_flights_route` - Fast route lookups
- `idx_flights_date` - Fast date filtering
- `idx_flights_route_date` - Combined route + date searches
- `idx_flights_flight_number` - Flight number lookups
- `idx_flights_status` - Status filtering
- `idx_flights_search` - Optimized for common search patterns

## 🧪 Testing

### Test Flight Search
```bash
# Test API directly
curl "http://localhost:3000/api/flights/search?from=NBO&to=MBA&depart=2026-07-01"
```

Expected response:
```json
{
  "success": true,
  "flights": [
    {
      "id": "uuid-here",
      "flightNumber": "KQ601",
      "origin": "NBO",
      "destination": "MBA",
      "departureTime": "06:30",
      "arrivalTime": "07:55",
      "duration": "1h 25m",
      "economyPrice": 2950,
      "businessPrice": 7200,
      ...
    }
  ],
  "meta": {
    "origin": "NBO",
    "destination": "MBA",
    "date": "2026-07-01",
    "count": 6
  }
}
```

### Test Deals with Current Dates
Visit the homepage and check the "Deals from" section. Each deal card should display:
- Current date ranges (e.g., "01 Jul 26 to 08 Jul 26")
- Real prices from the database
- Clickable cards that lead to flight search with the correct dates

## 🔧 Troubleshooting

### Issue: "Missing environment variables"
**Solution**: Make sure `.env.local` has all required Supabase keys

### Issue: "Failed to fetch flights"
**Solution**: 
1. Check Supabase connection
2. Verify the migration ran successfully
3. Check browser console for detailed error messages

### Issue: "No flights found for today"
**Solution**: 
1. Run the seed script: `npx tsx seed-flights.ts`
2. Check if flights were inserted: Go to Supabase → Table Editor → flights

### Issue: "Dates showing in the past"
**Solution**: 
1. Re-run the seed script to generate flights with current dates
2. Clear browser cache and refresh

### Issue: "tsx command not found"
**Solution**: Install tsx globally: `npm install -g tsx`

## 📝 Notes

- **Date Format**: All dates are in `YYYY-MM-DD` format (ISO 8601)
- **Time Format**: Times are in 24-hour format `HH:MM`
- **Prices**: All prices are in KES (Kenyan Shillings)
- **Price Variation**: Seed script adds ±10% price variation per day for realism
- **Operating Days**: Some flights only operate on certain days (e.g., Mon, Wed, Fri)
- **Flight Filtering**: API automatically filters by operating days

## 🎉 Success Criteria

After migration, you should have:
- ✅ Flights table with 300+ flight records
- ✅ All flights showing dates from today to next 7 days
- ✅ Flight search working with database queries
- ✅ Deals section showing current dates
- ✅ Date filtering working correctly
- ✅ No hardcoded past dates anywhere

## 📚 Files Modified

1. **Created**:
   - `supabase-flights-migration.sql` - Database schema
   - `seed-flights.ts` - Data population script
   - `FLIGHTS_MIGRATION_GUIDE.md` - This guide

2. **Updated**:
   - `src/app/api/flights/search/route.ts` - Now fetches from database
   - `src/lib/deals.ts` - Updated comments for clarity

## 🔗 Related Documentation

- [Supabase Documentation](https://supabase.com/docs)
- [Next.js API Routes](https://nextjs.org/docs/api-routes/introduction)
- [Date-fns Documentation](https://date-fns.org/docs)

---

**Need Help?** Check the Troubleshooting section above or review the Supabase logs in your dashboard.
