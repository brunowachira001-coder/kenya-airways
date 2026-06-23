import { NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  try {
    const { phoneNumber, amount } = await req.json()

    const consumerKey = process.env.MPESA_CONSUMER_KEY
    const consumerSecret = process.env.MPESA_CONSUMER_SECRET
    const shortcode = process.env.MPESA_SHORTCODE
    const passkey = process.env.MPESA_PASSKEY
    const callbackUrl = `${process.env.NEXT_PUBLIC_APP_URL}/api/payment/callback`

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
    return NextResponse.json(result)
  } catch (err) {
    console.error("M-Pesa payment error:", err)
    return NextResponse.json({ error: "Payment failed" }, { status: 500 })
  }
}
