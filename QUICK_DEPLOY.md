# 🚀 Quick Deploy Guide - Kenya Airways

Follow these steps to deploy in under 30 minutes.

---

## Step 1: Prepare Your Repository (5 minutes)

```bash
# 1. Ensure all changes are committed
git add .
git commit -m "Ready for deployment"

# 2. Create a GitHub repository (if not already done)
# Go to: https://github.com/new
# Name: kenya-airways
# Make it Private (recommended)

# 3. Push your code
git remote add origin https://github.com/YOUR_USERNAME/kenya-airways.git
git branch -M main
git push -u origin main
```

---

## Step 2: Set Up Supabase (10 minutes)

### Create Project
1. Go to: https://app.supabase.com
2. Click **"New Project"**
3. Enter:
   - Name: `kenya-airways`
   - Database Password: (create a strong one - save it!)
   - Region: `US East (North Virginia)` or closest to your users
4. Click **"Create new project"** → Wait 2 minutes

### Run Database Setup
1. Go to **SQL Editor** in Supabase dashboard
2. Click **"New Query"**
3. Open the file `supabase-setup.sql` from your project
4. Copy and paste the entire SQL content
5. Click **"Run"** → Wait 30 seconds
6. Verify success message appears

### Get API Credentials
1. Go to **Settings** → **API**
2. Copy these values (you'll need them in Vercel):
   - **Project URL**: `https://xxxxx.supabase.co`
   - **anon public key**: `eyJhbGc...` (long string)
   - **service_role key**: `eyJhbGc...` (another long string - keep secret!)

---

## Step 3: Deploy to Vercel (10 minutes)

### Import Project
1. Go to: https://vercel.com/new
2. Click **"Import Git Repository"**
3. Select your `kenya-airways` repository
4. Click **"Import"**

### Configure Project
Project settings (should auto-detect):
- **Framework**: Next.js ✅
- **Root Directory**: `./` ✅
- **Build Command**: `npm run build` ✅
- **Output Directory**: `.next` ✅

### Add Environment Variables
In the "Environment Variables" section, add these 4 variables:

```bash
# 1. Supabase URL
NEXT_PUBLIC_SUPABASE_URL
Value: https://xxxxx.supabase.co

# 2. Supabase Anon Key
NEXT_PUBLIC_SUPABASE_ANON_KEY
Value: eyJhbGc... (your anon key)

# 3. Supabase Service Role Key
SUPABASE_SERVICE_ROLE_KEY
Value: eyJhbGc... (your service role key)

# 4. App URL (use Vercel's provided URL for now)
NEXT_PUBLIC_APP_URL
Value: https://kenya-airways.vercel.app
```

**Important**: For each variable, select all 3 environments:
- ✅ Production
- ✅ Preview
- ✅ Development

### Deploy!
1. Click **"Deploy"**
2. Wait 2-3 minutes
3. 🎉 Your site is live!

---

## Step 4: Verify Deployment (5 minutes)

### Test Your Live Site

1. **Visit your deployment URL**: `https://kenya-airways-xxxxx.vercel.app`

2. **Test these features**:
   - [ ] Homepage loads ✅
   - [ ] Click "Book a Flight" ✅
   - [ ] Search for flights ✅
   - [ ] Test booking form ✅
   - [ ] Subscribe to newsletter ✅

3. **Check Database**:
   - Go to Supabase Dashboard → **Table Editor**
   - Check if newsletter subscriptions appear
   - Check if bookings are saved (if you completed a test booking)

---

## Step 5: Configure Production Settings (5 minutes)

### Update Supabase URLs
1. Go to Supabase Dashboard → **Authentication** → **URL Configuration**
2. Add these URLs:
   - **Site URL**: `https://kenya-airways-xxxxx.vercel.app`
   - **Redirect URLs**: 
     - `https://kenya-airways-xxxxx.vercel.app/**`
     - `http://localhost:3000/**`

### Enable Vercel Analytics (Optional)
1. Go to Vercel Dashboard → Your Project → **Analytics**
2. Click **"Enable Analytics"**
3. View real-time traffic and performance

---

## 🎉 You're Live!

Your Kenya Airways website is now deployed!

**Production URL**: `https://kenya-airways-xxxxx.vercel.app`

---

## Next Steps

### Custom Domain (Optional)
1. Buy a domain (e.g., from Namecheap, GoDaddy)
2. In Vercel Dashboard → **Settings** → **Domains**
3. Click **"Add Domain"**
4. Enter your domain: `kenyaairways.com`
5. Follow DNS configuration instructions
6. Wait 24-48 hours for DNS propagation

### Automatic Deployments
Every time you push to GitHub, Vercel will automatically:
1. Build your project
2. Run tests
3. Deploy to production
4. Send you an email notification

```bash
# Make changes
git add .
git commit -m "Updated homepage"
git push

# Vercel automatically deploys!
# Visit: https://vercel.com/dashboard to see progress
```

---

## Troubleshooting

### Build Failed
**Error**: "Module not found"
```bash
# Solution: Install missing packages
npm install
git add package.json package-lock.json
git commit -m "Update dependencies"
git push
```

### Environment Variables Not Working
1. Go to Vercel Dashboard → **Settings** → **Environment Variables**
2. Verify all 4 variables are added
3. Click **"Redeploy"** at the top

### Database Connection Failed
1. Check Supabase project is "Active" (not Paused)
2. Verify `NEXT_PUBLIC_SUPABASE_URL` is correct
3. Verify `NEXT_PUBLIC_SUPABASE_ANON_KEY` is correct
4. Check Supabase Dashboard → **API** for correct values

---

## Commands Cheat Sheet

```bash
# Deploy from CLI (optional)
npm install -g vercel
vercel login
vercel --prod

# View logs
vercel logs

# Rollback deployment
vercel rollback

# Local development
npm run dev

# Test build locally
npm run build
npm run start
```

---

## Support

- **Vercel Documentation**: https://vercel.com/docs
- **Supabase Documentation**: https://supabase.com/docs
- **Next.js Documentation**: https://nextjs.org/docs

---

## Summary Checklist

- [ ] Code pushed to GitHub
- [ ] Supabase project created
- [ ] Database setup complete
- [ ] Vercel project imported
- [ ] Environment variables added
- [ ] Deployment successful
- [ ] Site tested and working
- [ ] Production URLs configured
- [ ] Analytics enabled

**Deployment Time**: ~30 minutes  
**Status**: ⬜ Complete ⬜ In Progress ⬜ Issues

---

**Deployed By**: _______________  
**Date**: _______________  
**Production URL**: _______________

---

**Need help?** Review the detailed `DEPLOYMENT_GUIDE.md` or contact support.
