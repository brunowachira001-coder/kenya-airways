import { NextRequest, NextResponse } from "next/server"

const PHONE_REGEX = /^254[17]\d{8}$/

export async function POST(req: NextRequest) {
  try {
    const { phoneNumber, amount } = await req.json()

    // Validate phone format
    if (!phoneNumber || !PHONE_REGEX.test(phoneNumber)) {
      return NextResponse.json(
        { error: "Invalid phone number format. Must be 254[17]XXXXXXXX" },
        { status: 400 }
      )
    }

    // Validate amount
    if (typeof amount !== "number" || amount < 1 || amount > 150000) {
      return NextResponse.json(
        { error: "Amount must be between 1 and 150000" },
        { status: 400 }
      )
    }

    const consumerKey = process.env.MPESA_CONSUMER_KEY
    const consumerSecret = process.env.MPESA_CONSUMER_SECRET
    const shortcode = process.env.MPESA_SHORTCODE
    const passkey = process.env.MPESA_PASSKEY
    const callbackUrl = `${process.env.NEXT_PUBLIC_APP_URL}/api/payment/callback`

    if (!consumerKey || !consumerSecret || !shortcode || !passkey) {
      return NextResponse.json(
        { error: "M-Pesa configuration missing" },
        { status: 500 }
      )
    }

    const auth = Buffer.from(`${consumerKey}:${consumerSecret}`).toString("base64")
    const tokenRes = await fetch(
      "https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials",
      { headers: { Authorization: `Basic ${auth}` } }
    )
    const { access_token } = await tokenRes.json()

    const timestamp = new Date().toISOString().replace(/[^0-9]/g, "").slice(0, 14)
    const password = Buffer.from(`${shortcode}${passkey}${timestamp}`).toString("base64")

    const stkRes = await fetch(
      "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${access_token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          BusinessShortCode: shortcode,
          Password: password,
          Timestamp: timestamp,
          TransactionType: "CustomerPayBillOnline",
          Amount: amount,
          PartyA: phoneNumber,
          PartyB: shortcode,
          PhoneNumber: phoneNumber,
          CallBackURL: callbackUrl,
          AccountReference: "Kenya Airways",
          TransactionDesc: "Flight Booking",
        }),
      }
    )

    const result = await stkRes.json()

    // Return only safe fields to client
    return NextResponse.json({
      success: result.ResponseCode === "0",
      message: result.ResponseDescription,
      merchantRequestId: result.MerchantRequestID,
      checkoutRequestId: result.CheckoutRequestID,
    })
  } catch {
    return NextResponse.json({ error: "Payment failed" }, { status: 500 })
  }
}
