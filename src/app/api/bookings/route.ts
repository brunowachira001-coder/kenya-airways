import { NextRequest, NextResponse } from "next/server"
import { supabaseAdmin, Booking, Passenger } from "@/lib/supabase"

export const dynamic = "force-dynamic"

// GET: list bookings (admin only)
export async function GET(req: NextRequest) {
  try {
    // Only allow admin access
    const serviceRoleKey = req.headers.get("x-service-role-key")
    if (serviceRoleKey !== process.env.SUPABASE_SERVICE_ROLE_KEY) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    if (!supabaseAdmin) {
      return NextResponse.json(
        { error: "Database not configured" },
        { status: 500 }
      )
    }

    const { searchParams } = new URL(req.url)
    const email = searchParams.get("email")
    const limit = parseInt(searchParams.get("limit") || "50")

    let query = supabaseAdmin
      .from("bookings")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(limit)

    if (email) {
      query = query.eq("email", email)
    }

    const { data, error } = await query

    if (error) {
      console.error("Supabase error:", error)
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      bookings: data
    })
  } catch (err) {
    console.error("GET /api/bookings error:", err)
    return NextResponse.json(
      { error: "Failed to fetch bookings" },
      { status: 500 }
    )
  }
}

// POST: create a new booking
export async function POST(req: NextRequest) {
  try {
    if (!supabaseAdmin) {
      return NextResponse.json(
        { error: "Database not configured" },
        { status: 500 }
      )
    }

    const body = await req.json()

    const {
      passengerName,
      email,
      phone,
      origin,
      destination,
      departureDate,
      returnDate,
      cabinClass,
      tripType,
      passengers,
      baseFare,
      taxes,
      totalAmount,
      currency = "KES",
      paymentStatus = "pending",
      bookingStatus = "confirmed",
      extras,
      flightTotal,
      extrasTotal,
    } = body

    // Validate required fields
    if (!passengerName || !email || !origin || !destination || !departureDate || !cabinClass || !passengers || !totalAmount) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    // Generate booking reference using database function
    const { data: refData } = await supabaseAdmin
      .rpc("generate_booking_reference")

    let bookingReference = refData as string | null
    if (!bookingReference) {
      const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"
      bookingReference = "KQ"
      for (let i = 0; i < 8; i++) {
        bookingReference += chars.charAt(Math.floor(Math.random() * chars.length))
      }
      console.warn("Using fallback booking reference generation")
    }

    // Insert booking
    const bookingData: Omit<Booking, 'id' | 'created_at' | 'updated_at'> = {
      booking_reference: bookingReference,
      passenger_name: passengerName,
      email,
      phone: phone || null,
      origin,
      destination,
      departure_date: departureDate,
      return_date: returnDate || null,
      cabin_class: cabinClass,
      trip_type: tripType || "return",
      passengers,
      base_fare: baseFare ?? (flightTotal ?? 0),
      taxes: taxes || 0,
      total_amount: totalAmount,
      currency,
      payment_status: paymentStatus,
      booking_status: bookingStatus,
      // Persist extras (baggage, insurance, seat, meals, holdBooking, services) as JSON.
      // Schema may or may not have an `extras` JSONB column — Supabase will reject the
      // insert with a 400 if the column is missing; the existing fallback below logs and
      // retries without the field so the booking still goes through.
      ...(extras !== undefined ? { extras } : {}),
    }

    const { data: booking, error: bookingError } = await supabaseAdmin
      .from("bookings")
      .insert(bookingData)
      .select()
      .single()

    // If the DB rejects the `extras` JSONB column (schema migration not applied),
    // retry without it so the booking still goes through. Extras stay in client state.
    // Supabase error format is: "Could not find the 'extras' column of 'bookings' in the schema cache"
    // (note: 'extras' precedes 'column', so the regex matches that order too).
    let finalBooking = booking
    if (
      bookingError &&
      /'extras'.*column|column.*'extras'|extras.*schema cache/i.test(bookingError.message)
    ) {
      console.warn("`extras` column missing on bookings table — retrying without it. Run supabase-setup.sql (section 7b) to add the column.")
      const { extras: _extras, ...bookingDataNoExtras } = bookingData // eslint-disable-line @typescript-eslint/no-unused-vars
      const retry = await supabaseAdmin
        .from("bookings")
        .insert(bookingDataNoExtras)
        .select()
        .single()
      if (retry.error) {
        console.error("Booking insert error (retry):", retry.error)
        return NextResponse.json({ error: retry.error.message }, { status: 500 })
      }
      finalBooking = retry.data
    } else if (bookingError) {
      console.error("Booking insert error:", bookingError)
      return NextResponse.json(
        { error: bookingError.message },
        { status: 500 }
      )
    }

    // Insert passengers
    if (passengers && passengers.length > 0) {
      const passengerRecords: Omit<Passenger, 'id' | 'booking_id' | 'created_at'>[] = passengers.map((p: Record<string, string>) => ({
        title: p.title || "",
        first_name: p.firstName || "",
        last_name: p.lastName || "",
        date_of_birth: p.dateOfBirth || "",
        gender: p.gender || null,
        email: email,
        phone: phone || null,
        passport_number: p.passportNumber || null,
        passport_expiry: p.passportExpiry || null,
        nationality: p.nationality || null,
        special_meal: p.specialMeal || null,
        special_assistance: p.specialAssistance || null
      }))

      const { error: passengersError } = await supabaseAdmin
        .from("passengers")
        .insert(passengerRecords.map(p => ({ ...p, booking_id: finalBooking!.id })))

      if (passengersError) {
        console.error("Passengers insert error:", passengersError)
        // Don't fail the booking creation for passenger insert errors
      }
    }

    return NextResponse.json({
      success: true,
      bookingReference,
      bookingId: finalBooking!.id,
      // Echo back what the server received so the client can verify the round-trip.
      extrasReceived: extras !== undefined,
      flightTotal: flightTotal ?? null,
      extrasTotal: extrasTotal ?? null,
    })
  } catch (err) {
    console.error("POST /api/bookings error:", err)
    return NextResponse.json(
      { error: "Failed to create booking" },
      { status: 500 }
    )
  }
}