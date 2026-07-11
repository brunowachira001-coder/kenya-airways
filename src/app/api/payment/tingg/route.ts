import { NextRequest, NextResponse } from "next/server"

const PHONE_REGEX = /^254[17]\d{8}$/
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export async function POST(req: NextRequest) {
  try {
    const { phoneNumber, amount, email, bookingRef } = await req.json()

    // Validate inputs
    if (!phoneNumber || !PHONE_REGEX.test(phoneNumber)) {
      return NextResponse.json(
        { error: "Invalid phone number format" },
        { status: 400 }
      )
    }

    if (typeof amount !== "number" || amount < 1 || amount > 150000) {
      return NextResponse.json(
        { error: "Amount must be between 1 and 150000" },
        { status: 400 }
      )
    }

    if (email && !EMAIL_REGEX.test(email)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      )
    }

    const vendorId = process.env.TINGG_VENDOR_ID
    const vendorKey = process.env.TINGG_VENDOR_KEY
    const callbackUrl = `${process.env.NEXT_PUBLIC_APP_URL}/api/payment/tingg/callback`

    if (!vendorId || !vendorKey) {
      return NextResponse.json(
        { error: "Tingg configuration missing" },
        { status: 500 }
      )
    }

    const payload = {
      vendor_id: vendorId,
      phone: phoneNumber,
      amount: amount,
      email: email,
      order_id: bookingRef,
      callback_url: callbackUrl,
      mpesa_shortcode: process.env.MPESA_SHORTCODE,
      mpesa_passkey: process.env.MPESA_PASSKEY,
    }

    const response = await fetch("https://apis.tingg.africa/v1/checkout/initiate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${vendorKey}`,
      },
      body: JSON.stringify(payload),
    })

    const result = await response.json()

    // Return only safe fields to client
    return NextResponse.json({
      success: response.ok,
      message: result.message || (response.ok ? "Payment initiated" : "Payment failed"),
      transactionId: result.transaction_id,
      checkoutUrl: result.checkout_url,
    })
  } catch {
    return NextResponse.json({ error: "Payment failed" }, { status: 500 })
  }
}
