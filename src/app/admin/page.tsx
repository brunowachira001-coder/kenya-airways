"use client"

import { useEffect, useState } from "react"
import { Fragment } from "react"
import { Users, Ticket, TrendingUp, Search, ChevronDown, ChevronUp, IndianRupee, User, Plane } from "lucide-react"

interface Client {
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
  passengers: {
    title: string
    firstName: string
    lastName: string
    dateOfBirth: string
    gender: string
    email: string
    phone: string
    nationality: string
    passportNumber: string
    passportExpiry: string
    specialMeal: string
    specialAssistance: string
  }[]
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
}

interface AdminData {
  summary: {
    totalVisitors: number
    totalBookings: number
    paidBookings: number
    totalRevenue: number
    totalSearches: number
    totalPassengers: number
    conversionRate: number
  }
  funnel: { step: number; label: string; count: number }[]
  clients: Client[]
  bookings: Record<string, unknown>[]
  searches: Record<string, unknown>[]
}

const FUNNEL_COLORS = [
  "bg-blue-500", "bg-blue-400", "bg-cyan-500", "bg-teal-500",
  "bg-green-500", "bg-yellow-500", "bg-orange-500", "bg-red-500",
]

const STEP_BADGES = [
  "bg-gray-100 text-gray-600", "bg-blue-100 text-blue-700",
  "bg-cyan-100 text-cyan-700", "bg-teal-100 text-teal-700",
  "bg-green-100 text-green-700", "bg-yellow-100 text-yellow-700",
  "bg-orange-100 text-orange-700", "bg-red-100 text-red-700",
]

const STEP_LABELS = ["Home", "Search", "Fare Select", "Extras", "Passengers", "Review", "Payment", "Confirmed"]

