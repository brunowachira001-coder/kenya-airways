"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ChevronDown, ShoppingCart, ArrowUpRight, RefreshCw, PenSquare, Briefcase, Coffee, Award, SlidersHorizontal } from "lucide-react"

const DATES = [
  { day: "Sun 14", price: "24,485", active: false },
  { day: "Mon 15", price: "18,740", active: false },
  { day: "Tue 16", price: "14,825", active: false },
  { day: "Wed 17", price: "8,305", active: true },
  { day: "Thu 18", price: "9,475", active: false },
  { day: "Fri 19", price: "8,960", active: false },
  { day: "Sat 20", price: "8,960", active: false },
]

const FLIGHTS = [
  { id: 1, dep: "07:40", arr: "09:05", dur: "1h 25min", nextDay: false, depTerminal: "1A", arrTerminal: "3", ecoPrice: "8,305", ecoOld: "13,260", ecoSeats: 2, bizPrice: "25,655", bizSeats: 1 },
  { id: 2, dep: "13:20", arr: "14:45", dur: "1h 25min", nextDay: false, depTerminal: "1A", arrTerminal: "3", ecoPrice: "9,475", ecoOld: "13,260", ecoSeats: 6, bizPrice: "24,090", bizSeats: 7 },
  { id: 3, dep: "19:10", arr: "20:35", dur: "1h 25min", nextDay: false, depTerminal: "1A", arrTerminal: "3", ecoPrice: "8,305", ecoOld: "13,260", ecoSeats: 0, bizPrice: "25,655", bizSeats: 3 },
  { id: 4, dep: "23:59", arr: "01:24", dur: "1h 25min", nextDay: true, depTerminal: "1A", arrTerminal: "3", ecoPrice: "8,305", ecoOld: null, ecoSeats: 4, bizPrice: "24,090", bizSeats: 2 },
]

