#!/bin/bash

# Kenya Airways - Flights Migration Quick Setup
# This script helps you set up the flights database and seed it with current data

set -e  # Exit on error

echo "🛫 Kenya Airways - Flights Database Migration"
echo "=============================================="
echo ""

# Check if .env.local exists
if [ ! -f .env.local ]; then
    echo "❌ Error: .env.local file not found!"
    echo "Please create .env.local with your Supabase credentials:"
    echo "  NEXT_PUBLIC_SUPABASE_URL=your_url"
    echo "  NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key"
    echo "  SUPABASE_SERVICE_ROLE_KEY=your_service_role_key"
    exit 1
fi

# Load environment variables
export $(cat .env.local | grep -v '^#' | xargs)

# Check if Supabase variables are set
if [ -z "$NEXT_PUBLIC_SUPABASE_URL" ] || [ -z "$SUPABASE_SERVICE_ROLE_KEY" ]; then
    echo "❌ Error: Supabase environment variables not found!"
    echo "Make sure .env.local contains:"
    echo "  NEXT_PUBLIC_SUPABASE_URL"
    echo "  SUPABASE_SERVICE_ROLE_KEY"
    exit 1
fi

echo "✅ Environment variables loaded"
echo ""

# Step 1: Database Migration
echo "📝 Step 1: Database Migration"
echo "----------------------------"
echo "Please run the migration SQL manually:"
echo "1. Open Supabase Dashboard → SQL Editor"
echo "2. Copy contents of: supabase-flights-migration.sql"
echo "3. Paste and click 'Run'"
echo ""
read -p "Have you run the migration? (y/n) " -n 1 -r
echo ""
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "❌ Migration required. Please run it first."
    exit 1
fi

echo "✅ Migration confirmed"
echo ""

# Step 2: Check if tsx is available
echo "📦 Step 2: Checking Dependencies"
echo "--------------------------------"

if ! command -v tsx &> /dev/null; then
    echo "📥 Installing tsx globally..."
    npm install -g tsx
fi

echo "✅ tsx is available"
echo ""

# Step 3: Run seed script
echo "🌱 Step 3: Seeding Flights Database"
echo "-----------------------------------"
echo "This will populate flights for the next 7 days..."
echo ""

npx tsx seed-flights.ts

if [ $? -eq 0 ]; then
    echo ""
    echo "=============================================="
    echo "✅ Setup Complete!"
    echo "=============================================="
    echo ""
    echo "Next steps:"
    echo "1. Start your dev server: npm run dev"
    echo "2. Visit http://localhost:3000"
    echo "3. Test flight search: NBO → MBA"
    echo "4. Check deals section for current dates"
    echo ""
    echo "📖 For more info, see: FLIGHTS_MIGRATION_GUIDE.md"
    echo ""
else
    echo ""
    echo "❌ Seeding failed!"
    echo "Check error messages above and try again."
    echo "See FLIGHTS_MIGRATION_GUIDE.md for troubleshooting."
    exit 1
fi
