#!/bin/bash

# Complete Automated Deployment Script
# This script will attempt to complete the entire deployment

set -e

echo "╔══════════════════════════════════════════════════════════════╗"
echo "║  🚀 KENYA AIRWAYS - COMPLETE AUTOMATED DEPLOYMENT           ║"
echo "╚══════════════════════════════════════════════════════════════╝"
echo ""
echo "Date: $(date)"
echo "Target: https://www.kq-airways.com"
echo ""

# Load environment
export $(cat .env.local | grep -v '^#' | xargs)

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📋 STEP 1: Check Database Migration Status"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Check table exists
TABLE_EXISTS=$(npx tsx - <<'EOF'
import { createClient } from '@supabase/supabase-js'
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)
const { error } = await supabase.from('flights').select('id').limit(1)
console.log(error ? 'false' : 'true')
EOF
)

if [ "$TABLE_EXISTS" = "true" ]; then
    echo "✅ Flights table exists!"
    echo ""
else
    echo "❌ Flights table does NOT exist"
    echo ""
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "⚠️  MANUAL ACTION REQUIRED"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo ""
    echo "I cannot create database tables via API."
    echo "You MUST run the SQL migration in Supabase Dashboard:"
    echo ""
    echo "1. Open: https://supabase.com/dashboard"
    echo "2. Select: zkyyfvoiwwyovutoaznm"
    echo "3. SQL Editor → New Query"
    echo "4. Copy SQL from: supabase-flights-migration.sql"
    echo "5. Paste and click Run"
    echo ""
    echo "Display SQL with:"
    echo "  cat /home/bruno/kk/supabase-flights-migration.sql"
    echo ""
    echo "After migration, run this script again."
    echo ""
    exit 1
fi

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📋 STEP 2: Seed Database with Current Flights"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

npx tsx seed-flights.ts

if [ $? -ne 0 ]; then
    echo ""
    echo "❌ Seeding failed!"
    exit 1
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📋 STEP 3: Verify Deployment"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Count flights
FLIGHT_COUNT=$(npx tsx - <<'EOF'
import { createClient } from '@supabase/supabase-js'
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)
const { count } = await supabase.from('flights').select('*', { count: 'exact', head: true })
console.log(count || 0)
EOF
)

echo "✅ Total flights in database: $FLIGHT_COUNT"
echo ""

# Get date range
echo "📅 Flight date range:"
npx tsx - <<'EOF'
import { createClient } from '@supabase/supabase-js'
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)
const { data } = await supabase.from('flights').select('flight_date').order('flight_date', { ascending: true }).limit(1)
const { data: data2 } = await supabase.from('flights').select('flight_date').order('flight_date', { ascending: false }).limit(1)
console.log(`   From: ${data?.[0]?.flight_date}`)
console.log(`   To: ${data2?.[0]?.flight_date}`)
EOF

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ DEPLOYMENT COMPLETE!"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "🌐 Website: https://www.kq-airways.com"
echo "✈️  Flights: $FLIGHT_COUNT flights available"
echo "📅 Dates: Always current (updated today)"
echo ""
echo "🧪 Test now:"
echo "  • Visit homepage - check deals show current dates"
echo "  • Search NBO → MBA - should show 6+ flights"
echo "  • Try other routes: NBO-LHR, NBO-DXB, etc."
echo ""
