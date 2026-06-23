import { NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  try {
    const data = await req.json()
    console.log("M-Pesa Callback:", JSON.stringify(data, null, 2))
    
    const resultCode = data.Body?.stkCallback?.ResultCode
    
    if (resultCode === 0) {
      console.log("Payment successful")
      // TODO: Update database, send confirmation email
    } else {
      console.log("Payment failed:", data.Body?.stkCallback?.ResultDesc)
    }
    
    return NextResponse.json({ ResultCode: 0, ResultDesc: "Success" })
  } catch (error) {
    console.error("Callback error:", error)
    return NextResponse.json({ ResultCode: 1, ResultDesc: "Failed" })
  }
}
