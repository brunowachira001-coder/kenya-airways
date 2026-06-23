# 📋 Mobile Payment Setup Checklist

Use this checklist to track your progress in setting up mobile payments that go directly to your bank account.

---

## ✅ Pre-Setup (Completed)

- [x] Payment integration code implemented
- [x] M-Pesa API routes created
- [x] Mobile payment page updated
- [x] Environment variables configured
- [x] Documentation created

---

## 🏁 Quick Start (Do This First)

### Testing Phase (Can Do Today - 30 minutes)

- [ ] **Register on Daraja Portal**
  - Go to: https://developer.safaricom.co.ke
  - Sign up for account
  - Verify email
  - Login to dashboard

- [ ] **Create Test App**
  - Click "My Apps"
  - Create new app: "Kenya Airways Test"
  - Select: "Lipa Na M-Pesa Online"
  - Save Consumer Key & Secret

- [ ] **Configure Test Environment**
  - Copy `.env.example` to `.env.local`
  - Add test credentials:
    ```env
    MPESA_CONSUMER_KEY=[paste your key]
    MPESA_CONSUMER_SECRET=[paste your secret]
    MPESA_SHORTCODE=174379
    MPESA_PASSKEY=bfb279f9aa9bdbcf158e97dd71a467cd2e0c893059b10f78e6b72ada1ed2c919
    NEXT_PUBLIC_APP_URL=http://localhost:3000
    ```

- [ ] **Test Payment**
  - Run: `npm run dev`
  - Go to: http://localhost:3000/booking/payment/mobile
  - Phone: 708374149
  - Click: "Pay with M-Pesa"
  - Verify: Payment prompt works

**🎉 If test works, you're 30% done!**

---

## 🏦 Production Setup (1-3 Weeks)

### Step 1: Get M-Pesa Paybill (Week 1)

- [ ] **Gather Required Documents**
  - [ ] Business registration certificate
  - [ ] KRA PIN certificate
  - [ ] ID/Passport (certified copy)
  - [ ] Bank account statement (last 3 months)
  - [ ] Signed Paybill application form

- [ ] **Visit Safaricom**
  - [ ] Book appointment (optional but recommended)
  - [ ] Go to Safaricom shop with documents
  - [ ] Request M-Pesa Paybill for business
  - [ ] Pay setup fee (~KES 5,000)
  - [ ] Get application receipt

- [ ] **Wait for Approval**
  - Processing time: 5-10 business days
  - Follow up: Call 0722000000
  - Check status: Via M-Pesa Business portal

### Step 2: Link Bank Account (Week 2)

- [ ] **After Paybill Approval**
  - [ ] Receive Paybill number via SMS
  - [ ] Receive activation instructions
  - [ ] Note down Paybill number

- [ ] **Link Your Bank**
  - [ ] Visit Safaricom shop again
  - [ ] Bring: Bank account details + Paybill docs
  - [ ] Request: Bank account linkage
  - [ ] Choose: Settlement frequency (daily/weekly)
  - [ ] Get: Confirmation letter

- [ ] **Verify Settlement**
  - [ ] Make test deposit to Paybill
  - [ ] Wait for settlement period
  - [ ] Check bank account
  - [ ] Confirm money received

### Step 3: Production API Setup (Week 2-3)

- [ ] **Create Production App on Daraja**
  - [ ] Login to Daraja portal
  - [ ] Create new production app
  - [ ] Use REAL Paybill number
  - [ ] Get production credentials

- [ ] **Request Go-Live**
  - [ ] Submit go-live request on portal
  - [ ] Wait for Safaricom review (2-5 days)
  - [ ] Respond to any queries
  - [ ] Get approval notification

- [ ] **Update Production Credentials**
  - [ ] Copy production keys to safe place
  - [ ] Update Vercel environment variables:
    ```env
    MPESA_CONSUMER_KEY=[production key]
    MPESA_CONSUMER_SECRET=[production secret]
    MPESA_SHORTCODE=[your real paybill]
    MPESA_PASSKEY=[production passkey]
    NEXT_PUBLIC_APP_URL=https://your-domain.com
    ```

### Step 4: Deploy to Production (Week 3)

- [ ] **Update Code for Production**
  - [ ] Change API URLs in `src/app/api/payment/mpesa/route.ts`:
    - From: `sandbox.safaricom.co.ke`
    - To: `api.safaricom.co.ke`
  - [ ] Commit changes
  - [ ] Push to GitHub

- [ ] **Deploy to Vercel**
  - [ ] Login to Vercel
  - [ ] Add production environment variables
  - [ ] Deploy: `vercel --prod`
  - [ ] Verify deployment success

- [ ] **Test with Real Money**
  - [ ] Use small amount (KES 10-50)
  - [ ] Complete full payment flow
  - [ ] Check callback received
  - [ ] Verify money in bank account

