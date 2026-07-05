"use client"

import { useEffect, useState } from "react"
import { Fragment } from "react"
import { Users, Ticket, TrendingUp, Search, ChevronDown, ChevronUp, IndianRupee } from "lucide-react"

interface AdminData {
  summary: {
    totalVisitors: number
    totalBookings: number
    paidBookings: number
    totalRevenue: number
    totalSearches: number
    conversionRate: number
  }
  funnel: { step: number; label: string; count: number }[]
  visitors: {
    sessionId: string
    pages: string[]
    steps: number[]
    email: string | null
    firstVisit: string
    lastVisit: string
    metadata: Record<string, unknown>[]
  }[]
  bookings: {
    id: string
    booking_reference: string
    passenger_name: string
    email: string
    phone: string
    origin: string
    destination: string
    departure_date: string
    return_date: string | null
    cabin_class: string
    trip_type: string
    base_fare: number
    taxes: number
    total_amount: number
    currency: string
    payment_status: string
    booking_status: string
    created_at: string
  }[]
  searches: {
    id: string
    origin: string
    destination: string
    departure_date: string
    created_at: string
  }[]
}

const FUNNEL_COLORS = [
  "bg-blue-500",
  "bg-blue-400",
  "bg-cyan-500",
  "bg-teal-500",
  "bg-green-500",
  "bg-yellow-500",
  "bg-orange-500",
  "bg-red-500",
]

const STEP_BADGES = [
  "bg-gray-100 text-gray-600",
  "bg-blue-100 text-blue-700",
  "bg-cyan-100 text-cyan-700",
  "bg-teal-100 text-teal-700",
  "bg-green-100 text-green-700",
  "bg-yellow-100 text-yellow-700",
  "bg-orange-100 text-orange-700",
  "bg-red-100 text-red-700",
]

const STEP_LABELS = ["Home", "Search", "Fare Select", "Extras", "Passengers", "Review", "Payment", "Confirmed"]

