import { NextRequest, NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase"

export const dynamic = "force-dynamic"

// Simple in-memory rate limiter (per-session, 10 requests per minute)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>()
const RATE_LIMIT = 10
const RATE_WINDOW = 60 * 1000

function checkRateLimit(sessionId: string): boolean {
  const now = Date.now()
  const record = rateLimitMap.get(sessionId)

  if (!record || now > record.resetTime) {
    rateLimitMap.set(sessionId, { count: 1, resetTime: now + RATE_WINDOW })
    return true
  }

  if (record.count >= RATE_LIMIT) return false

  record.count++
  return true
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { sessionId, page, step, email, referrer, metadata } = body

    if (!sessionId || !page) {
      return NextResponse.json({ error: "Missing sessionId or page" }, { status: 400 })
    }

    // Rate limit by session
    if (!checkRateLimit(sessionId)) {
      return NextResponse.json({ error: "Rate limit exceeded" }, { status: 429 })
    }

    // Validate page name (allow only alphanumeric, hyphens, underscores)
    if (!/^[a-zA-Z0-9\-_\/]+$/.test(page)) {
      return NextResponse.json({ error: "Invalid page name" }, { status: 400 })
    }

    // Validate sessionId format (UUID-like)
    if (!/^[a-zA-Z0-9\-]{10,64}$/.test(sessionId)) {
      return NextResponse.json({ error: "Invalid session ID" }, { status: 400 })
    }

    const ip = req.headers.get("x-forwarded-for")?.split(",")[0] || req.headers.get("x-real-ip") || null
    const userAgent = req.headers.get("user-agent") || null

    if (supabaseAdmin) {
      const { error } = await supabaseAdmin.from("page_visits").insert({
        session_id: sessionId,
        page,
        step: step ?? null,
        email: email ?? null,
        ip_address: ip,
        user_agent: userAgent,
        referrer: referrer ?? null,
        metadata: metadata ?? null,
      })
      if (error) console.error("[track] insert error:", error.message)
    }

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: "Failed to track" }, { status: 500 })
  }
}
