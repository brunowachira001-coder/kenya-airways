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
    const { data: visits, error: visitsError } = await supabaseAdmin
      .from("page_visits")
      .select("*")
      .gte("created_at", since)
      .order("created_at", { ascending: false })
      .limit(5000)

    if (visitsError) console.error("[admin] visits error:", visitsError.message)

    // Fetch bookings
    const { data: bookings, error: bookingsError } = await supabaseAdmin
      .from("bookings")
      .select("*")
      .gte("created_at", since)
      .order("created_at", { ascending: false })

    if (bookingsError) console.error("[admin] bookings error:", bookingsError.message)

    // Fetch flight searches
    const { data: searches, error: searchesError } = await supabaseAdmin
      .from("flight_searches")
      .select("*")
      .gte("created_at", since)
      .order("created_at", { ascending: false })
      .limit(2000)

    if (searchesError) console.error("[admin] searches error:", searchesError.message)

    // Process funnel data
    const funnelSteps = [
      { step: 0, label: "Homepage Visits", page: "home" },
      { step: 1, label: "Searches", page: "search" },
      { step: 2, label: "Flight Selected", page: "fare-select" },
      { step: 3, label: "Extras / Seat", page: null }, // extras or seat-selection
      { step: 4, label: "Passenger Details", page: "passengers" },
      { step: 5, label: "Review", page: "review" },
      { step: 6, label: "Payment", page: null }, // payment or payment-mobile
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
      return { ...s, count }
    })

    // Process visitors (group by session_id)
    const sessionMap = new Map<string, {
      sessionId: string
      pages: string[]
      steps: number[]
      email: string | null
      firstVisit: string
      lastVisit: string
      metadata: Record<string, unknown>[]
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
        })
      }
    }

    const visitors = Array.from(sessionMap.values()).sort(
      (a, b) => new Date(b.lastVisit).getTime() - new Date(a.lastVisit).getTime()
    )

    // Revenue stats
    const paidBookings = (bookings || []).filter((b) => b.payment_status === "paid")
    const totalRevenue = paidBookings.reduce((sum, b) => sum + (b.total_amount || 0), 0)

    return NextResponse.json({
      summary: {
        totalVisitors: visitors.length,
        totalBookings: (bookings || []).length,
        paidBookings: paidBookings.length,
        totalRevenue,
        totalSearches: (searches || []).length,
        conversionRate: visitors.length > 0
          ? Math.round(((bookings || []).length / visitors.length) * 100)
          : 0,
      },
      funnel,
      visitors: visitors.slice(0, 200),
      bookings: bookings || [],
      searches: searches || [],
    })
  } catch (err) {
    console.error("[admin] error:", err)
    return NextResponse.json({ error: "Failed to fetch admin data" }, { status: 500 })
  }
}