export default function AdminPage() {
  const [data, setData] = useState<AdminData | null>(null)
  const [loading, setLoading] = useState(true)
  const [days, setDays] = useState(30)
  const [expandedVisitor, setExpandedVisitor] = useState<string | null>(null)
  const [tab, setTab] = useState<"funnel" | "visitors" | "bookings" | "searches">("funnel")

  useEffect(() => {
    setLoading(true)
    fetch(`/api/admin?days=${days}`)
      .then((r) => r.json())
      .then((d) => {
        setData(d)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [days])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin w-8 h-8 border-4 border-[#ed1c24] border-t-transparent rounded-full" />
      </div>
    )
  }

  if (!data) {
    return (
      <div className="text-center py-20 text-gray-500">
        Failed to load admin data. Make sure the database is configured.
      </div>
    )
  }

  const maxFunnel = Math.max(...data.funnel.map((f) => f.count), 1)

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Dashboard</h2>
        <select
          value={days}
          onChange={(e) => setDays(parseInt(e.target.value))}
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white"
        >
          <option value={7}>Last 7 days</option>
          <option value={14}>Last 14 days</option>
          <option value={30}>Last 30 days</option>
          <option value={90}>Last 90 days</option>
        </select>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <StatCard icon={<Users className="w-5 h-5" />} label="Visitors" value={data.summary.totalVisitors} color="blue" />
        <StatCard icon={<Search className="w-5 h-5" />} label="Searches" value={data.summary.totalSearches} color="cyan" />
        <StatCard icon={<Ticket className="w-5 h-5" />} label="Bookings" value={data.summary.totalBookings} color="green" />
        <StatCard icon={<TrendingUp className="w-5 h-5" />} label="Paid" value={data.summary.paidBookings} color="emerald" />
        <StatCard icon={<IndianRupee className="w-5 h-5" />} label="Revenue" value={`KES ${data.summary.totalRevenue.toLocaleString()}`} color="yellow" />
        <StatCard icon={<TrendingUp className="w-5 h-5" />} label="Conversion" value={`${data.summary.conversionRate}%`} color="purple" />
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-gray-200">
        {(["funnel", "visitors", "bookings", "searches"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
              tab === t
                ? "border-[#ed1c24] text-[#ed1c24]"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            {t.charAt(0).toUpperCase() + t.slice(1)}
            {t === "visitors" && <span className="ml-1.5 text-xs bg-gray-100 px-1.5 py-0.5 rounded-full">{data.visitors.length}</span>}
            {t === "bookings" && <span className="ml-1.5 text-xs bg-gray-100 px-1.5 py-0.5 rounded-full">{data.bookings.length}</span>}
            {t === "searches" && <span className="ml-1.5 text-xs bg-gray-100 px-1.5 py-0.5 rounded-full">{data.searches.length}</span>}
          </button>
        ))}
      </div>

      {/* Funnel Tab */}
      {tab === "funnel" && (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-lg font-semibold mb-6">Booking Funnel</h3>
          <div className="space-y-3">
            {data.funnel.map((f, i) => {
              const pct = maxFunnel > 0 ? (f.count / maxFunnel) * 100 : 0
              const dropoff = i > 0 ? data.funnel[i - 1].count - f.count : 0
              const dropoffPct = i > 0 && data.funnel[i - 1].count > 0
                ? Math.round((dropoff / data.funnel[i - 1].count) * 100)
                : 0
              return (
                <div key={f.step} className="flex items-center gap-4">
                  <div className="w-36 text-sm font-medium text-gray-700 text-right">{f.label}</div>
                  <div className="flex-1 relative">
                    <div className="h-10 bg-gray-100 rounded-lg overflow-hidden">
                      <div
                        className={`h-full ${FUNNEL_COLORS[i]} rounded-lg transition-all duration-500 flex items-center pl-3`}
                        style={{ width: `${Math.max(pct, 3)}%` }}
                      >
                        <span className="text-white text-sm font-semibold">{f.count}</span>
                      </div>
                    </div>
                  </div>
                  <div className="w-24 text-right">
                    {i > 0 && dropoff > 0 && (
                      <span className="text-xs text-red-500">-{dropoffPct}% drop</span>
                    )}
                    {i > 0 && dropoff === 0 && (
                      <span className="text-xs text-gray-400">—</span>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Visitors Tab */}
      {tab === "visitors" && (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Session</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Email</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Steps Reached</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Max Step</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">First Visit</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Last Visit</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {data.visitors.map((v) => {
                  const maxStep = v.steps.length > 0 ? Math.max(...v.steps) : 0
                  const isExpanded = expandedVisitor === v.sessionId
                  return (
                    <Fragment key={v.sessionId}>
                      <tr
                        className="hover:bg-gray-50 cursor-pointer"
                        onClick={() => setExpandedVisitor(isExpanded ? null : v.sessionId)}
                      >
                        <td className="px-4 py-3 font-mono text-xs text-gray-500">
                          <div className="flex items-center gap-2">
                            {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                            {v.sessionId.slice(0, 8)}...
                          </div>
                        </td>
                        <td className="px-4 py-3">{v.email || <span className="text-gray-400">—</span>}</td>
                        <td className="px-4 py-3">
                          <div className="flex flex-wrap gap-1">
                            {v.pages.map((p) => (
                              <span key={p} className="text-[10px] bg-gray-100 px-1.5 py-0.5 rounded">{p}</span>
                            ))}
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`text-xs px-2 py-1 rounded-full font-medium ${STEP_BADGES[maxStep] || STEP_BADGES[0]}`}>
                            {STEP_LABELS[maxStep] || `Step ${maxStep}`}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-gray-500 text-xs">{formatTime(v.firstVisit)}</td>
                        <td className="px-4 py-3 text-gray-500 text-xs">{formatTime(v.lastVisit)}</td>
                      </tr>
                      {isExpanded && (
                        <tr>
                          <td colSpan={6} className="px-4 py-3 bg-gray-50">
                            <div className="space-y-2">
                              <p className="text-xs font-semibold text-gray-600">Timeline:</p>
                              <div className="flex flex-wrap gap-2">
                                {v.pages.map((p, i) => (
                                  <span key={i} className={`text-xs px-2 py-1 rounded-full ${STEP_BADGES[STEP_LABELS.indexOf(p)] || "bg-gray-100 text-gray-600"}`}>
                                    {p}
                                  </span>
                                ))}
                              </div>
                              {v.metadata.length > 0 && (
                                <p className="text-xs text-gray-400">
                                  Metadata: {JSON.stringify(v.metadata[0])}
                                </p>
                              )}
                            </div>
                          </td>
                        </tr>
                      )}
                    </Fragment>
                  )
                })}
              </tbody>
            </table>
          </div>
          {data.visitors.length === 0 && (
            <div className="text-center py-10 text-gray-400">No visitors tracked yet. Deploy and visit the site to start collecting data.</div>
          )}
        </div>
      )}

      {/* Bookings Tab */}
      {tab === "bookings" && (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Reference</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Passenger</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Route</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Date</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Class</th>
                  <th className="text-right px-4 py-3 font-medium text-gray-600">Amount</th>
                  <th className="text-center px-4 py-3 font-medium text-gray-600">Payment</th>
                  <th className="text-center px-4 py-3 font-medium text-gray-600">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {data.bookings.map((b) => (
                  <tr key={b.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-mono text-xs font-semibold">{b.booking_reference}</td>
                    <td className="px-4 py-3">{b.passenger_name}</td>
                    <td className="px-4 py-3">{b.origin} → {b.destination}</td>
                    <td className="px-4 py-3 text-xs text-gray-500">{b.departure_date}</td>
                    <td className="px-4 py-3 text-xs">{b.cabin_class}</td>
                    <td className="px-4 py-3 text-right font-semibold">KES {b.total_amount?.toLocaleString()}</td>
                    <td className="px-4 py-3 text-center">
                      <StatusBadge status={b.payment_status} />
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        b.booking_status === "confirmed" ? "bg-green-100 text-green-700" :
                        b.booking_status === "cancelled" ? "bg-red-100 text-red-700" :
                        "bg-gray-100 text-gray-600"
                      }`}>
                        {b.booking_status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {data.bookings.length === 0 && (
            <div className="text-center py-10 text-gray-400">No bookings yet.</div>
          )}
        </div>
      )}

      {/* Searches Tab */}
      {tab === "searches" && (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Route</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Departure</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Passengers</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Class</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Searched At</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {data.searches.map((s) => (
                  <tr key={s.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-semibold">{s.origin} → {s.destination}</td>
                    <td className="px-4 py-3 text-xs">{s.departure_date}</td>
                    <td className="px-4 py-3 text-xs">{String((s as Record<string, unknown>).passengers ?? "—")}</td>
                    <td className="px-4 py-3 text-xs capitalize">{String((s as Record<string, unknown>).cabin_class ?? "economy")}</td>
                    <td className="px-4 py-3 text-xs text-gray-500">{formatTime(s.created_at)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {data.searches.length === 0 && (
            <div className="text-center py-10 text-gray-400">No searches logged yet.</div>
          )}
        </div>
      )}
    </div>
  )
}

function StatCard({ icon, label, value, color }: { icon: React.ReactNode; label: string; value: string | number; color: string }) {
  const colorMap: Record<string, string> = {
    blue: "bg-blue-50 text-blue-600",
    cyan: "bg-cyan-50 text-cyan-600",
    green: "bg-green-50 text-green-600",
    emerald: "bg-emerald-50 text-emerald-600",
    yellow: "bg-yellow-50 text-yellow-600",
    purple: "bg-purple-50 text-purple-600",
  }
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4">
      <div className={`w-9 h-9 rounded-lg flex items-center justify-center mb-3 ${colorMap[color] || "bg-gray-50 text-gray-600"}`}>
        {icon}
      </div>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
      <p className="text-xs text-gray-500 mt-1">{label}</p>
    </div>
  )
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    paid: "bg-green-100 text-green-700",
    pending: "bg-yellow-100 text-yellow-700",
    failed: "bg-red-100 text-red-700",
    processing: "bg-blue-100 text-blue-700",
  }
  return (
    <span className={`text-xs px-2 py-1 rounded-full font-medium ${styles[status] || "bg-gray-100 text-gray-600"}`}>
      {status || "unknown"}
    </span>
  )
}

function formatTime(iso: string): string {
  if (!iso) return "—"
  const d = new Date(iso)
  return d.toLocaleDateString("en-GB", { day: "2-digit", month: "short" }) + " " +
    d.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })
}
