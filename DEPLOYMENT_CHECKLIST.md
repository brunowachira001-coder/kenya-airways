# 🚀 Kenya Airways - Deployment Checklist

Use this checklist to ensure a smooth deployment to Vercel and Supabase.

## Pre-Deployment Checks

### Code Quality
- [ ] All TypeScript errors resolved (`npm run build` succeeds)
- [ ] No console errors in browser
- [ ] All components render correctly
- [ ] Mobile responsive design tested
- [ ] All links working
- [ ] Images loading properly
- [ ] Forms validation working

### Git Repository
- [ ] All changes committed to git
- [ ] `.gitignore` includes sensitive files
- [ ] Repository pushed to GitHub/GitLab/Bitbucket
- [ ] No sensitive data in repository (API keys, passwords)
- [ ] `.env.local` files NOT committed

### Environment Variables
- [ ] `.env.example` file created with all required variables
- [ ] Local environment variables in `.env.local`
- [ ] Production environment variables documented

---

## Supabase Setup

### Account & Project
- [ ] Supabase account created (https://supabase.com)
- [ ] New project created
- [ ] Project region selected (closest to users)
- [ ] Database password saved securely

### Database Configuration
- [ ] SQL setup script (`supabase-setup.sql`) executed
- [ ] All tables created successfully
- [ ] Indexes created for performance
- [ ] Row Level Security (RLS) enabled
- [ ] RLS policies configured and tested

### API Configuration
- [ ] Project URL copied from Settings → API
- [ ] `anon/public` key copied
- [ ] `service_role` key copied (keep secret!)
- [ ] Site URL configured in Authentication → URL Configuration
- [ ] Redirect URLs added for production and localhost

### Testing
- [ ] Test database connection from local environment
- [ ] Test INSERT queries
- [ ] Test SELECT queries with RLS policies
- [ ] Test UPDATE/DELETE operations
- [ ] Verify data appears in Table Editor

---

## Vercel Deployment

### Account Setup
- [ ] Vercel account created (https://vercel.com)
- [ ] Git provider connected (GitHub/GitLab/Bitbucket)
- [ ] Repository access granted to Vercel

### Project Import
- [ ] Repository imported to Vercel
- [ ] Project name set: `kenya-airways`
- [ ] Framework preset: Next.js (auto-detected)
- [ ] Build settings verified:
  - Build Command: `npm run build`
  - Output Directory: `.next`
  - Install Command: `npm install`

### Environment Variables (Vercel)
Add these in Vercel Dashboard → Settings → Environment Variables:

- [ ] `NEXT_PUBLIC_SUPABASE_URL` = Your Supabase project URL
- [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY` = Your Supabase anon key
- [ ] `SUPABASE_SERVICE_ROLE_KEY` = Your Supabase service role key
- [ ] `NEXT_PUBLIC_APP_URL` = Your Vercel deployment URL

**Important**: Select all environments (Production, Preview, Development)

### First Deployment
- [ ] Initial deployment triggered
- [ ] Build completed successfully (check logs)
- [ ] Deployment URL received
- [ ] Site accessible at deployment URL

---

## Post-Deployment Verification

### Functionality Testing
- [ ] Homepage loads correctly
- [ ] All navigation links work
- [ ] Booking widget functional
- [ ] Flight search working
- [ ] Passenger form validation working
- [ ] Payment page displays correctly
- [ ] Newsletter subscription working
- [ ] Footer links functional
- [ ] Mobile menu working

### Performance Testing
- [ ] Page load speed acceptable (< 3 seconds)
- [ ] Images optimized and loading
- [ ] No console errors in production
- [ ] Lighthouse score > 80 (run in DevTools)

### Database Testing
- [ ] Bookings save to Supabase
- [ ] Newsletter subscriptions save
- [ ] Data retrieved correctly
- [ ] No RLS policy errors

### Cross-Browser Testing
- [ ] Chrome/Edge (Chromium)
- [ ] Firefox
- [ ] Safari (if available)
- [ ] Mobile browsers (iOS Safari, Chrome Mobile)

### Mobile Testing
- [ ] Responsive design on 375px (iPhone SE)
- [ ] Responsive design on 414px (iPhone Pro Max)
- [ ] Responsive design on 768px (iPad)
- [ ] Touch interactions working
- [ ] Forms usable on mobile

---

## Domain Configuration (Optional)

### Custom Domain Setup
- [ ] Domain purchased (e.g., kenyaairways.com)
- [ ] Domain added in Vercel Dashboard
- [ ] DNS records configured:
  - A record: 76.76.21.21
  - CNAME record: cname.vercel-dns.com
- [ ] SSL certificate issued (automatic via Vercel)
- [ ] Domain verified and active

### DNS Propagation
- [ ] Wait 24-48 hours for full propagation
- [ ] Test domain from different locations
- [ ] Update environment variables with production domain

---

## Security Configuration

### SSL/HTTPS
- [ ] HTTPS enabled (automatic with Vercel)
- [ ] Mixed content warnings resolved
- [ ] All external resources loaded via HTTPS

### API Security
- [ ] Service role key only used server-side
- [ ] Anon key used for client-side operations
- [ ] No API keys exposed in client code
- [ ] Environment variables properly secured

### Database Security
- [ ] RLS policies tested and verified
- [ ] No public access to sensitive tables
- [ ] Database credentials secured
- [ ] Regular backups enabled in Supabase

---

## Monitoring & Analytics

### Vercel Analytics
- [ ] Vercel Analytics enabled
- [ ] Real-time visitor tracking configured
- [ ] Web Vitals monitoring active

### Supabase Monitoring
- [ ] Database logs enabled
- [ ] Query performance monitored
- [ ] Storage usage tracked

### Error Tracking
- [ ] Production errors monitored
- [ ] Build failure notifications enabled
- [ ] Email alerts configured

---

## Documentation

### Internal Documentation
- [ ] Deployment guide reviewed
- [ ] Environment variables documented
- [ ] Database schema documented
- [ ] API endpoints documented

### Team Access
- [ ] Vercel project shared with team
- [ ] Supabase project shared with team
- [ ] GitHub repository access granted
- [ ] Credentials shared securely (use 1Password/LastPass)

---

## Continuous Deployment

### Git Workflow
- [ ] Main branch configured for production
- [ ] Preview deployments for feature branches
- [ ] Pull request previews enabled

### Deployment Process
- [ ] Code changes trigger automatic deployment
- [ ] Build notifications configured
- [ ] Rollback procedure documented

---

## Final Checks

### Production URL
Production URL: `https://________________________.vercel.app`

### Access Credentials
- Vercel Dashboard: https://vercel.com/dashboard
- Supabase Dashboard: https://app.supabase.com
- GitHub Repository: https://github.com/_______________

### Team Contacts
- Project Manager: ___________________________
- Lead Developer: ___________________________
- DevOps: ___________________________

### Support
- Vercel Support: support@vercel.com
- Supabase Support: https://supabase.com/support

---

## Rollback Plan

If deployment fails or critical issues occur:

1. **Immediate Rollback**:
   - Vercel Dashboard → Deployments → Previous deployment → Promote to Production
   - OR: `vercel rollback` via CLI

2. **Database Rollback**:
   - Supabase Dashboard → Database → Backups → Restore

3. **Emergency Contacts**:
   - Technical Lead: ___________________________
   - Project Manager: ___________________________

---

## Post-Launch Tasks

### Week 1
- [ ] Monitor error rates daily
- [ ] Check performance metrics
- [ ] Gather user feedback
- [ ] Fix critical bugs

### Week 2-4
- [ ] Optimize database queries
- [ ] Improve page load times
- [ ] Add missing features
- [ ] Update documentation

### Ongoing
- [ ] Weekly performance reviews
- [ ] Monthly security audits
- [ ] Regular dependency updates
- [ ] User analytics analysis

---

## Sign-Off

**Deployed By**: _______________________  
**Date**: _______________________  
**Time**: _______________________  
**Status**: ⬜ Success ⬜ Failed ⬜ Partial  

**Notes**:
_____________________________________________________________
_____________________________________________________________
_____________________________________________________________

---

## Emergency Contacts

| Role | Name | Contact |
|------|------|---------|
| Technical Lead | _________ | _________ |
| Project Manager | _________ | _________ |
| DevOps Engineer | _________ | _________ |
| Client Contact | _________ | _________ |

---

**Last Updated**: June 22, 2026  
**Version**: 1.0
