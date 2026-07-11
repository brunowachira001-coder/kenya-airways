# Run SQL Migration - Final Step

The flights table needs to be created. Here are ALL the ways to do it:

## Option 1: Supabase Dashboard (EASIEST - 2 minutes)

1. Open: https://supabase.com/dashboard/project/zkyyfvoiwwyovutoaznm
2. Click: SQL Editor (left sidebar)
3. Click: New Query
4. Run this to get SQL:
   ```bash
   cat /home/bruno/kk/supabase-flights-migration.sql
   ```
5. Copy ALL output
6. Paste into SQL Editor
7. Click "Run" button
8. Wait for success message

## Option 2: Using psql (if you have database password)

```bash
# You need the actual postgres password (not the service role key)
# Get it from: Supabase Dashboard → Settings → Database → Connection string

PGPASSWORD='your_db_password' psql \
  -h db.zkyyfvoiwwyovutoaznm.supabase.co \
  -p 5432 \
  -U postgres \
  -d postgres \
  -f /home/bruno/kk/supabase-flights-migration.sql
```

## After SQL Migration Runs Successfully:

```bash
cd /home/bruno/kk
./complete-deployment.sh
```

This will:
- Seed 350+ flights with today's dates
- Verify deployment
- Show you the results

## Then Test:

Visit: https://www.kqairways.com
- Homepage deals should show: "01 Jul 26 to 08 Jul 26"
- Search NBO → MBA should show 6+ flights
- All routes should have flights available

