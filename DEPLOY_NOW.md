# 🚀 DEPLOY NOW - Quick Instructions

**Date**: July 1, 2026, 13:27  
**Action Required**: Run SQL migration, then automatic deployment

---

## ⚡ Step 1: Run SQL Migration (2 minutes)

You need to run the SQL migration in Supabase Dashboard **ONCE**:

### Option A: Via Supabase Dashboard (Recommended)
1. Open https://supabase.com/dashboard
2. Select your project: `zkyyfvoiwwyovutoaznm`
3. Go to **SQL Editor** (left sidebar)
4. Click **New Query**
5. Copy the entire content of: `supabase-flights-migration.sql`
6. Paste into the editor
7. Click **Run** (or press `Ctrl/Cmd + Enter`)
8. Wait for success message: "Flights Table Migration Complete!"

### Option B: Via Supabase CLI (If installed)
```bash
cd /home/bruno/kk
supabase db push --file supabase-flights-migration.sql
```

---

## ⚡ Step 2: Automated Deployment (Runs automatically)

After SQL migration, the deployment script will:
- ✅ Seed database with 350+ flights (next 7 days)
- ✅ Verify flights data
- ✅ Stage all changes
- ✅ Commit changes
- ✅ Push to GitHub
- ✅ Auto-deploy to kqairways.com (via Vercel)

---

## 🔄 Manual Deployment (If needed)

If you prefer to run manually:

```bash
cd /home/bruno/kk

# 1. Seed database
npx tsx seed-flights.ts

# 2. Commit changes
git add .
git commit -m "feat: migrate to database-backed flights with current dates

- Add flights table schema with proper indexing
- Implement seed script for 350+ flights across 50+ routes
- Update flight search API to query Supabase
- All dates now show current week (01 Jul 26 onwards)
- Add comprehensive documentation and setup scripts"

# 3. Push to deploy
git push origin main
```

---

## ✅ Success Indicators

After deployment:
1. Visit https://kqairways.com
2. Check deals section: Should show "01 Jul 26 to 08 Jul 26"
3. Search flights: NBO → MBA, today's date
4. Should see 6+ flight results

---

## 📞 If Something Goes Wrong

**SQL Migration Failed**:
- Check Supabase logs
- Ensure `update_updated_at_column()` function exists (from previous migration)
- Try running each section separately

**Seed Failed**:
- Check environment variables in `.env.local`
- Verify Supabase connection
- Run: `npx tsx seed-flights.ts` manually

**Deployment Failed**:
- Check git remote: `git remote -v`
- Ensure you have push access
- Check Vercel deployment logs

---

**Ready?** Run the SQL migration above, then the deployment will proceed automatically!
