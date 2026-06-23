# 🚀 Quick Mobile Payment Setup - Kenya Airways

## Fastest Way to Start Receiving Payments

### Option 1: M-Pesa Direct (Recommended)

**Timeframe**: 2-3 weeks for full setup

#### Immediate Testing (Today)
1. Copy `.env.example` to `.env.local`
2. Add sandbox credentials:
```env
MPESA_CONSUMER_KEY=your_key_from_daraja
MPESA_CONSUMER_SECRET=your_secret_from_daraja
MPESA_SHORTCODE=174379
MPESA_PASSKEY=bfb279f9aa9bdbcf158e97dd71a467cd2e0c893059b10f78e6b72ada1ed2c919
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

3. Test now:
```bash
npm run dev
# Go to: http://localhost:3000/booking/payment/mobile
# Enter: 708374149
# Click: Pay with M-Pesa
```

#### Production Setup
1. **Get Paybill**: Visit Safaricom shop (~1 week)
2. **Register Daraja**: https://developer.safaricom.co.ke (1 day)
3. **Link Bank**: Visit Safaricom (1 day)
4. **Go Live**: Submit on Daraja (3-5 days)

**Your bank receives**: Funds automatically deposited daily/weekly

---

### Option 2: Tingg/iPay (Easier, Faster)

**Timeframe**: 1-2 days

1. **Sign up**: https://tingg.africa
2. **Submit**: Business documents
3. **Receive**: API credentials (1-2 days)
4. **Add to .env.local**:
```env
TINGG_VENDOR_ID=your_vendor_id
TINGG_VENDOR_KEY=your_api_key
```

**Benefits**:
- M-Pesa, Airtel Money, Visa, Mastercard all in one
- Faster approval
- Settlement to your bank: 2-3 business days

**Fees**: ~3.5% per transaction

---

### Option 3: Pesapal (Most Popular)

**Timeframe**: 2-3 days

1. **Sign up**: https://pesapal.com
2. **Verify**: Business documents
3. **Get**: API keys (2 days)
4. **Integrate**: Use their ready SDK

**Benefits**:
- Trusted by major companies
- M-Pesa, Cards, Airtel Money
- Good documentation

**Fees**: ~3.5% per transaction

---

## Which Should You Choose?

| Option | Setup Time | Fees | Bank Settlement | Best For |
|--------|-----------|------|-----------------|----------|
| **M-Pesa Direct** | 2-3 weeks | Lower (0.5-1%) | Daily | High volume |
| **Tingg** | 1-2 days | ~3.5% | 2-3 days | Quick start |
| **Pesapal** | 2-3 days | ~3.5% | 2-3 days | Reliability |

---

## Your Bank Account Setup

### To Receive Payments:

#### For M-Pesa Direct:
1. You need a business Paybill number
2. Link your bank account to the Paybill at any Safaricom shop
3. Choose settlement frequency (daily/weekly)
4. Money flows: **Customer → M-Pesa → Your Bank (Auto)**

#### For Tingg/Pesapal:
1. Provide your bank details during registration:
   - Bank name
   - Account number
   - Account name
   - Branch
2. Money flows: **Customer → Gateway → Your Bank (2-3 days)**

---

## Quick Start Checklist

### Today (Testing):
- [ ] Register on Daraja API portal
- [ ] Get sandbox credentials
- [ ] Add to `.env.local`
- [ ] Test payment with `254708374149`

### This Week (Production):
- [ ] Choose payment provider (M-Pesa/Tingg/Pesapal)
- [ ] Submit application
- [ ] Prepare documents (business cert, KRA, bank details)
- [ ] Set up bank account linking

### Next Week (Go Live):
- [ ] Receive production credentials
- [ ] Update `.env.local` with live credentials
- [ ] Test with real money (small amount)
- [ ] Deploy to production
- [ ] Accept real bookings! 🎉

---

## Required Documents

For any provider, you'll need:
1. ✅ Business registration certificate
2. ✅ KRA PIN certificate
3. ✅ ID/Passport copy
4. ✅ Bank account details (statement or letter)
5. ✅ Signed application form

---

## Test Right Now (5 minutes)

1. **Clone this repo** (if you haven't)
2. **Install dependencies**: `npm install`
3. **Copy env file**: `cp .env.example .env.local`
4. **Start server**: `npm run dev`
5. **Test payment**: Navigate to booking flow → payment → mobile

Use test number: `254708374149` (won't charge real money)

---

## Need Help?

**M-Pesa Issues**:
- Call: 0722000000
- Email: mpesabusiness@safaricom.co.ke

**Tingg Support**:
- Email: support@tingg.africa
- Phone: +254 709 899 000

**Pesapal Support**:
- Email: support@pesapal.com
- Phone: +254 709 882 000

---

## What Happens Next?

1. **Customer selects "Mobile Payment"**
2. **Enters phone number**
3. **Clicks "Pay with M-Pesa"**
4. **Receives prompt on phone** 📱
5. **Enters M-Pesa PIN**
6. **Payment confirmed** ✅
7. **Money goes to YOUR BANK** 🏦
8. **Customer gets ticket** 🎫

---

**Ready to start?** See `MPESA_SETUP_GUIDE.md` for detailed instructions!
