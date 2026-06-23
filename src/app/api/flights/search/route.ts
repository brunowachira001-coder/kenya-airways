import { NextRequest, NextResponse } from "next/server";
import { searchFlights } from "@/lib/flights";

export const dynamic = "force-dynamic";

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

  // Validate date is reasonable (not more than 1 year in the past/future)
  const travelDateObj = new Date(travelDate);
  const now = new Date();
  const oneYearAgo = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());
  const oneYearLater = new Date(now.getFullYear() + 1, now.getMonth(), now.getDate());

  if (travelDateObj < oneYearAgo || travelDateObj > oneYearLater) {
    return NextResponse.json(
      { success: false, error: "Travel date must be within the next year." },
      { status: 400 }
    );
  }

  try {
    const flights = searchFlights(origin.toUpperCase(), destination.toUpperCase(), travelDate);

    return NextResponse.json(
      {
        success: true,
        flights,
        meta: {
          origin: origin.toUpperCase(),
          destination: destination.toUpperCase(),
          date: travelDate,
          count: flights.length,
        },
      },
      {
        status: 200,
        headers: {
          "Cache-Control": "no-store, max-age=0",
        },
      }
    );
  } catch (error) {
    console.error("[flights/search] Error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}