# M-Pesa Mobile Payment Integration Guide

## Overview
This guide will help you set up M-Pesa Lipa Na M-Pesa Online (STK Push) to receive payments directly to your bank account through your Kenya Airways booking system.

---

## Prerequisites

1. **Safaricom M-Pesa Account**: You need a Paybill number
2. **Bank Account**: Must be linked to your Paybill
3. **Developer Account**: Register at https://developer.safaricom.co.ke

---

## Step 1: Get M-Pesa Paybill Number

### Option A: Business Paybill (Recommended for Production)
1. Visit any Safaricom shop or agent
2. Request for M-Pesa Paybill registration
3. Required documents:
   - Business registration certificate
   - KRA PIN certificate
   - ID/Passport
   - Bank account details
4. Processing time: 1-2 weeks
5. Cost: ~KES 5,000 setup fee

### Option B: Testing with Sandbox (For Development)
1. No Paybill needed for testing
2. Use Safaricom's test credentials
3. Free for development

---

## Step 2: Register on Daraja API Portal

1. **Go to**: https://developer.safaricom.co.ke
2. **Sign Up**: Create an account
3. **Login** and go to "My Apps"
4. **Create New App**:
   - App Name: `Kenya Airways Payments`
   - Select: `Lipa Na M-Pesa Online`
   - Click: Create App

5. **Get Credentials**:
   - Consumer Key
   - Consumer Secret
   - These will be used in your `.env.local`

---

## Step 3: Configure Your Application

### 3.1 Update Environment Variables

Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```

Edit `.env.local` and add your credentials:

```env
# For Testing (Sandbox)
MPESA_CONSUMER_KEY=your_sandbox_consumer_key
MPESA_CONSUMER_SECRET=your_sandbox_consumer_secret
MPESA_SHORTCODE=174379  # Sandbox test shortcode
MPESA_PASSKEY=bfb279f9aa9bdbcf158e97dd71a467cd2e0c893059b10f78e6b72ada1ed2c919
NEXT_PUBLIC_APP_URL=http://localhost:3000

# For Production (Live)
# MPESA_CONSUMER_KEY=your_production_consumer_key
# MPESA_CONSUMER_SECRET=your_production_consumer_secret
# MPESA_SHORTCODE=your_paybill_number
# MPESA_PASSKEY=your_production_passkey
# NEXT_PUBLIC_APP_URL=https://your-domain.com
```

### 3.2 Test Credentials (Sandbox)

For testing, use these:
- **Shortcode**: `174379`
- **Passkey**: `bfb279f9aa9bdbcf158e97dd71a467cd2e0c893059b10f78e6b72ada1ed2c919`
- **Test Phone**: `254708374149` (Use any phone starting with 254...)
- **Amount**: Any amount (will not be deducted in sandbox)

---

## Step 4: Configure Callback URL

### Development (ngrok for local testing)
```bash
# Install ngrok
npm install -g ngrok

# Start your app
npm run dev

# In another terminal, expose your local server
ngrok http 3000

# Copy the https URL (e.g., https://abc123.ngrok.io)
# Update .env.local:
NEXT_PUBLIC_APP_URL=https://abc123.ngrok.io
```

### Production (Vercel)
```env
NEXT_PUBLIC_APP_URL=https://your-domain.vercel.app
```

Your callback URL will be: `{NEXT_PUBLIC_APP_URL}/api/payment/callback`

---

## Step 5: Link Bank Account to Paybill

1. **For Real Paybill**:
   - Visit Safaricom shop with bank account details
   - Request to link your bank account to Paybill
   - Funds will auto-sweep to your account daily/weekly

2. **Settlement Options**:
   - **Instant**: Funds transferred immediately (higher fees)
   - **Next Day**: Funds transferred next business day
   - **Weekly**: Funds transferred weekly

---

## Step 6: Testing the Integration

### Test Payment Flow

1. **Start your development server**:
```bash
npm run dev
```

2. **Navigate to payment page**:
   - Go to booking flow
   - Select "Mobile Payments"
   - Enter phone number: `708374149` (without country code)
   - Click "Pay with M-Pesa"

3. **Expected Flow**:
   - API sends STK Push to phone
   - User receives prompt on phone
   - User enters M-Pesa PIN
   - Payment processed
   - Callback received
   - Redirect to confirmation page

### Test Phone Numbers (Sandbox)
- `254708374149` - Success
- `254708374148` - Timeout
- `254708374147` - Insufficient funds
- `254708374146` - User cancelled

---

## Step 7: Go Live (Production)

### 7.1 Switch to Production API
Update your API routes to use production endpoints:

In `src/app/api/payment/mpesa/route.ts`, change:
```typescript
// FROM (Sandbox)
"https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials"
"https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest"

