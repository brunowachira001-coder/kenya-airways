# 🚀 Deploy to www.kqairways.com - Final Steps

**Status**: ✅ Code Pushed to GitHub  
**Remaining**: SQL Migration + Database Seeding  
**Time**: 3 minutes  
**Date**: July 1, 2026, 14:01

---

## ✅ What's Already Done

- ✅ Code changes committed
- ✅ Pushed to GitHub: https://github.com/n29965745-max/kenya-airways.git
- ✅ Vercel will auto-deploy (or already deployed)
- ✅ All files ready in `/home/bruno/kk/`

---

## 🎯 What You Need to Do Now (2 Simple Steps)

### STEP 1: Run SQL Migration (2 minutes)

**⚠️ CRITICAL**: This creates the flights table in your database.

1. **Open Supabase Dashboard**:
   ```
   https://supabase.com/dashboard
   ```

2. **Select Your Project**:
   - Project: `Kenya Airways`
   - ID: `zkyyfvoiwwyovutoaznm`

3. **Open SQL Editor**:
   - Click **SQL Editor** in the left sidebar
   - Click **New Query** button

4. **Copy & Paste Migration SQL**:
   
   Open this file and copy ALL content:
   ```bash
   /home/bruno/kk/supabase-flights-migration.sql
   ```
   
   Or display it with:
   ```bash
   cat /home/bruno/kk/supabase-flights-migration.sql
   ```

5. **Run the Migration**:
   - Paste the SQL into the editor
   - Click **Run** (or press Ctrl/Cmd + Enter)
   - Wait 10-15 seconds
   - You should see: **"Flights Table Migration Complete!"**