export default function AdminPage() {
  const [data, setData] = useState<AdminData | null>(null)
  const [loading, setLoading] = useState(true)
  const [days, setDays] = useState(30)
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [tab, setTab] = useState<"funnel" | "visitors" | "bookings" | "searches">("funnel")

  useEffect(() => {
    setLoading(true)
    fetch(`/api/admin?days=${days}`)
      .then((r) => r.json())
      .then((d) => { setData(d); setLoading(false) })
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
    return <div className="text-center py-20 text-gray-500">Failed to load admin data.</div>
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
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
        <StatCard icon={<Users className="w-5 h-5" />} label="Visitors" value={data.summary.totalVisitors} color="blue" />
        <StatCard icon={<Search className="w-5 h-5" />} label="Searches" value={data.summary.totalSearches} color="cyan" />
        <StatCard icon={<Ticket className="w-5 h-5" />} label="Bookings" value={data.summary.totalBookings} color="green" />
        <StatCard icon={<User className="w-5 h-5" />} label="Passengers" value={data.summary.totalPassengers} color="teal" />
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
              tab === t ? "border-[#ed1c24] text-[#ed1c24]" : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            {t.charAt(0).toUpperCase() + t.slice(1)}
            {t === "visitors" && <span className="ml-1.5 text-xs bg-gray-100 px-1.5 py-0.5 rounded-full">{data.clients.length}</span>}
            {t === "bookings" && <span className="ml-1.5 text-xs bg-gray-100 px-1.5 py-0.5 rounded-full">{data.summary.totalBookings}</span>}
            {t === "searches" && <span className="ml-1.5 text-xs bg-gray-100 px-1.5 py-0.5 rounded-full">{data.summary.totalSearches}</span>}
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
              const dropoffPct = i > 0 && data.funnel[i - 1].count > 0 ? Math.round((dropoff / data.funnel[i - 1].count) * 100) : 0
              return (
                <div key={f.step} className="flex items-center gap-4">
                  <div className="w-36 text-sm font-medium text-gray-700 text-right">{f.label}</div>
                  <div className="flex-1">
                    <div className="h-10 bg-gray-100 rounded-lg overflow-hidden">
                      <div className={`h-full ${FUNNEL_COLORS[i]} rounded-lg transition-all duration-500 flex items-center pl-3`} style={{ width: `${Math.max(pct, 3)}%` }}>
                        <span className="text-white text-sm font-semibold">{f.count}</span>
                      </div>
                    </div>
                  </div>
                  <div className="w-24 text-right">
                    {i > 0 && dropoff > 0 && <span className="text-xs text-red-500">-{dropoffPct}% drop</span>}
                    {i > 0 && dropoff === 0 && <span className="text-xs text-gray-400">—</span>}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Visitors / Clients Tab */}
      {tab === "visitors" && (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left px-4 py-3 font-medium text-gray-600 w-8"></th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Name / Email</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Route</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Journey</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Max Step</th>
                  <th className="text-right px-4 py-3 font-medium text-gray-600">Amount</th>
                  <th className="text-center px-4 py-3 font-medium text-gray-600">Payment</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {data.clients.map((c) => {
                  const isExpanded = expandedId === c.id
                  const hasBooking = c.bookingRef !== ""
                  return (
                    <Fragment key={c.id}>
                      <tr
                        className={`hover:bg-gray-50 cursor-pointer ${hasBooking ? "" : "opacity-70"}`}
                        onClick={() => setExpandedId(isExpanded ? null : c.id)}
                      >
                        <td className="px-4 py-3">
                          {isExpanded ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
                        </td>
                        <td className="px-4 py-3">
                          <div>
                            <p className="font-medium">{c.name}</p>
                            <p className="text-xs text-gray-500">{c.email || "No email"}</p>
                            {c.phone && <p className="text-xs text-gray-400">{c.phone}</p>}
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          {c.route ? (
                            <div className="flex items-center gap-1.5">
                              <Plane className="w-3.5 h-3.5 text-gray-400" />
                              <span className="font-medium">{c.route}</span>
                            </div>
                          ) : <span className="text-gray-400">—</span>}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex flex-wrap gap-1">
                            {c.stepsReached.slice(0, 5).map((p) => (
                              <span key={p} className="text-[10px] bg-gray-100 px-1.5 py-0.5 rounded">{p}</span>
                            ))}
                            {c.stepsReached.length > 5 && (
                              <span className="text-[10px] text-gray-400">+{c.stepsReached.length - 5}</span>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`text-xs px-2 py-1 rounded-full font-medium ${STEP_BADGES[c.maxStep] || STEP_BADGES[0]}`}>
                            {STEP_LABELS[c.maxStep] || `Step ${c.maxStep}`}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-right font-semibold">
                          {c.totalAmount > 0 ? `KES ${c.totalAmount.toLocaleString()}` : "—"}
                        </td>
                        <td className="px-4 py-3 text-center">
                          <StatusBadge status={c.paymentStatus} />
                        </td>
                        <td className="px-4 py-3 text-gray-500 text-xs">{formatTime(c.createdAt)}</td>
                      </tr>

                      {/* Expanded Details */}
                      {isExpanded && (
                        <tr>
                          <td colSpan={8} className="px-6 py-4 bg-gray-50 border-t">
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                              {/* Left: Booking Details */}
                              <div className="space-y-4">
                                <h4 className="font-semibold text-sm text-gray-700 flex items-center gap-2">
                                  <Ticket className="w-4 h-4" /> Booking Details
                                </h4>
                                {hasBooking ? (
                                  <div className="bg-white rounded-lg border border-gray-200 p-4 space-y-2 text-sm">
                                    <DetailRow label="Reference" value={c.bookingRef} />
                                    <DetailRow label="Route" value={c.route} />
                                    <DetailRow label="Trip Type" value={c.tripType} />
                                    <DetailRow label="Cabin Class" value={c.cabinClass} />
                                    <DetailRow label="Departure" value={c.departureDate} />
                                    {c.returnDate && <DetailRow label="Return" value={c.returnDate} />}
                                    <div className="border-t pt-2 mt-2">
                                      <DetailRow label="Base Fare" value={`KES ${c.baseFare.toLocaleString()}`} />
                                      <DetailRow label="Taxes" value={`KES ${c.taxes.toLocaleString()}`} />
                                      <DetailRow label="Total" value={`KES ${c.totalAmount.toLocaleString()}`} bold />
                                    </div>
                                    {c.paymentRef && <DetailRow label="Payment Ref" value={c.paymentRef} />}
                                    {c.mpesaReceipt && <DetailRow label="M-Pesa Receipt" value={c.mpesaReceipt} />}
                                    {c.extras && (
                                      <div className="border-t pt-2 mt-2">
                                        <p className="text-xs text-gray-500 mb-1">Extras:</p>
                                        <pre className="text-[10px] text-gray-500 bg-gray-50 p-2 rounded overflow-x-auto">
                                          {JSON.stringify(c.extras, null, 2)}
                                        </pre>
                                      </div>
                                    )}
                                  </div>
                                ) : (
                                  <div className="bg-white rounded-lg border border-gray-200 p-4 text-sm text-gray-400">
                                    No booking — visitor only browsed the site
                                  </div>
                                )}
                              </div>

                              {/* Right: Passenger Details */}
                              <div className="space-y-4">
                                <h4 className="font-semibold text-sm text-gray-700 flex items-center gap-2">
                                  <User className="w-4 h-4" /> Passenger Details ({c.passengers.length})
                                </h4>
                                {c.passengers.length > 0 ? (
                                  c.passengers.map((p, i) => (
                                    <div key={i} className="bg-white rounded-lg border border-gray-200 p-4 space-y-1.5 text-sm">
                                      <p className="font-medium">{p.title} {p.firstName} {p.lastName}</p>
                                      {p.gender && <DetailRow label="Gender" value={p.gender} />}
                                      {p.dateOfBirth && <DetailRow label="DOB" value={p.dateOfBirth} />}
                                      {p.nationality && <DetailRow label="Nationality" value={p.nationality} />}
                                      {p.email && <DetailRow label="Email" value={p.email} />}
                                      {p.phone && <DetailRow label="Phone" value={p.phone} />}
                                      {p.passportNumber && <DetailRow label="Passport" value={p.passportNumber} />}
                                      {p.passportExpiry && <DetailRow label="Passport Expiry" value={p.passportExpiry} />}
                                      {p.specialMeal && <DetailRow label="Special Meal" value={p.specialMeal} />}
                                      {p.specialAssistance && <DetailRow label="Special Assistance" value={p.specialAssistance} />}
                                    </div>
                                  ))
                                ) : (
                                  <div className="bg-white rounded-lg border border-gray-200 p-4 text-sm text-gray-400">
                                    No passenger details recorded
                                  </div>
                                )}
                              </div>
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
          {data.clients.length === 0 && (
            <div className="text-center py-10 text-gray-400">No data yet.</div>
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
                {data.bookings.map((b: Record<string, unknown>) => (
                  <tr key={String(b.id)} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-mono text-xs font-semibold">{String(b.booking_reference)}</td>
                    <td className="px-4 py-3">{String(b.passenger_name)}</td>
                    <td className="px-4 py-3">{String(b.origin)} → {String(b.destination)}</td>
                    <td className="px-4 py-3 text-xs text-gray-500">{String(b.departure_date)}</td>
                    <td className="px-4 py-3 text-xs">{String(b.cabin_class)}</td>
                    <td className="px-4 py-3 text-right font-semibold">KES {Number(b.total_amount || 0).toLocaleString()}</td>
                    <td className="px-4 py-3 text-center"><StatusBadge status={String(b.payment_status)} /></td>
                    <td className="px-4 py-3 text-center">
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        b.booking_status === "confirmed" ? "bg-green-100 text-green-700" :
                        b.booking_status === "cancelled" ? "bg-red-100 text-red-700" :
                        "bg-gray-100 text-gray-600"
                      }`}>{String(b.booking_status)}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
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
                {data.searches.map((s: Record<string, unknown>) => (
                  <tr key={String(s.id)} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-semibold">{String(s.origin)} → {String(s.destination)}</td>
                    <td className="px-4 py-3 text-xs">{String(s.departure_date)}</td>
                    <td className="px-4 py-3 text-xs">{String(s.passengers ?? "—")}</td>
                    <td className="px-4 py-3 text-xs capitalize">{String(s.cabin_class ?? "economy")}</td>
                    <td className="px-4 py-3 text-xs text-gray-500">{formatTime(String(s.created_at))}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {data.searches.length === 0 && <div className="text-center py-10 text-gray-400">No searches logged yet.</div>}
        </div>
      )}
    </div>
  )
}

function DetailRow({ label, value, bold }: { label: string; value: string; bold?: boolean }) {
  return (
    <div className="flex justify-between">
      <span className="text-gray-500">{label}</span>
      <span className={bold ? "font-bold" : ""}>{value}</span>
    </div>
  )
}

function StatCard({ icon, label, value, color }: { icon: React.ReactNode; label: string; value: string | number; color: string }) {
  const colorMap: Record<string, string> = {
    blue: "bg-blue-50 text-blue-600", cyan: "bg-cyan-50 text-cyan-600",
    green: "bg-green-50 text-green-600", emerald: "bg-emerald-50 text-emerald-600",
    yellow: "bg-yellow-50 text-yellow-600", purple: "bg-purple-50 text-purple-600",
    teal: "bg-teal-50 text-teal-600",
  }
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-3">
      <div className={`w-8 h-8 rounded-lg flex items-center justify-center mb-2 ${colorMap[color] || "bg-gray-50 text-gray-600"}`}>{icon}</div>
      <p className="text-xl font-bold text-gray-900">{value}</p>
      <p className="text-[10px] text-gray-500 mt-0.5">{label}</p>
    </div>
  )
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    paid: "bg-green-100 text-green-700", pending: "bg-yellow-100 text-yellow-700",
    failed: "bg-red-100 text-red-700", processing: "bg-blue-100 text-blue-700",
    none: "bg-gray-50 text-gray-400",
  }
  return <span className={`text-xs px-2 py-1 rounded-full font-medium ${styles[status] || "bg-gray-100 text-gray-600"}`}>{status}</span>
}

function formatTime(iso: string): string {
  if (!iso) return "—"
  const d = new Date(iso)
  return d.toLocaleDateString("en-GB", { day: "2-digit", month: "short" }) + " " + d.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })
}
