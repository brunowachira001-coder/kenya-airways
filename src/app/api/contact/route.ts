import { NextRequest, NextResponse } from "next/server"
import { supabaseAdmin, ContactMessage } from "@/lib/supabase"

export const dynamic = "force-dynamic"

// POST: save contact_messages from contact form
export async function POST(req: NextRequest) {
  try {
    if (!supabaseAdmin) {
      return NextResponse.json(
        { error: "Database not configured" },
        { status: 500 }
      )
    }

    const body = await req.json()
    const { name, email, phone, subject, message } = body

    // Validate required fields
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Name, email, and message are required" },
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

    const contactData: Omit<ContactMessage, 'id' | 'created_at' | 'updated_at'> = {
      name,
      email,
      phone: phone || null,
      subject: subject || null,
      message,
      status: "new"
    }

    const { data, error } = await supabaseAdmin
      .from("contact_messages")
      .insert(contactData)
      .select()
      .single()

    if (error) {
      console.error("Contact message error:", error)
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: "Contact message sent successfully",
      contact: data
    })
  } catch (err) {
    console.error("POST /api/contact error:", err)
    return NextResponse.json(
      { error: "Failed to send contact message" },
      { status: 500 }
    )
  }
}