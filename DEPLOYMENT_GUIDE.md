# Kenya Airways - Deployment Guide

This guide will walk you through deploying your Kenya Airways website to Vercel with Supabase as the database.

## Table of Contents
- [Prerequisites](#prerequisites)
- [Supabase Setup](#supabase-setup)
- [Vercel Deployment](#vercel-deployment)
- [Environment Variables](#environment-variables)
- [Post-Deployment](#post-deployment)
- [Troubleshooting](#troubleshooting)

---

## Prerequisites

Before deploying, ensure you have:
- [x] A GitHub/GitLab/Bitbucket account
- [x] A Vercel account (sign up at https://vercel.com)
- [x] A Supabase account (sign up at https://supabase.com)
- [x] Git installed locally
- [x] Your project committed to a Git repository

---

## Supabase Setup

### 1. Create a Supabase Project

1. Go to https://app.supabase.com
2. Click **"New Project"**
3. Fill in the details:
   - **Name**: `kenya-airways` (or your preferred name)
   - **Database Password**: Create a strong password (save it!)
   - **Region**: Choose closest to your users (e.g., `us-east-1`)
   - **Pricing Plan**: Start with Free tier
4. Click **"Create new project"**
5. Wait 2-3 minutes for setup to complete

### 2. Get Your Supabase Credentials

1. Go to **Settings** → **API** in your Supabase dashboard
2. Copy the following values:
   - **Project URL**: `https://xxxxxxxxxxxxx.supabase.co`
   - **anon/public key**: Long string starting with `eyJ...`
   - **service_role key**: Another long string (keep this secret!)

### 3. Set Up Database Tables (Optional)

If you need database tables for bookings, users, etc.:

```sql
-- Example: Bookings table
CREATE TABLE bookings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  booking_reference VARCHAR(10) UNIQUE NOT NULL,
  passenger_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(50),
  origin VARCHAR(3) NOT NULL,
  destination VARCHAR(3) NOT NULL,
  departure_date DATE NOT NULL,
  return_date DATE,
  cabin_class VARCHAR(20) NOT NULL,
  passengers JSONB NOT NULL,
  total_amount DECIMAL(10, 2) NOT NULL,
  payment_status VARCHAR(20) DEFAULT 'pending',
  booking_status VARCHAR(20) DEFAULT 'confirmed',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Example: Newsletter subscribers
CREATE TABLE newsletter_subscribers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  subscribed_at TIMESTAMP DEFAULT NOW(),
  is_active BOOLEAN DEFAULT true
);

-- Add indexes for better performance
CREATE INDEX idx_bookings_reference ON bookings(booking_reference);
CREATE INDEX idx_bookings_email ON bookings(email);
CREATE INDEX idx_bookings_status ON bookings(booking_status);
```

Run these queries in: **SQL Editor** → **New Query** in Supabase dashboard.

### 4. Enable Row Level Security (RLS)

For security, enable RLS on your tables:

```sql
-- Enable RLS
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;

-- Example policies (adjust as needed)
-- Allow anyone to insert bookings
CREATE POLICY "Anyone can create bookings" ON bookings
  FOR INSERT WITH CHECK (true);

-- Allow users to view their own bookings
CREATE POLICY "Users can view own bookings" ON bookings
  FOR SELECT USING (email = current_setting('request.jwt.claims')::json->>'email');
```

---

## Vercel Deployment

### Option 1: Deploy via Vercel Dashboard (Recommended)

#### Step 1: Push Code to Git Repository

```bash
# Initialize git (if not already done)
git init

# Add all files
git add .

# Commit changes
git commit -m "Initial commit - Kenya Airways website"

# Add remote repository (GitHub example)
git remote add origin https://github.com/YOUR_USERNAME/kenya-airways.git

# Push to main branch
git branch -M main
git push -u origin main
```

#### Step 2: Import to Vercel

1. Go to https://vercel.com/new
2. Click **"Import Git Repository"**
3. Select your repository (GitHub/GitLab/Bitbucket)
4. Configure the project:
   - **Project Name**: `kenya-airways`
   - **Framework Preset**: Next.js (auto-detected)
   - **Root Directory**: `./` (leave as default)
   - **Build Command**: `npm run build` (auto-detected)
   - **Output Directory**: `.next` (auto-detected)

#### Step 3: Add Environment Variables

In the Vercel import screen, click **"Environment Variables"**:

```
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...your_anon_key
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...your_service_role_key
NEXT_PUBLIC_APP_URL=https://your-app.vercel.app
```

5. Click **"Deploy"**
6. Wait 2-3 minutes for build to complete
7. Your site will be live at: `https://your-project.vercel.app`

### Option 2: Deploy via Vercel CLI

```bash
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# Deploy (from project root)
vercel

# Follow prompts:
# - Link to existing project? No
# - Project name: kenya-airways
# - Directory: ./
# - Override settings? No

# Production deployment
vercel --prod
```

---

## Environment Variables

### Required Variables

| Variable | Description | Where to Get |
|----------|-------------|--------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL | Supabase Dashboard → Settings → API |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous key | Supabase Dashboard → Settings → API |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key (server-only) | Supabase Dashboard → Settings → API |
| `NEXT_PUBLIC_APP_URL` | Your production URL | `https://your-app.vercel.app` |

### Adding Environment Variables in Vercel

1. Go to your project in Vercel dashboard
2. Click **Settings** → **Environment Variables**
3. Add each variable:
   - **Key**: Variable name
   - **Value**: Variable value
   - **Environment**: Production, Preview, Development (select all)
4. Click **Save**
5. **Redeploy** your application for changes to take effect

---

## Post-Deployment

### 1. Update Supabase Site URL

1. Go to Supabase Dashboard → **Authentication** → **URL Configuration**
2. Update **Site URL** to: `https://your-app.vercel.app`
3. Add **Redirect URLs**:
   - `https://your-app.vercel.app/**`
   - `http://localhost:3000/**` (for local development)

### 2. Configure Custom Domain (Optional)

1. In Vercel dashboard → **Settings** → **Domains**
2. Click **"Add Domain"**
3. Enter your domain: `www.kenyaairways.com`
4. Follow DNS configuration instructions
5. Update `NEXT_PUBLIC_APP_URL` environment variable to your custom domain

### 3. Enable Analytics (Optional)

1. In Vercel dashboard → **Analytics**
2. Click **"Enable Analytics"**
3. View real-time traffic, performance metrics, and Web Vitals

### 4. Set Up Monitoring

1. **Vercel Monitoring**: Automatically tracks errors and performance
2. **Supabase Monitoring**: Check Database → Logs for query performance

---

## Continuous Deployment

Vercel automatically deploys when you push to your repository:

```bash
# Make changes to your code
git add .
git commit -m "Updated homepage design"
git push origin main

# Vercel automatically:
# 1. Detects the push
# 2. Builds your project
# 3. Deploys to production
# 4. Notifies you via email
```

### Branch Previews

- **main/master branch** → Production deployment
- **Other branches** → Preview deployments with unique URLs
- Each pull request gets its own preview URL

---

## Troubleshooting

### Build Failures

**Error: Module not found**
```bash
# Solution: Ensure all dependencies are in package.json
npm install
git add package.json package-lock.json
git commit -m "Update dependencies"
git push
```

**Error: Environment variables not found**
- Check that all required env vars are added in Vercel dashboard
- Redeploy after adding variables

### Supabase Connection Issues

**Error: Invalid Supabase URL**
- Verify `NEXT_PUBLIC_SUPABASE_URL` is correct
- Ensure it starts with `https://` and ends with `.supabase.co`

**Error: Invalid API key**
- Check you're using the **anon/public** key, not service_role key for client-side
- Regenerate keys in Supabase if compromised

### Performance Issues

**Slow page loads**
- Enable Next.js Image Optimization
- Use Vercel CDN for static assets
- Optimize images (WebP format, proper sizing)

**Database slow queries**
- Add indexes to frequently queried columns
- Use Supabase pooler for connection pooling
- Check Query Performance in Supabase dashboard

---

## Useful Commands

```bash
# Local development
npm run dev

# Build locally (test before deployment)
npm run build
npm run start

# Deploy to Vercel
vercel --prod

# View deployment logs
vercel logs

# Roll back to previous deployment
vercel rollback
```

---

## Security Checklist

- [ ] Environment variables are in `.env.local` (not committed to git)
- [ ] `.env.local` is in `.gitignore`
- [ ] Supabase RLS policies are enabled
- [ ] Service role key is only used server-side
- [ ] HTTPS is enabled (automatic with Vercel)
- [ ] API keys are rotated regularly
- [ ] Database backups are enabled in Supabase

---

## Support Resources

- **Vercel Documentation**: https://vercel.com/docs
- **Supabase Documentation**: https://supabase.com/docs
- **Next.js Documentation**: https://nextjs.org/docs
- **Vercel Support**: support@vercel.com
- **Supabase Support**: https://supabase.com/support

---

## Cost Estimation

### Vercel (Free Tier)
- ✅ Unlimited deployments
- ✅ 100GB bandwidth/month
- ✅ Automatic HTTPS
- ✅ Preview deployments
- 💰 Pro: $20/month (for production apps)

### Supabase (Free Tier)
- ✅ 500MB database storage
- ✅ 2GB bandwidth/month
- ✅ 50,000 monthly active users
- ✅ Unlimited API requests
- 💰 Pro: $25/month (for production apps)

**Estimated Monthly Cost**: 
- Development: $0 (both free tiers)
- Production: $45 (Vercel Pro + Supabase Pro)

---

## Next Steps

1. ✅ Complete Supabase setup
2. ✅ Deploy to Vercel
3. ✅ Configure environment variables
4. ✅ Test production deployment
5. 🔄 Set up custom domain
6. 🔄 Configure email notifications
7. 🔄 Set up payment gateway integration
8. 🔄 Enable analytics and monitoring

---

**Deployment Date**: _________________
**Production URL**: _________________
**Supabase Project**: _________________

---

## Emergency Rollback

If something goes wrong in production:

```bash
# Via Vercel CLI
vercel rollback

# Or via Vercel Dashboard:
# 1. Go to Deployments
# 2. Find last working deployment
# 3. Click "..." → "Promote to Production"
```

---

**Need Help?** Contact your development team or refer to the documentation links above.