function FareTiers({ flight, cls, onSelect }: { flight: typeof FLIGHTS[0]; cls: "economy" | "business"; onSelect: () => void }) {
  const base = parseInt((cls === "economy" ? flight.ecoPrice : flight.bizPrice).replace(",", ""))
  const tiers = [
    { label: cls === "economy" ? "Best Buy" : "Business Saver", delta: 0, refund: "Not allowed", rebook: "KES 6,525/pax", recommended: false },
    { label: cls === "economy" ? "Economy Standard" : "Business Standard", delta: 3395, refund: "Not allowed", rebook: "KES 6,525/pax", recommended: true },
    { label: cls === "economy" ? "Economy Flex" : "Business Flex", delta: 19575, refund: "KES 13,050 penalty", rebook: "Changeable", recommended: false },
    { label: cls === "economy" ? "Economy Super Flex" : "Business Super Flex", delta: 49715, refund: "Allowed", rebook: "Allowed", recommended: false },
  ]
  return (
    <div className="bg-[#f2f2f2] border-t border-gray-200 p-3 sm:p-5 overflow-x-auto">
      <div className="flex gap-3 min-w-max sm:min-w-0">
        {tiers.map((t, i) => (
          <div key={i} className={`w-44 sm:w-auto sm:flex-1 bg-white rounded shadow-sm flex flex-col relative py-4 px-3 ${t.recommended ? "border-2 border-[#0d0d0d] -my-0.5" : ""}`}>
            {t.recommended && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#ed1c24] text-white text-[9px] font-bold px-2 py-0.5 rounded shadow whitespace-nowrap z-10">Recommended</div>
            )}
            <p className="text-base sm:text-xl font-bold text-center text-[#0d0d0d] mb-0.5">KES {(base + t.delta).toLocaleString()}</p>
            <p className="text-[10px] text-gray-500 text-center mb-3">{t.label}</p>
            <div className="flex flex-col gap-3 text-[10px] text-gray-500 flex-1">
              {[
                [<RefreshCw key="r" className="w-3 h-3 text-gray-400" />, "Refund", t.refund],
                [<PenSquare key="p" className="w-3 h-3 text-gray-400" />, "Rebook", t.rebook],
                [<Briefcase key="b" className="w-3 h-3 text-gray-400" />, "Baggage", "2 × 23 kg"],
                [<Coffee key="c" className="w-3 h-3 text-gray-400" />, "Lounge", "Chargeable"],
                [<Award key="a" className="w-3 h-3 text-gray-400" />, "Points", "50–125%"],
              ].map(([icon, label, val], j) => (
                <div key={j}>
                  <p className="font-bold text-[#0d0d0d] flex items-center gap-1.5 mb-0.5">{icon} {label as string}</p>
                  <p className="pl-4 text-gray-500">{val as string}</p>
                </div>
              ))}
            </div>
            <button
              onClick={onSelect}
              className={`w-full mt-4 py-2 font-bold text-xs rounded-lg ${t.recommended ? "bg-[#ed1c24] text-white hover:bg-[#d61920]" : "border border-gray-300 text-[#0d0d0d] hover:border-[#0d0d0d] bg-white"}`}
            >
              Select
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function SearchPage() {
  const router = useRouter()
  const [expanded, setExpanded] = useState<{ id: number; cls: "economy" | "business" } | null>(null)

  const toggle = (id: number, cls: "economy" | "business") =>
    setExpanded(prev => prev?.id === id && prev.cls === cls ? null : { id, cls })

  return (
    <div className="min-h-screen bg-[#f8f8f8] font-sans overflow-x-hidden">

      {/* ── Top route header ── */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-30 shadow-sm">
        <div className="max-w-[1100px] mx-auto px-4 py-3 flex flex-wrap items-center gap-x-4 gap-y-2">

          {/* Route NBO → MBA */}
          <div className="flex items-center gap-2 min-w-0">
            <div>
              <div className="flex items-center gap-1.5 font-extrabold text-base tracking-tight text-[#0d0d0d] leading-none">
                <span>NBO</span>
                <svg className="w-3.5 h-3.5 text-[#ed1c24]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M14 6l6 6-6 6" /></svg>
                <span>MBA</span>
              </div>
              <div className="flex gap-4 text-[10px] text-gray-400 font-medium mt-0.5">
                <span>Nairobi</span><span>Mombasa</span>
              </div>
            </div>
          </div>

          {/* Date + pax */}
          <div className="flex items-center gap-3 text-xs font-medium text-gray-700">
            <span>Wed, 17 Jun</span>
            <span className="text-gray-300">|</span>
            <span>Mon, 22 Jun</span>
            <span className="text-gray-300">|</span>
            <span className="flex items-center gap-1">
              <svg className="w-3.5 h-3.5 text-gray-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
              1 Passenger
            </span>
          </div>

          {/* Right: cart + modify */}
          <div className="flex items-center gap-3 ml-auto">
            <Link href="/booking/fare-select" className="flex items-center gap-1.5 text-xs font-semibold text-[#0d0d0d] hover:text-[#ed1c24] transition-colors">
              <ShoppingCart className="w-4 h-4" />
              <span className="hidden sm:inline">Your booking</span>
            </Link>
            <button className="bg-white border border-gray-300 rounded-full px-3 py-1.5 text-[11px] font-semibold flex items-center gap-1 hover:bg-gray-50 text-gray-700 shadow-sm">
              Modify <ChevronDown className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-[1100px] mx-auto w-full px-4 pt-5 pb-16">

        {/* ── Title + Currency ── */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-5">
          <div>
            <h1 className="font-serif italic text-2xl sm:text-[32px] font-bold text-[#0d0d0d] leading-tight">Please select your departure</h1>
            <p className="text-gray-500 text-sm font-medium mt-1 flex items-center gap-1.5">
              Nairobi <svg className="w-3 h-3 text-[#ed1c24]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M14 6l6 6-6 6"/></svg> Mombasa
            </p>
          </div>
          <div className="border border-gray-300 rounded-md bg-white px-4 py-2 w-full sm:w-56 cursor-pointer shadow-sm hover:border-gray-400 flex-shrink-0">
            <span className="text-[10px] text-gray-400 block mb-0.5">Preferred currency</span>
            <div className="flex justify-between items-center text-sm font-bold text-[#0d0d0d]">
              KES – Kenyan Shilling <ChevronDown className="w-4 h-4 text-gray-400" />
            </div>
          </div>
        </div>

        {/* ── Date Carousel ── */}
        <div className="-mx-4 sm:mx-0 mb-5">
          <div className="flex overflow-x-auto scrollbar-hide border-b border-gray-200">
            {DATES.map((d, i) => (
              <div
                key={i}
                className={`flex-shrink-0 flex-1 min-w-[80px] text-center py-3 cursor-pointer transition-colors border-b-[3px] ${d.active ? "border-[#ed1c24] bg-white" : "border-transparent hover:bg-gray-50"}`}
              >
                <div className={`text-xs font-semibold mb-0.5 ${d.active ? "text-[#ed1c24]" : "text-gray-700"}`}>{d.day}</div>
                <div className={`text-[11px] ${d.active ? "font-bold text-[#ed1c24]" : "text-gray-400"}`}>KES {d.price}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Filters & Sort ── */}
        <div className="flex items-center justify-between mb-4">
          <button className="bg-white border border-gray-300 shadow-sm rounded-lg px-4 py-2 flex items-center gap-2 text-sm font-semibold hover:bg-gray-50 text-[#0d0d0d]">
            <SlidersHorizontal className="w-4 h-4" /> Filters
          </button>
          <div className="flex items-center gap-1 text-sm">
            <span className="text-gray-500 font-medium">Sort by</span>
            <button className="font-bold text-[#0d0d0d] flex items-center gap-1 hover:text-[#ed1c24]">
              Cheapest <ChevronDown className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* ── Flight Cards ── */}
        <div className="flex flex-col gap-3">
          {FLIGHTS.map((f) => (
            <div key={f.id} className="bg-white rounded-xl shadow-sm overflow-hidden border border-[#e8e8e8]">

              {/* Card row: stacks mobile, side-by-side desktop */}
              <div className="flex flex-col sm:flex-row">

                {/* Flight info */}
                <div className="flex-1 px-4 py-4 sm:px-6 sm:py-5">

                  {/* Times */}
                  <div className="flex items-center gap-0 mb-1.5">
                    <span className="text-[28px] sm:text-[32px] font-extrabold text-[#0d0d0d] tabular-nums leading-none">{f.dep}</span>
                    <div className="flex-1 flex flex-col items-center mx-3">
                      <span className="text-[10px] text-gray-400 uppercase font-semibold tracking-widest mb-1">nonstop</span>
                      <div className="w-full flex items-center gap-1">
                        <div className="flex-1 h-px bg-gray-300" />
                        <svg className="w-3 h-3 text-gray-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M14 6l6 6-6 6"/></svg>
                      </div>
                    </div>
                    <span className="text-[28px] sm:text-[32px] font-extrabold text-[#0d0d0d] tabular-nums leading-none relative">
                      {f.arr}
                      {f.nextDay && <sup className="text-[11px] text-gray-500 font-normal ml-0.5">+1</sup>}
                    </span>
                  </div>

                  {/* Airport codes */}
                  <div className="flex justify-between text-xs font-bold text-[#0d0d0d] mb-0.5">
                    <span>NBO</span><span>MBA</span>
                  </div>
                  {/* Terminals */}
                  <div className="flex justify-between text-[10px] text-gray-400 mb-3">
                    <span>Terminal {f.depTerminal}</span><span>Terminal {f.arrTerminal}</span>
                  </div>

                  {/* Duration + operator */}
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-gray-500 border-t border-gray-100 pt-2.5">
                    <span className="font-medium">Duration {f.dur}</span>
                    <span className="flex items-center gap-1">
                      Operated by Kenya Airways
                      <span className="text-[#ed1c24] border border-[#ed1c24] rounded-full w-3.5 h-3.5 flex items-center justify-center font-black text-[8px] italic">K</span>
                    </span>
                  </div>

                  {/* Itinerary link */}
                  <button className="mt-2 text-[11px] font-semibold text-[#0d0d0d] underline decoration-1 underline-offset-2 flex items-center gap-1 hover:text-[#ed1c24] transition-colors">
                    View your itinerary details <ArrowUpRight className="w-3 h-3" />
                  </button>
                </div>

                {/* Price columns */}
                <div className="flex border-t sm:border-t-0 sm:border-l border-gray-100 sm:w-[280px]">

                  {/* Economy */}
                  <button
                    onClick={() => toggle(f.id, "economy")}
                    className={`flex-1 p-3 sm:p-4 flex flex-col justify-center items-center relative border-r border-gray-100 transition-colors ${expanded?.id === f.id && expanded.cls === "economy" ? "bg-[#e5e5e5]" : "bg-[#f4f4f4] hover:bg-[#ebebeb]"}`}
                  >
                    {f.ecoSeats > 0 && f.ecoSeats <= 6 && (
                      <div className="absolute top-0 inset-x-0 flex justify-center">
                        <span className="bg-[#ed1c24] text-white text-[9px] font-bold px-2 py-0.5 rounded-b shadow-sm">
                          {f.ecoSeats} seat{f.ecoSeats > 1 ? "s" : ""} left
                        </span>
                      </div>
                    )}
                    <span className="font-bold text-[11px] text-[#0d0d0d] mt-3">Economy</span>
                    <span className="text-[10px] text-gray-400">from</span>
                    <div className="flex flex-col items-center mt-0.5">
                      {f.ecoOld && <span className="text-[10px] text-gray-400 line-through">KES {f.ecoOld}</span>}
                      <span className="text-base font-extrabold text-[#ed1c24]">KES {f.ecoPrice}</span>
                    </div>
                    <ChevronDown className={`w-4 h-4 text-gray-400 mt-1 transition-transform duration-200 ${expanded?.id === f.id && expanded.cls === "economy" ? "rotate-180" : ""}`} />
                  </button>

                  {/* Business */}
                  <button
                    onClick={() => toggle(f.id, "business")}
                    className={`flex-1 p-3 sm:p-4 flex flex-col justify-center items-center relative transition-colors ${expanded?.id === f.id && expanded.cls === "business" ? "bg-[#e8ddd0]" : "bg-[#f5ede2] hover:bg-[#ecddd0]"}`}
                  >
                    {f.bizSeats > 0 && f.bizSeats <= 7 && (
                      <div className="absolute top-0 inset-x-0 flex justify-center">
                        <span className="bg-[#ed1c24] text-white text-[9px] font-bold px-2 py-0.5 rounded-b shadow-sm">
                          {f.bizSeats} seat{f.bizSeats > 1 ? "s" : ""} left
                        </span>
                      </div>
                    )}
                    <span className="font-bold text-[11px] text-[#0d0d0d] mt-3">Business</span>
                    <span className="text-[10px] text-gray-400">from</span>
                    <div className="flex flex-col items-center mt-0.5">
                      <span className="text-base font-extrabold text-[#0d0d0d]">KES {f.bizPrice}</span>
                    </div>
                    <ChevronDown className={`w-4 h-4 text-gray-400 mt-1 transition-transform duration-200 ${expanded?.id === f.id && expanded.cls === "business" ? "rotate-180" : ""}`} />
                  </button>
                </div>
              </div>

              {/* Expandable fare panel */}
              {expanded?.id === f.id && (
                <FareTiers flight={f} cls={expanded.cls} onSelect={() => router.push("/booking/passengers")} />
              )}
            </div>
          ))}
        </div>

        <Link href="/">
          <button className="mt-8 border border-gray-300 rounded-lg px-6 py-2.5 bg-white font-semibold text-sm hover:bg-gray-50 shadow-sm">← Back</button>
        </Link>
      </div>

      {/* ── Footer banner ── */}
      <div className="bg-[#0d0d0d] w-full pt-8 pb-6 px-4 border-t-[6px] border-[#ed1c24]">
        <div className="max-w-[1000px] mx-auto flex flex-col gap-6">
          <div className="flex flex-wrap justify-center gap-4 sm:gap-8 text-sm text-white font-semibold">
            {["Loyalty Program", "Travel Requirements", "Special Assistance", "Contact Us"].map(l => (
              <span key={l} className="hover:text-gray-300 cursor-pointer transition-colors">{l}</span>
            ))}
          </div>
          <div className="flex justify-center items-center gap-4 opacity-60">
            {[["amex", "Amex", "h-6"], ["visa", "Visa", "h-5"], ["mastercard", "Mastercard", "h-6"], ["paypal", "PayPal", "h-6"]].map(([k, a, h]) => (
              <div key={k} className="bg-white rounded px-2 py-1">
                <img src={`/${k}.png`} alt={a} className={`${h} w-auto object-contain`} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
