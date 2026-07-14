#!/bin/bash

# Kenya Airways - Automated Deployment Script
# Checks migration, seeds data, commits, and pushes to production

set -e  # Exit on error

echo "🚀 Kenya Airways - Automated Deployment"
echo "=========================================="
echo "Date: $(date)"
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Load environment variables
if [ ! -f .env.local ]; then
    echo -e "${RED}❌ Error: .env.local not found!${NC}"
    exit 1
fi

export $(cat .env.local | grep -v '^#' | xargs)

# Check Supabase connection
if [ -z "$NEXT_PUBLIC_SUPABASE_URL" ] || [ -z "$SUPABASE_SERVICE_ROLE_KEY" ]; then
    echo -e "${RED}❌ Error: Supabase credentials missing!${NC}"
    exit 1
fi

echo -e "${GREEN}✓ Environment loaded${NC}"
echo ""

# Check if flights table exists
echo "🔍 Checking if database migration was run..."
MIGRATION_CHECK=$(npx tsx - <<'EOF'
import { createClient } from '@supabase/supabase-js'
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)
async function check() {
  const { data, error } = await supabase.from('flights').select('id').limit(1)
  if (error && error.message.includes('does not exist')) {
    console.log('NOT_FOUND')
  } else if (error) {
    console.log('ERROR', error.message)
  } else {
    console.log('EXISTS')
  }
}
check()
EOF
)

if [[ "$MIGRATION_CHECK" == *"NOT_FOUND"* ]]; then
    echo -e "${YELLOW}⚠️  Flights table not found!${NC}"
    echo ""
    echo "Please run the SQL migration first:"
    echo "1. Open https://supabase.com/dashboard"
    echo "2. Go to SQL Editor"
    echo "3. Copy & paste: supabase-flights-migration.sql"
    echo "4. Click Run"
    echo ""
    echo "Then run this script again."
    exit 1
elif [[ "$MIGRATION_CHECK" == *"ERROR"* ]]; then
    echo -e "${RED}❌ Database error!${NC}"
    echo "$MIGRATION_CHECK"
    exit 1
fi

echo -e "${GREEN}✓ Database migration confirmed${NC}"
echo ""

# Seed flights
echo "🌱 Seeding flights database..."
echo "Generating flights for next 7 days from today..."
echo ""

npx tsx seed-flights.ts

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Seeding failed!${NC}"
    exit 1
fi

echo ""
echo -e "${GREEN}✓ Database seeded successfully${NC}"
echo ""

# Verify flights were created
echo "🔍 Verifying flights..."
FLIGHT_COUNT=$(npx tsx - <<'EOF'
import { createClient } from '@supabase/supabase-js'
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)
async function count() {
  const { count } = await supabase.from('flights').select('*', { count: 'exact', head: true })
  console.log(count || 0)
}
count()
EOF
)

if [ "$FLIGHT_COUNT" -gt 0 ]; then
    echo -e "${GREEN}✓ Verified: $FLIGHT_COUNT flights in database${NC}"
else
    echo -e "${RED}❌ No flights found in database!${NC}"
    exit 1
fi

echo ""

# Git operations
echo "📦 Preparing deployment..."
echo ""

# Add all changes
git add .

# Check if there are changes to commit
if git diff --staged --quiet; then
    echo -e "${YELLOW}⚠️  No changes to commit${NC}"
    echo ""
    read -p "Push anyway? (y/n) " -n 1 -r
    echo ""
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "Deployment cancelled."
        exit 0
    fi
else
    # Commit changes
    echo "📝 Creating commit..."
    git commit -m "feat: migrate to database-backed flights with current dates

- Add flights table schema with proper indexing
- Implement seed script for 350+ flights across 50+ routes  
- Update flight search API to query Supabase database
- All dates now show current week (01 Jul 26 onwards)
- No more hardcoded past dates
- Add comprehensive documentation and setup scripts

Changes:
- Created: supabase-flights-migration.sql (database schema)
- Created: seed-flights.ts (data population script)
- Modified: src/app/api/flights/search/route.ts (database queries)
- Modified: src/lib/deals.ts (dynamic date generation)
- Added: Migration guides and documentation"

    echo -e "${GREEN}✓ Commit created${NC}"
fi

echo ""

# Push to remote
echo "🚀 Pushing to GitHub..."
BRANCH=$(git rev-parse --abbrev-ref HEAD)
git push origin "$BRANCH"

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Pushed to GitHub successfully${NC}"
else
    echo -e "${RED}❌ Push failed!${NC}"
    exit 1
fi

echo ""
echo "==========================================="
echo -e "${GREEN}✅ DEPLOYMENT COMPLETE!${NC}"
echo "==========================================="
echo ""
echo "🎉 Changes pushed to GitHub"
echo "🚀 Vercel will auto-deploy to kq-airways.com"
echo ""
echo "📊 Summary:"
echo "   • Flights in DB: $FLIGHT_COUNT"
echo "   • Date range: Next 7 days from today"
echo "   • Routes: 50+ routes covered"
echo ""
echo "🔗 Next steps:"
echo "1. Check Vercel dashboard for deployment status"
echo "2. Visit https://kq-airways.com (wait ~2 minutes)"
echo "3. Test flight search: NBO → MBA"
echo "4. Verify deals show current dates"
echo ""
echo "📖 Documentation: See FLIGHTS_MIGRATION_GUIDE.md"
echo ""
