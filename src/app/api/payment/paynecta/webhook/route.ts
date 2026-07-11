import { NextRequest, NextResponse } from "next/server"
import crypto from "crypto"

export const dynamic = "force-dynamic"

function verifyWebhookSignature(req: NextRequest, body: string): boolean {
  const signature = req.headers.get("x-paynecta-signature")
  const secret = process.env.PAYNECTA_WEBHOOK_SECRET

  if (!signature || !secret) return false

  const expectedSignature = crypto
    .createHmac("sha256", secret)
    .update(body)
    .digest("hex")

  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(expectedSignature)
  )
}

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text()

    if (!verifyWebhookSignature(req, rawBody)) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 })
    }

    const body = JSON.parse(rawBody)
    // Log only non-sensitive metadata
    console.log("Paynecta webhook received:", {
      transactionRef: body.transaction_reference,
      status: body.status,
      timestamp: new Date().toISOString(),
    })

    return NextResponse.json({ received: true }, { status: 200 })
  } catch {
    return NextResponse.json({ received: false }, { status: 200 })
  }
}