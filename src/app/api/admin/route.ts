import { NextRequest, NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase"

export const dynamic = "force-dynamic"

export async function GET(req: NextRequest) {
  if (!supabaseAdmin) {
    return NextResponse.json({ error: "Database not configured" }, { status: 500 })
  }

  const { searchParams } = new URL(req.url)
  const days = parseInt(searchParams.get("days") || "30")
  const since = new Date(Date.now() - days * 86400000).toISOString()

  try {
    // Fetch page visits
    const { data: visits } = await supabaseAdmin
      .from("page_visits")
      .select("*")
      .gte("created_at", since)
      .order("created_at", { ascending: false })
      .limit(5000)

    // Fetch bookings
    const { data: bookings } = await supabaseAdmin
      .from("bookings")
      .select("*")
      .gte("created_at", since)
      .order("created_at", { ascending: false })

    // Fetch passengers (with booking info joined manually)
    const { data: passengers } = await supabaseAdmin
      .from("passengers")
      .select("*")
      .order("created_at", { ascending: false })

    // Fetch flight searches
    const { data: searches } = await supabaseAdmin
      .from("flight_searches")
      .select("*")
      .gte("created_at", since)
      .order("created_at", { ascending: false })
      .limit(2000)

    // Build a map of booking_id -> passengers
    const passengersByBooking = new Map<string, typeof passengers>()
    for (const p of passengers || []) {
      const list = passengersByBooking.get(p.booking_id) || []
      list.push(p)
      passengersByBooking.set(p.booking_id, list)
    }

    // Build a map of email -> page visits
    const visitsByEmail = new Map<string, typeof visits>()
    for (const v of visits || []) {
      if (v.email) {
        const list = visitsByEmail.get(v.email) || []
        list.push(v)
        visitsByEmail.set(v.email, list)
      }
    }

    // Build a map of email -> bookings
    const bookingsByEmail = new Map<string, typeof bookings>()
    for (const b of bookings || []) {
      const list = bookingsByEmail.get(b.email) || []
      list.push(b)
      bookingsByEmail.set(b.email, list)
    }

    // Process funnel data
    const funnelSteps = [
      { step: 0, label: "Homepage Visits", page: "home" },
      { step: 1, label: "Searches", page: "search" },
      { step: 2, label: "Flight Selected", page: "fare-select" },
      { step: 3, label: "Extras / Seat", page: null },
      { step: 4, label: "Passenger Details", page: "passengers" },
      { step: 5, label: "Review", page: "review" },
      { step: 6, label: "Payment", page: null },
      { step: 7, label: "Confirmed", page: "confirmation" },
    ]

    const funnel = funnelSteps.map((s) => {
      let count = 0
      if (s.page) {
        count = (visits || []).filter((v) => v.page === s.page).length
      } else if (s.step === 3) {
        count = (visits || []).filter((v) => v.page === "extras" || v.page === "seat-selection").length
      } else if (s.step === 6) {
        count = (visits || []).filter((v) => v.page === "payment" || v.page === "payment-mobile").length
      }
      // Also count bookings that reached at least this step
      if (s.step >= 4) {
        for (const b of bookings || []) {
          if (b.created_at >= since) count++
        }
        // Deduplicate: only count each booking once at the highest step
        if (s.step === 7) {
          count = (bookings || []).filter((b) => b.created_at >= since && b.payment_status === "paid").length
        }
      }
      return { ...s, count }
    })

    // Process visitors from page_visits (group by session_id)
    const sessionMap = new Map<string, {
      sessionId: string
      pages: string[]
      steps: number[]
      email: string | null
      firstVisit: string
      lastVisit: string
      metadata: Record<string, unknown>[]
      type: "session"
    }>()

    for (const v of visits || []) {
      const existing = sessionMap.get(v.session_id)
      if (existing) {
        if (!existing.pages.includes(v.page)) existing.pages.push(v.page)
        if (v.step != null && !existing.steps.includes(v.step)) existing.steps.push(v.step)
        if (v.email && !existing.email) existing.email = v.email
        if (v.created_at > existing.lastVisit) existing.lastVisit = v.created_at
        if (v.created_at < existing.firstVisit) existing.firstVisit = v.created_at
        if (v.metadata) existing.metadata.push(v.metadata)
      } else {
        sessionMap.set(v.session_id, {
          sessionId: v.session_id,
          pages: [v.page],
          steps: v.step != null ? [v.step] : [],
          email: v.email || null,
          firstVisit: v.created_at,
          lastVisit: v.created_at,
          metadata: v.metadata ? [v.metadata] : [],
          type: "session",
        })
      }
    }

    const sessionVisitors = Array.from(sessionMap.values()).sort(
      (a, b) => new Date(b.lastVisit).getTime() - new Date(a.lastVisit).getTime()
    )

    // Build real client entries from bookings (the source of truth for real users)
    const clients: {
      id: string
      type: "client"
      name: string
      email: string
      phone: string | null
      bookingRef: string
      route: string
      tripType: string
      cabinClass: string
      departureDate: string
      returnDate: string | null
      passengers: Record<string, unknown>[]
      baseFare: number
      taxes: number
      totalAmount: number
      currency: string
      paymentStatus: string
      bookingStatus: string
      createdAt: string
      stepsReached: string[]
      maxStep: number
      paymentRef: string | null
      mpesaReceipt: string | null
      extras: Record<string, unknown> | null
    }[] = []

    for (const b of bookings || []) {
      const paxList = passengersByBooking.get(b.id) || []
      const paxDetails = paxList.map((p) => ({
        title: p.title,
        firstName: p.first_name,
        lastName: p.last_name,
        dateOfBirth: p.date_of_birth,
        gender: p.gender,
        email: p.email,
        phone: p.phone,
        nationality: p.nationality,
        passportNumber: p.passport_number,
        passportExpiry: p.passport_expiry,
        specialMeal: p.special_meal,
        specialAssistance: p.special_assistance,
      }))

      // Determine which steps this client completed based on booking data
      const stepsReached = ["home", "search", "fare-select", "passengers", "review"]
      if (b.payment_status === "paid" || b.payment_status === "processing") {
        stepsReached.push("payment-mobile")
      }
      if (b.payment_status === "paid") {
        stepsReached.push("confirmation")
      }

      // Also merge page visit steps if email matches
      const visitSteps = visitsByEmail.get(b.email)
      if (visitSteps) {
        for (const v of visitSteps) {
          if (!stepsReached.includes(v.page)) stepsReached.push(v.page)
        }
      }

      const maxStep = stepsReached.includes("confirmation") ? 7
        : stepsReached.includes("payment-mobile") ? 6
        : stepsReached.includes("review") ? 5
        : stepsReached.includes("passengers") ? 4
        : 2

      clients.push({
        id: b.id,
        type: "client" as const,
        name: b.passenger_name,
        email: b.email,
        phone: b.phone,
        bookingRef: b.booking_reference,
        route: `${b.origin} → ${b.destination}`,
        tripType: b.trip_type,
        cabinClass: b.cabin_class,
        departureDate: b.departure_date,
        returnDate: b.return_date,
        passengers: paxDetails,
        baseFare: b.base_fare,
        taxes: b.taxes,
        totalAmount: b.total_amount,
        currency: b.currency,
        paymentStatus: b.payment_status,
        bookingStatus: b.booking_status,
        createdAt: b.created_at,
        stepsReached,
        maxStep,
        paymentRef: b.payment_reference || null,
        mpesaReceipt: b.mpesa_receipt || null,
        extras: b.extras || null,
      })
    }

    // Add session-only visitors (no booking) to clients list
    for (const sv of sessionVisitors) {
      // Skip if already represented as a client via email match
      if (sv.email && clients.some((c) => c.email === sv.email)) continue

      const maxStep = sv.steps.length > 0 ? Math.max(...sv.steps) : 0
      clients.push({
        id: sv.sessionId,
        type: "client" as const,
        name: sv.email || "Anonymous Visitor",
        email: sv.email || "",
        phone: null,
        bookingRef: "",
        route: "",
        tripType: "",
        cabinClass: "",
        departureDate: "",
        returnDate: null,
        passengers: [],
        baseFare: 0,
        taxes: 0,
        totalAmount: 0,
        currency: "KES",
        paymentStatus: "none",
        bookingStatus: "visitor",
        createdAt: sv.firstVisit,
        stepsReached: sv.pages,
        maxStep,
        paymentRef: null,
        mpesaReceipt: null,
        extras: null,
      })
    }

    // Sort clients: confirmed first, then by date descending
    clients.sort((a, b) => {
      if (a.maxStep !== b.maxStep) return b.maxStep - a.maxStep
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    })

    // Revenue stats
    const paidBookings = (bookings || []).filter((b) => b.payment_status === "paid")
    const totalRevenue = paidBookings.reduce((sum, b) => sum + (b.total_amount || 0), 0)

    return NextResponse.json({
      summary: {
        totalVisitors: sessionVisitors.length + clients.filter((c) => c.bookingStatus === "visitor").length,
        totalBookings: (bookings || []).length,
        paidBookings: paidBookings.length,
        totalRevenue,
        totalSearches: (searches || []).length,
        totalPassengers: (passengers || []).length,
        conversionRate: (bookings || []).length > 0 && sessionVisitors.length > 0
          ? Math.round(((bookings || []).length / (sessionVisitors.length + (bookings || []).length)) * 100)
          : 0,
      },
      funnel,
      clients,
      bookings: bookings || [],
      searches: searches || [],
    })
  } catch (err) {
    console.error("[admin] error:", err)
    return NextResponse.json({ error: "Failed to fetch admin data" }, { status: 500 })
  }
}