6. **Verify**:
   - Go to **Table Editor** (left sidebar)
   - You should see a new **`flights`** table
   - Click it - it should be empty (we'll populate it next)

---

### STEP 2: Seed the Database (1 minute)

**After the SQL migration succeeds**, run this command:

```bash
cd /home/bruno/kk
npx tsx seed-flights.ts
```

**What this does**:
- Generates 350+ flights for next 7 days
- Covers 50+ routes (NBO-MBA, NBO-LHR, NBO-DXB, etc.)
- Adds realistic price variations
- Takes about 30-60 seconds

**Expected output**:
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
```

---

## 🎉 Done! Test Your Website

After seeding completes, your website is LIVE with current dates!

### Test Checklist:

1. **Visit**: https://www.kqairways.com

2. **Homepage Deals**:
   - Should show: **"01 Jul 26 to 08 Jul 26"**
   - NOT: "30 Jun 26 to 05 Jul 26"

3. **Flight Search**:
   - Search: **NBO → MBA**
   - Departure: **Today (July 1, 2026)**
   - Should see: **6 flights** (06:30, 09:00, 12:00, 14:30, 17:00, 20:00)

4. **Try Other Routes**:
   - NBO → LHR (London): 1 flight
   - NBO → DXB (Dubai): 2-3 flights
   - NBO → JNB (Johannesburg): 2 flights

5. **Check Deals Page**:
   - Visit: https://www.kqairways.com/deals
   - All deals should show current dates
   - Filter by region should work

---

## 🔄 Keeping Dates Current

Your flights are generated for **7 days from today**. To keep them current:

### Option 1: Manual (Recommended for now)
Run weekly or when needed:
```bash
cd /home/bruno/kk
npx tsx seed-flights.ts
```

### Option 2: Automated (Future setup)
Set up a cron job or Vercel Cron to run daily:
```bash
# Add to vercel.json
{
  "crons": [{
    "path": "/api/cron/seed-flights",
    "schedule": "0 0 * * *"
  }]
}
```

---

## 📊 What You Now Have

### Database:
- ✅ `flights` table with 350+ records
- ✅ Dates: July 1-7, 2026
- ✅ 50+ routes covered
- ✅ Fast indexed queries

### Website:
- ✅ Live at: https://www.kqairways.com
- ✅ All dates current (no hardcoded past dates)
- ✅ Flight search working with real data
- ✅ Deals showing current week

### Routes Covered:
```
Domestic Kenya:
✈️  NBO ↔ MBA (Mombasa) - 6 flights/day
✈️  NBO ↔ KIS (Kisumu) - 2 flights/day

East Africa:
✈️  NBO ↔ DAR (Dar es Salaam) - 3 flights/day
✈️  NBO ↔ ZNZ (Zanzibar) - 2 flights/day
✈️  NBO ↔ EBB (Entebbe) - 2 flights/day
✈️  NBO ↔ ADD (Addis Ababa) - 2 flights/day

Europe:
✈️  NBO ↔ LHR (London)
✈️  NBO ↔ CDG (Paris)
✈️  NBO ↔ AMS (Amsterdam)
✈️  NBO ↔ FRA (Frankfurt)
✈️  NBO ↔ FCO (Rome)

Middle East:
✈️  NBO ↔ DXB (Dubai) - 2-3 flights/day
✈️  NBO ↔ DOH (Doha)
✈️  NBO ↔ AUH (Abu Dhabi)
✈️  NBO ↔ JED (Jeddah)

Africa:
✈️  NBO ↔ JNB (Johannesburg) - 2 flights/day
✈️  NBO ↔ CPT (Cape Town)
✈️  NBO ↔ MRU (Mauritius)
✈️  NBO ↔ LOS (Lagos)

Americas:
✈️  NBO ↔ JFK (New York)
✈️  NBO ↔ YYZ (Toronto)

Asia:
✈️  NBO ↔ BOM (Mumbai)
✈️  NBO ↔ DEL (Delhi)
✈️  NBO ↔ BKK (Bangkok)

... and 30+ more routes!
```

---

## 🆘 Troubleshooting

### Issue: SQL Migration Failed

**Error**: "function update_updated_at_column does not exist"

**Fix**: This function should exist from previous migrations. If not, run this first:
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

**Fix**: Check `.env.local`:
```bash
cat .env.local | grep SUPABASE
```

Should show:
```
NEXT_PUBLIC_SUPABASE_URL=https://zkyyfvoiwwyovutoaznm.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...
```

---

### Issue: Website Not Updated

**Check 1**: Vercel deployment status
- Go to: https://vercel.com/dashboard
- Check deployment logs

**Check 2**: Clear cache
- Hard refresh: Ctrl+Shift+R (Windows) / Cmd+Shift+R (Mac)

**Check 3**: Check if flights exist
```bash
cd /home/bruno/kk
npx tsx - <<'EOF'
import { createClient } from '@supabase/supabase-js'
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)
const { count } = await supabase.from('flights').select('*', { count: 'exact', head: true })
console.log(`Flights in DB: ${count}`)
EOF
```

---

## 📞 Quick Reference Commands

```bash
# Display SQL migration
cat /home/bruno/kk/supabase-flights-migration.sql

# Seed database
cd /home/bruno/kk
npx tsx seed-flights.ts

# Check flight count
cd /home/bruno/kk
npx tsx - <<'EOF'
import { createClient } from '@supabase/supabase-js'
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)
const { count } = await supabase.from('flights').select('*', { count: 'exact', head: true })
console.log(`Total flights: ${count}`)
EOF

# Test API
curl "https://www.kqairways.com/api/flights/search?from=NBO&to=MBA&depart=2026-07-01"
```

---

## 📚 Documentation

- **Complete Guide**: `FLIGHTS_MIGRATION_GUIDE.md`
- **Quick Start**: `QUICK_START.md`
- **Full Summary**: `IMPLEMENTATION_SUMMARY.md`
- **Checklist**: `DEPLOYMENT_CHECKLIST.md`

---

## ✅ Success Checklist

- [ ] SQL migration run in Supabase Dashboard
- [ ] `flights` table visible in Table Editor
- [ ] Seed script executed successfully
- [ ] 350+ flights in database
- [ ] www.kqairways.com showing current dates
- [ ] Flight search returning results
- [ ] Deals section updated

---

## 🎊 You're Almost There!

Just 2 commands away from having a fully functional flight booking system with **always-current dates**!

1. **Copy & run SQL** in Supabase Dashboard
2. **Run**: `npx tsx seed-flights.ts`

Then enjoy your updated www.kqairways.com! 🚀✈️

---

**Questions?** Check the troubleshooting section above or review the documentation files.

**Ready?** Start with STEP 1: SQL Migration! 👆
