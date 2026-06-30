import { NextRequest, NextResponse } from "next/server"

export const dynamic = "force-dynamic"

const PAYNECTA_BASE_URL = "https://paynecta.co.ke/api/v1"

export async function POST(req: NextRequest) {
  try {
    const { phoneNumber, amount } = await req.json()

    // Validate amount
    if (typeof amount !== "number" || amount < 1 || amount > 125000) {
      return NextResponse.json(
        { error: "Amount must be a number between 1 and 125000" },
        { status: 400 }
      )
    }

    // Validate phone format: must be 254[17]\d{8}
    const phoneRegex = /^254[17]\d{8}$/
    if (!phoneNumber || !phoneRegex.test(phoneNumber)) {
      return NextResponse.json(
        { error: "Invalid phone number format. Must be 254[17]XXXXXXXX format" },
        { status: 400 }
      )
    }

    const apiKey = process.env.PAYNECTA_API_KEY
    const email = process.env.PAYNECTA_EMAIL
    const code = process.env.PAYNECTA_CODE

    if (!apiKey || !email || !code) {
      return NextResponse.json(
        { error: "Paynecta configuration missing" },
        { status: 500 }
      )
    }

    const response = await fetch(`${PAYNECTA_BASE_URL}/payment/initialize`, {
      method: "POST",
      headers: {
        "X-API-Key": apiKey,
        "X-User-Email": email,
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
      body: JSON.stringify({
        code: code,
        mobile_number: phoneNumber,
        amount: amount,
      }),
    })

    const data = await response.json()

    if (!response.ok) {
      return NextResponse.json(
        { error: data.message || data.error || "Paynecta initialization failed" },
        { status: response.status }
      )
    }

    if (data.success) {
      return NextResponse.json({
        success: true,
        message: data.message || "Payment initialized successfully",
        transactionReference: data.data.transaction_reference,
        checkoutRequestId: data.data.CheckoutRequestID,
      })
    } else {
      return NextResponse.json(
        { error: data.message || "Payment initialization failed" },
        { status: 400 }
      )
    }
  } catch (err) {
    console.error("Paynecta payment error:", err)
    return NextResponse.json(
      { error: "Payment initialization failed" },
      { status: 500 }
    )
  }
}