// TO (Production)
"https://api.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials"
"https://api.safaricom.co.ke/mpesa/stkpush/v1/processrequest"
```

### 7.2 Update Environment Variables
```env
MPESA_CONSUMER_KEY=your_production_consumer_key
MPESA_CONSUMER_SECRET=your_production_consumer_secret
MPESA_SHORTCODE=your_real_paybill_number
MPESA_PASSKEY=your_production_passkey
NEXT_PUBLIC_APP_URL=https://your-production-domain.com
```

### 7.3 Go-Live Process
1. Submit go-live request on Daraja portal
2. Safaricom reviews your integration
3. Approval time: 2-5 business days
4. Receive production credentials

---

## Step 8: Monitor Transactions

### View Transactions
1. **M-Pesa Portal**: https://org.ke.m-pesa.com
2. **Daraja Portal**: Transaction logs
3. **Your Database**: Store all transactions

### Transaction Reconciliation
```sql
-- Add to your database
CREATE TABLE mpesa_transactions (
  id UUID PRIMARY KEY,
  checkout_request_id VARCHAR,
  merchant_request_id VARCHAR,
  phone_number VARCHAR,
  amount DECIMAL,
  mpesa_receipt_number VARCHAR,
  transaction_date TIMESTAMP,
  result_code INT,
  result_desc TEXT,
  booking_id UUID
);
```

---

## Costs & Fees

### M-Pesa Transaction Fees
- **0 - KES 49**: KES 0
- **KES 50 - 100**: KES 0
- **KES 101 - 500**: KES 7
- **KES 501 - 2,500**: KES 13
- **KES 2,501 - 5,000**: KES 23
- **KES 5,001 - 70,000**: KES 57

### Business Account Fees
- Monthly Paybill fee: ~KES 2,000/month
- Settlement fee: 0.5% - 1.5% of transaction

---

## Alternative Payment Options

If you want more options beyond M-Pesa:

### 1. Pesapal
- Supports M-Pesa, Airtel Money, Cards
- Website: https://www.pesapal.com
- Fee: ~3.5% per transaction

### 2. Flutterwave
- M-Pesa, Cards, Bank transfers
- Website: https://flutterwave.com
- Fee: ~2.9% + KES 50

### 3. DPO PayGate
- All Kenyan mobile money + cards
- Website: https://www.paygate.co.za
- Fee: Negotiable based on volume

---

## Troubleshooting

### "Invalid Access Token"
- Check consumer key/secret
- Ensure no extra spaces in .env.local

### "Timeout Error"
- Check callback URL is accessible
- Use ngrok for local testing
- Verify firewall settings

### "Invalid Shortcode"
- Confirm paybill number is correct
- Check if using sandbox vs production

### "Request Failed"
- Phone number format: 254XXXXXXXXX
- Amount must be integer (no decimals)
- Check passkey is correct

---

## Security Best Practices

1. **Never commit** `.env.local` to git
2. **Rotate credentials** every 90 days
3. **Log all transactions** for audit
4. **Validate amounts** server-side
5. **Use HTTPS** in production
6. **Rate limit** payment endpoints
7. **Store encrypted** transaction data

---

## Support Contacts

- **Safaricom Support**: 0722000000
- **M-Pesa Business**: mpesabusiness@safaricom.co.ke
- **Daraja Support**: apisupport@safaricom.co.ke
- **Emergency**: 100 (from Safaricom line)

---

## Next Steps

1. ✅ Register for Daraja API
2. ✅ Get test credentials
3. ✅ Test in sandbox
4. ✅ Apply for Paybill (if you don't have one)
5. ✅ Link bank account to Paybill
6. ✅ Request go-live on Daraja
7. ✅ Update to production credentials
8. ✅ Launch! 🚀

---

**Need Help?** Contact your technical team or reach out to Safaricom M-Pesa Business support.
