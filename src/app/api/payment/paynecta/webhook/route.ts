import { NextRequest, NextResponse } from "next/server"

export const dynamic = "force-dynamic"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    console.log('Paynecta webhook:', JSON.stringify(body))
    return NextResponse.json({ received: true }, { status: 200 })
  } catch (err) {
    console.error("Paynecta webhook error:", err)
    return NextResponse.json({ received: false }, { status: 200 })
  }
}