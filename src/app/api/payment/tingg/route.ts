import { NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  try {
    const { phoneNumber, amount, email, bookingRef } = await req.json()

    const vendorId = process.env.TINGG_VENDOR_ID
    const vendorKey = process.env.TINGG_VENDOR_KEY
    const callbackUrl = `${process.env.NEXT_PUBLIC_APP_URL}/api/payment/tingg/callback`

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

    // Use Tingg API for payment processing
    const response = await fetch("https://apis.tingg.africa/v1/checkout/initiate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${vendorKey}`,
      },
      body: JSON.stringify(payload),
    })

    const result = await response.json()
    return NextResponse.json(result)
  } catch (err) {
    console.error("Tingg payment error:", err)
    return NextResponse.json({ error: "Payment failed" }, { status: 500 })
  }
}
