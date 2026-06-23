import { NextRequest, NextResponse } from "next/server"
import { supabase, supabaseAdmin } from "@/lib/supabase"

export const dynamic = "force-dynamic"

interface RouteParams {
  params: Promise<{ reference: string }>
}

// GET: fetch a booking by reference
export async function GET(req: NextRequest, { params }: RouteParams) {
  try {
    const { reference } = await params

    if (!supabase) {
      return NextResponse.json(
        { error: "Database not configured" },
        { status: 500 }
      )
    }

    const { data, error } = await supabase
      .from("bookings")
      .select("*")
      .eq("booking_reference", reference)
      .single()

    if (error) {
      if (error.code === "PGRST116") {
        return NextResponse.json(
          { error: "Booking not found" },
          { status: 404 }
        )
      }
      console.error("Supabase error:", error)
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      )
    }

    // Also fetch passengers for this booking
    const { data: passengers } = await supabase
      .from("passengers")
      .select("*")
      .eq("booking_id", data.id)

    return NextResponse.json({
      success: true,
      booking: {
        ...data,
        passengerDetails: passengers || []
      }
    })
  } catch (err) {
    console.error("GET /api/bookings/[reference] error:", err)
    return NextResponse.json(
      { error: "Failed to fetch booking" },
      { status: 500 }
    )
  }
}

// PATCH: update payment_status, payment_reference, mpesa_receipt
export async function PATCH(req: NextRequest, { params }: RouteParams) {
  try {
    const { reference } = await params

    if (!supabaseAdmin) {
      return NextResponse.json(
        { error: "Database not configured" },
        { status: 500 }
      )
    }

    const body = await req.json()
    const { paymentStatus, paymentReference, mpesaReceipt, bookingStatus } = body

    // Build update object
    const updates: Record<string, string> = {}
    if (paymentStatus !== undefined) updates.payment_status = paymentStatus
    if (paymentReference !== undefined) updates.payment_reference = paymentReference
    if (mpesaReceipt !== undefined) updates.mpesa_receipt = mpesaReceipt
    if (bookingStatus !== undefined) updates.booking_status = bookingStatus

    if (Object.keys(updates).length === 0) {
      return NextResponse.json(
        { error: "No fields to update" },
        { status: 400 }
      )
    }

    const { data, error } = await supabaseAdmin
      .from("bookings")
      .update(updates)
      .eq("booking_reference", reference)
      .select()
      .single()

    if (error) {
      console.error("Supabase update error:", error)
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      booking: data
    })
  } catch (err) {
    console.error("PATCH /api/bookings/[reference] error:", err)
    return NextResponse.json(
      { error: "Failed to update booking" },
      { status: 500 }
    )
  }
}