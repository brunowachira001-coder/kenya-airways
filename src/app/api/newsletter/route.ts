import { NextRequest, NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase"

export const dynamic = "force-dynamic"

// POST: subscribe email to newsletter_subscribers
export async function POST(req: NextRequest) {
  try {
    if (!supabaseAdmin) {
      return NextResponse.json(
        { error: "Database not configured" },
        { status: 500 }
      )
    }

    const body = await req.json()
    const { email, source = "website" } = body

    if (!email) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      )
    }

    // Upsert: insert or update if exists (reactivate if was unsubscribed)
    const { data, error } = await supabaseAdmin
      .from("newsletter_subscribers")
      .upsert(
        {
          email,
          is_active: true,
          unsubscribed_at: null,
          source
        },
        {
          onConflict: "email",
          ignoreDuplicates: false
        }
      )
      .select()
      .single()

    if (error) {
      console.error("Newsletter subscription error:", error)
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: "Successfully subscribed to newsletter",
      subscriber: data
    })
  } catch (err) {
    console.error("POST /api/newsletter error:", err)
    return NextResponse.json(
      { error: "Failed to subscribe to newsletter" },
      { status: 500 }
    )
  }
}