# 🚀 Quick Start - Flights Migration

## TL;DR - 3 Steps to Current Dates

```bash
# 1. Run SQL migration in Supabase Dashboard
#    File: supabase-flights-migration.sql

# 2. Seed the database (from project root)
npx tsx seed-flights.ts

# 3. Start your app
npm run dev
```

## ✅ What You Get

- **Current Dates**: All flights show dates from today onwards (no more hardcoded past dates)
- **7-Day Window**: Flights available for the next 7 days
- **Auto-Refresh**: Deals update with current dates automatically
- **Database-Backed**: Fast searches with proper indexing
- **50+ Routes**: All major Kenya Airways routes included

## 📅 Today's Date: July 1, 2026

After migration, your deals will show:
- ✅ "01 Jul 26 to 08 Jul 26" (current week)
- ❌ NOT "30 Jun 26 to 05 Jul 26" (old hardcoded dates)

## 🔄 Keeping Dates Current

Re-run the seed script daily or weekly:
```bash
npx tsx seed-flights.ts
```

This regenerates flights for the next 7 days from whenever you run it.

## 🧪 Quick Test

After setup:
1. Go to http://localhost:3000
2. Search: NBO → MBA, departure: today
3. Expect: 6+ flight results with today's date
4. Check deals section: Should show "01 Jul 26 to..." dates

## 📁 Files Created

| File | Purpose |
|------|---------|
| `supabase-flights-migration.sql` | Database schema |
| `seed-flights.ts` | Data population script |
| `setup-flights.sh` | Automated setup script |
| `FLIGHTS_MIGRATION_GUIDE.md` | Full documentation |
| `QUICK_START.md` | This file |

## 🆘 Troubleshooting

**Problem**: "No flights found"
**Solution**: Run `npx tsx seed-flights.ts`

**Problem**: "tsx not found"
**Solution**: `npm install -g tsx`

**Problem**: "Missing environment variables"
**Solution**: Check `.env.local` has Supabase keys

**Problem**: "Dates still showing old dates"
**Solution**: Hard refresh browser (Ctrl+Shift+R)

## 📚 Need More Info?

See `FLIGHTS_MIGRATION_GUIDE.md` for complete documentation.

---

**Status**: Ready for deployment ✅
**Last Updated**: July 1, 2026
