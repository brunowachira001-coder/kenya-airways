# 🚀 FINAL DEPLOYMENT - Step-by-Step Checklist

**Status**: Migration Required → Seed → Deploy  
**Time Required**: 5 minutes  
**Current Time**: July 1, 2026, 13:27

---

## ✅ Pre-Flight Checklist

- [x] Environment variables configured
- [x] Supabase project connected: `zkyyfvoiwwyovutoaznm`
- [x] Migration SQL prepared: `supabase-flights-migration.sql`
- [x] Seed script ready: `seed-flights.ts`
- [x] All code changes committed
- [ ] **SQL Migration** ← **YOU ARE HERE**
- [ ] Database seeding
- [ ] Push to production

---

## 🎯 STEP 1: Run SQL Migration (2 minutes)

**⚠️ IMPORTANT**: This step **MUST** be done manually in Supabase Dashboard.

### Instructions:

1. **Open Supabase Dashboard**:
   - Go to: https://supabase.com/dashboard
   - Login if needed
   - Select project: `Kenya Airways` (ID: zkyyfvoiwwyovutoaznm)

2. **Open SQL Editor**:
   - Click **SQL Editor** in left sidebar
   - Click **New Query** button (top right)

3. **Copy Migration SQL**:
   ```bash
   # Open this file and copy ALL content:
   /home/bruno/kk/supabase-flights-migration.sql
   ```
   
   Or run this to display it:
   ```bash
   cat /home/bruno/kk/supabase-flights-migration.sql
   ```

4. **Run Migration**:
   - Paste the SQL into the editor
   - Click **Run** button (or press `Ctrl/Cmd + Enter`)
   - Wait for: "Flights Table Migration Complete!" message

5. **Verify Success**:
   - Go to **Table Editor** in left sidebar
   - You should see new `flights` table
   - Click on it to view structure (should be empty for now)

---

## 🎯 STEP 2: Automated Seeding & Deployment (3 minutes)

**After SQL migration succeeds**, run this command:

```bash
cd /home/bruno/kk
./deploy-flights.sh
```

This script will automatically:
- ✅ Verify migration completed
- ✅ Seed 350+ flights (next 7 days)
- ✅ Verify flights created
- ✅ Stage all changes
- ✅ Create commit with proper message
- ✅ Push to GitHub
- ✅ Trigger Vercel deployment

---

## 🎯 ALTERNATIVE: Manual Deployment

If you prefer to run each step manually:

```bash
cd /home/bruno/kk

# 1. Check migration (should show table exists)
npx tsx - <<'EOF'
import { createClient } from '@supabase/supabase-js'
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)
const { data, error } = await supabase.from('flights').select('id').limit(1)
console.log(error ? 'Table not found' : 'Table exists!')
EOF

# 2. Seed database
npx tsx seed-flights.ts

# 3. Verify
npx tsx - <<'EOF'
import { createClient } from '@supabase/supabase-js'
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)
const { count } = await supabase.from('flights').select('*', { count: 'exact', head: true })
console.log(`✓ ${count} flights created`)
EOF

# 4. Commit and push
git add .
git commit -m "feat: migrate to database-backed flights with current dates"
git push origin main
```

---

## 📊 What Gets Deployed

### Database Changes:
- ✅ New `flights` table with 17 columns
- ✅ 6 performance indexes
- ✅ 2 helper functions
- ✅ RLS policies
- ✅ 350+ flight records (next 7 days)

### Code Changes:
- ✅ `/api/flights/search` - Now queries database
- ✅ `deals.ts` - Dynamic date generation
- ✅ All dates show current week

### Files Added:
- `supabase-flights-migration.sql` - Schema
- `seed-flights.ts` - Data seeding
- `deploy-flights.sh` - Deployment automation
- Documentation files

---

## 🧪 Post-Deployment Testing

After deployment completes (~2 minutes):

1. **Visit Production**: https://kq-airways.com

2. **Test Deals Section**:
   - Should show: "01 Jul 26 to 08 Jul 26"
   - NOT: "30 Jun 26 to 05 Jul 26"

3. **Test Flight Search**:
   - Search: NBO → MBA
   - Departure: Today (Jul 1, 2026)
   - Should see: 6+ flights
   - Times: 06:30, 09:00, 12:00, 14:30, 17:00, 20:00

4. **Test Other Routes**:
   - NBO → LHR (London): 1 flight
   - NBO → DXB (Dubai): 2-3 flights
   - NBO → JNB (Johannesburg): 2 flights

---

## 🆘 Troubleshooting

### Issue: SQL Migration Failed

**Error**: "function update_updated_at_column does not exist"

**Fix**: Run this first in SQL Editor:
```sql
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
```

Then run the full migration again.

---

### Issue: Seed Script Failed

**Error**: "Missing environment variables"

**Fix**:
```bash
# Check .env.local has all required variables
cat .env.local | grep SUPABASE

# Should show:
# NEXT_PUBLIC_SUPABASE_URL=https://...
# NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
# SUPABASE_SERVICE_ROLE_KEY=eyJ...
```

---

### Issue: No Flights Showing

**Check 1**: Verify flights in database
```bash
# Should return count > 0
npx tsx - <<'EOF'
import { createClient } from '@supabase/supabase-js'
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)
const { count } = await supabase.from('flights').select('*', { count: 'exact', head: true })
console.log(`Flights: ${count}`)
EOF
```

**Check 2**: Test API directly
```bash
curl "https://kq-airways.com/api/flights/search?from=NBO&to=MBA&depart=2026-07-01"
```

---

## 📞 Support

- **Migration Guide**: `FLIGHTS_MIGRATION_GUIDE.md`
- **Quick Start**: `QUICK_START.md`
- **Full Summary**: `IMPLEMENTATION_SUMMARY.md`
- **Supabase Logs**: Check dashboard for errors

---

## ✅ Success Criteria

Deployment is successful when:

- [x] SQL migration completed without errors
- [x] Flights table visible in Supabase Table Editor
- [x] Seed script ran and created 350+ flights
- [x] Code pushed to GitHub
- [x] Vercel deployment succeeded
- [x] kq-airways.com shows current dates
- [x] Flight search returns results
- [x] Deals section updated

---

**Ready to deploy?**

1. Run SQL migration in Supabase Dashboard (Step 1 above)
2. Then run: `./deploy-flights.sh`
3. Wait 2 minutes for Vercel deployment
4. Test on kq-airways.com

🚀 Let's go!
