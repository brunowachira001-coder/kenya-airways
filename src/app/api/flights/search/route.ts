import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { searchFlights } from "@/lib/flights";

export const dynamic = "force-dynamic";

function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  return createClient(url, key);
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const origin = searchParams.get("from");
  const destination = searchParams.get("to");
  const date = searchParams.get("depart");

  // Validate required params
  if (!origin || !destination) {
    return NextResponse.json(
      { success: false, error: "Missing required parameters: from and to" },
      { status: 400 }
    );
  }

  // Validate IATA codes (basic check - 3 uppercase letters)
  const iataRegex = /^[A-Z]{3}$/i;
  if (!iataRegex.test(origin) || !iataRegex.test(destination)) {
    return NextResponse.json(
      { success: false, error: "Invalid airport code format. Expected 3-letter IATA code." },
      { status: 400 }
    );
  }

  // If same origin and destination, return error
  if (origin.toUpperCase() === destination.toUpperCase()) {
    return NextResponse.json(
      { success: false, error: "Origin and destination cannot be the same." },
      { status: 400 }
    );
  }

  // Use today as default if no date provided
  const travelDate = date || new Date().toISOString().split("T")[0];

  // Validate date is reasonable (not in the past, not more than 1 year in future)
  const travelDateObj = new Date(travelDate + "T00:00:00");
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const oneYearLater = new Date(now.getFullYear() + 1, now.getMonth(), now.getDate());

  if (travelDateObj < now) {
    return NextResponse.json(
      { success: false, error: "Travel date cannot be in the past." },
      { status: 400 }
    );
  }

  if (travelDateObj > oneYearLater) {
    return NextResponse.json(
      { success: false, error: "Travel date must be within the next year." },
      { status: 400 }
    );
  }

  try {
    // Try Supabase first
    const supabase = getSupabase();
    const dbResult = supabase
      ? await supabase
          .from("flights")
          .select("*")
          .eq("origin", origin.toUpperCase())
          .eq("destination", destination.toUpperCase())
          .eq("flight_date", travelDate)
          .eq("status", "scheduled")
          .gt("available_seats", 0)
          .order("departure_time", { ascending: true })
      : { data: null, error: { message: "Supabase not configured" } };
    const { data: dbFlights, error } = dbResult;

    if (error) {
      console.warn("[flights/search] Database error, falling back to static data:", error.message);
    }

    // If Supabase returned flights, use them; otherwise fall back to static data
    let transformedFlights;

    if (!error && dbFlights && dbFlights.length > 0) {
      transformedFlights = dbFlights.map((f) => ({
        id: f.id,
        origin: f.origin,
        destination: f.destination,
        airline: f.airline,
        flightNumber: f.flight_number,
        departureTime: f.departure_time,
        arrivalTime: f.arrival_time,
        duration: formatDuration(f.duration_minutes),
        aircraft: f.aircraft,
        economyPrice: f.economy_price,
        businessPrice: f.business_price,
        stops: f.stops,
        availableSeats: f.available_seats,
      }));
    } else {
      // Fall back to static flight library — covers all routes, date-varied prices
      const staticFlights = searchFlights(origin.toUpperCase(), destination.toUpperCase(), travelDate);
      transformedFlights = staticFlights.map((f) => ({
        ...f,
        availableSeats: 9,
      }));
    }

    // Log search to flight_searches table for analytics
    supabase?.from("flight_searches").insert({
      origin: origin.toUpperCase(),
      destination: destination.toUpperCase(),
      departure_date: travelDate,
      return_date: searchParams.get("return") || null,
      passengers: parseInt(searchParams.get("passengers") || "1"),
      cabin_class: searchParams.get("class") || "economy",
      user_ip: req.headers.get("x-forwarded-for")?.split(",")[0] || null,
      user_agent: req.headers.get("user-agent") || null,
    }).then(({ error }) => {
      if (error) console.warn("[flights/search] search log error:", error.message)
    })

    return NextResponse.json(
      {
        success: true,
        flights: transformedFlights,
        meta: {
          origin: origin.toUpperCase(),
          destination: destination.toUpperCase(),
          date: travelDate,
          count: transformedFlights.length,
        },
      },
      {
        status: 200,
        headers: {
          "Cache-Control": "no-store, max-age=0",
        },
      }
    )
  } catch (error) {
    console.error("[flights/search] Error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}

// Helper function to format duration from minutes to "Xh Ym"
function formatDuration(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (mins === 0) {
    return `${hours}h`;
  }
  return `${hours}h ${mins}m`;
}