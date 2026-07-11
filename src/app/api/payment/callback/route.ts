import { NextRequest, NextResponse } from "next/server"

// Safaricom callback IPs (production)
const SAFARICOM_IPS = [
  "196.201.216.0/24",
  "196.201.217.0/24",
  "196.201.218.0/24",
]

function isAllowedIP(ip: string): boolean {
  // In development, allow all IPs
  if (process.env.NODE_ENV === "development") return true

  // Check against Safaricom IP ranges
  return SAFARICOM_IPS.some((range) => {
    const [subnet, bits] = range.split("/")
    const mask = ~(2 ** (32 - parseInt(bits)) - 1)
    const ipNum = ip.split(".").reduce((acc, octet) => (acc << 8) + parseInt(octet), 0)
    const subnetNum = subnet.split(".").reduce((acc, octet) => (acc << 8) + parseInt(octet), 0)
    return (ipNum & mask) === (subnetNum & mask)
  })
}

export async function POST(req: NextRequest) {
  try {
    // Verify callback is from Safaricom
    const clientIP = req.headers.get("x-forwarded-for")?.split(",")[0] || req.headers.get("x-real-ip")
    if (clientIP && !isAllowedIP(clientIP)) {
      return NextResponse.json({ ResultCode: 1, ResultDesc: "Unauthorized" }, { status: 403 })
    }

    const data = await req.json()

    const resultCode = data.Body?.stkCallback?.ResultCode

    if (resultCode === 0) {
      // TODO: Update database, send confirmation email
      // Log only non-sensitive metadata
      console.log("M-Pesa payment callback received:", {
        resultCode,
        timestamp: new Date().toISOString(),
      })
    } else {
      console.log("M-Pesa payment failed:", {
        resultCode,
        resultDesc: data.Body?.stkCallback?.ResultDesc,
      })
    }

    return NextResponse.json({ ResultCode: 0, ResultDesc: "Success" })
  } catch {
    return NextResponse.json({ ResultCode: 1, ResultDesc: "Failed" })
  }
}
