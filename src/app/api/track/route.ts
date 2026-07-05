import { NextRequest, NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase"

export const dynamic = "force-dynamic"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { sessionId, page, step, email, referrer, metadata } = body

    if (!sessionId || !page) {
      return NextResponse.json({ error: "Missing sessionId or page" }, { status: 400 })
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
  } catch (err) {
    console.error("[track] error:", err)
    return NextResponse.json({ error: "Failed to track" }, { status: 500 })
  }
}