---

## 🔧 Alternative: Faster Setup with Payment Gateway

If you need to go live faster (2-3 days instead of 2-3 weeks):

### Option A: Tingg/iPay

- [ ] **Register**: https://tingg.africa
- [ ] **Submit Documents** (same as above)
- [ ] **Get API Credentials** (1-2 days)
- [ ] **Add to .env.local**:
  ```env
  TINGG_VENDOR_ID=[your vendor id]
  TINGG_VENDOR_KEY=[your api key]
  ```
- [ ] **Test Integration**
- [ ] **Go Live**

**Settlement**: 2-3 business days to your bank

### Option B: Pesapal

- [ ] **Register**: https://pesapal.com
- [ ] **Verify Business** (2-3 days)
- [ ] **Get API Keys**
- [ ] **Integrate** (SDK available)
- [ ] **Test & Deploy**

**Settlement**: 2-3 business days to your bank

---

## 🧪 Testing Checklist

Before going live, test these scenarios:

### Sandbox Testing
- [ ] Successful payment (254708374149)
- [ ] Failed payment (254708374148)
- [ ] Timeout (254708374147)
- [ ] User cancelled (254708374146)
- [ ] Invalid phone number
- [ ] Invalid amount

### Production Testing
- [ ] Small amount payment (KES 10)
- [ ] Standard booking amount
- [ ] Multiple passengers
- [ ] Callback URL works
- [ ] Email confirmation (when implemented)
- [ ] Database update (when implemented)

---

## 💰 Cost Summary

### M-Pesa Direct
- **Setup**: KES 5,000 (one-time)
- **Monthly**: KES 2,000 (maintenance)
- **Per Transaction**: 0.5% - 1.5% (negotiable)
- **Total Year 1**: ~KES 29,000 + transaction fees

### Payment Gateway (Tingg/Pesapal)
- **Setup**: Free
- **Monthly**: Free
- **Per Transaction**: ~3.5%
- **Total Year 1**: Transaction fees only

**Example**: For KES 10,000,000 in bookings/year
- M-Pesa Direct: ~KES 179,000 (1.5%)
- Payment Gateway: ~KES 350,000 (3.5%)
- **Savings with M-Pesa Direct**: ~KES 171,000/year

---

## 📞 Support Contact Numbers

### During Setup
- **M-Pesa Business**: 0722000000
- **Safaricom Shop**: Find nearest: saf.com/shops
- **Email**: mpesabusiness@safaricom.co.ke

### Technical Issues
- **Daraja API Support**: apisupport@safaricom.co.ke
- **Portal Issues**: https://developer.safaricom.co.ke/support
- **Payment Gateway**: See respective provider websites

---

## 🚨 Common Issues & Solutions

### "Can't get Paybill"
- **Solution**: Apply as sole proprietor if no business cert
- **Alternative**: Use Tingg/Pesapal instead

### "Bank won't link to Paybill"
- **Solution**: Some banks need manager approval
- **Try**: KCB, Equity, Coop Bank (easier process)

### "Go-live taking too long"
- **Solution**: Call apisupport@safaricom.co.ke
- **Escalate**: Tweet @Safaricom_Care

### "Don't have business cert"
- **Option 1**: Register business (~2 weeks, KES 3,000)
- **Option 2**: Use personal Paybill (higher fees)
- **Option 3**: Use payment gateway (no business cert needed)

---

## ✅ Final Pre-Launch Checklist

Before accepting real customer payments:

- [ ] Production API tested successfully
- [ ] Bank account receiving settlements
- [ ] Customer confirmation emails working
- [ ] Booking database updating correctly
- [ ] Support team ready for payment queries
- [ ] Refund process documented
- [ ] Transaction monitoring in place
- [ ] Security audit completed
- [ ] Legal terms updated (payment terms)
- [ ] Customer service trained

---

## 🎯 Success Criteria

You're ready to launch when:

✅ Test payment works end-to-end
✅ Real payment (small amount) succeeds
✅ Money appears in your bank account
✅ Customer receives confirmation
✅ Booking appears in system
✅ Support team is ready

---

## 📊 Progress Tracker

- [ ] Testing setup (30 min)
- [ ] Applied for Paybill (1 day)
- [ ] Paybill approved (1-2 weeks)
- [ ] Bank linked (1 day)
- [ ] Production credentials received (1 week)
- [ ] Deployed to production (1 day)
- [ ] Real transaction tested (1 hour)
- [ ] **LIVE! 🚀**

---

**Current Status**: Testing Phase ✅

**Next Action**: Register on Daraja Portal

**Estimated Time to Production**: 2-3 weeks (M-Pesa) OR 2-3 days (Payment Gateway)

---

**Need Help?** Check `PAYMENT_QUICK_START.md` or `MPESA_SETUP_GUIDE.md`
