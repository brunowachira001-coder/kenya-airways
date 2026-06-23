import { NextRequest, NextResponse } from "next/server"

export const dynamic = "force-dynamic"

const PAYNECTA_BASE_URL = "https://paynecta.co.ke/api/v1"

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const transactionReference = searchParams.get("transactionReference")

    if (!transactionReference) {
      return NextResponse.json(
        { error: "Transaction reference is required" },
        { status: 400 }
      )
    }

    const apiKey = process.env.PAYNECTA_API_KEY
    const email = process.env.PAYNECTA_EMAIL

    if (!apiKey || !email) {
      return NextResponse.json(
        { error: "Paynecta configuration missing" },
        { status: 500 }
      )
    }

    const response = await fetch(
      `${PAYNECTA_BASE_URL}/payment/status?transaction_reference=${encodeURIComponent(transactionReference)}`,
      {
        method: "GET",
        headers: {
          "X-API-Key": apiKey,
          "X-User-Email": email,
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
      }
    )

    const data = await response.json()

    if (!response.ok) {
      return NextResponse.json(
        { error: data.message || data.error || "Failed to get payment status" },
        { status: response.status }
      )
    }

    if (data.success) {
      return NextResponse.json({
        success: true,
        status: data.data.status,
        mpesaReceiptNumber: data.data.mpesa_receipt_number || null,
        paidAt: data.data.paid_at || null,
        amount: data.data.amount,
      })
    } else {
      return NextResponse.json(
        { error: data.message || "Failed to get payment status" },
        { status: 400 }
      )
    }
  } catch (err) {
    console.error("Paynecta status check error:", err)
    return NextResponse.json(
      { error: "Failed to check payment status" },
      { status: 500 }
    )
  }
}