"use client"

import { useState, useEffect, Suspense } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import {
  ChevronDown,
  ShoppingCart,
  RefreshCw,
  PenSquare,
  Briefcase,
  Coffee,
  Award,
  SlidersHorizontal,
  Plane,
  Loader2,
  AlertCircle,
  SearchX,
  ArrowLeft,
} from "lucide-react"
import { useBookingStore } from "@/store/booking-store"
import { getAirport } from "@/lib/airports"
import type { Flight } from "@/lib/flights"

function FareTiers({
  flight,
  cls,
  onSelect,
}: {
  flight: Flight;
  cls: "economy" | "business";
  onSelect: (tierIndex: number) => void;
}) {
  const basePrice = cls === "economy" ? flight.economyPrice : flight.businessPrice;
  const tiers = [
    { label: cls === "economy" ? "Best Buy" : "Business Saver", multiplier: 1.0, refund: "Not allowed", rebook: "Fee applies", recommended: false },
    { label: cls === "economy" ? "Economy Standard" : "Business Standard", multiplier: 1.15, refund: "Not allowed", rebook: "Fee applies", recommended: true },
    { label: cls === "economy" ? "Economy Flex" : "Business Flex", multiplier: 1.35, refund: "Fee applies", rebook: "Changeable", recommended: false },
    { label: cls === "economy" ? "Economy Super Flex" : "Business Super Flex", multiplier: 1.6, refund: "Allowed", rebook: "Allowed", recommended: false },
  ];
  return (
    <div className="bg-[#f2f2f2] border-t border-gray-200 p-3 sm:p-5 overflow-x-auto">
      <div className="flex gap-3 min-w-max sm:min-w-0">
        {tiers.map((t, i) => (
          <div
            key={i}
            className={`w-44 sm:w-auto sm:flex-1 bg-white rounded shadow-sm flex flex-col relative py-4 px-3 ${
              t.recommended ? "border-2 border-[#0d0d0d] -my-0.5" : ""
            }`}
          >
            {t.recommended && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#ed1c24] text-white text-[9px] font-bold px-2 py-0.5 rounded shadow whitespace-nowrap z-10">
                Recommended
              </div>
            )}
            <p className="text-base sm:text-xl font-bold text-center text-[#0d0d0d] mb-0.5">
              KES {Math.round(basePrice * t.multiplier).toLocaleString()}
            </p>
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
                  <p className="font-bold text-[#0d0d0d] flex items-center gap-1.5 mb-0.5">
                    {icon} {label as string}
                  </p>
                  <p className="pl-4 text-gray-500">{val as string}</p>
                </div>
              ))}
            </div>
            <button
              onClick={() => onSelect(i)}
              className={`w-full mt-4 py-2 font-bold text-xs rounded-lg ${
                t.recommended
                  ? "bg-[#ed1c24] text-white hover:bg-[#d61920]"
                  : "border border-gray-300 text-[#0d0d0d] hover:border-[#0d0d0d] bg-white"
              }`}
            >
              Select
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Reusable flight list ─────────────────────────────────────────────────────
function FlightList({
  flights,
  loading,
  error,
  expanded,
  onToggle,
  onSelect,
}: {
  flights: Flight[];
  loading: boolean;
  error: string | null;
  expanded: { id: string; cls: "economy" | "business" } | null;
  onToggle: (id: string, cls: "economy" | "business") => void;
  onSelect: (flight: Flight, tier: "economy" | "business", tierIndex: number) => void;
}) {
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-4">
        <Loader2 className="w-10 h-10 text-[#ed1c24] animate-spin" />
        <p className="text-gray-500 text-sm font-medium">Finding the best flights for you...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-16 gap-4 bg-white rounded-xl border border-gray-200">
        <AlertCircle className="w-12 h-12 text-red-400" />
        <p className="text-gray-700 font-semibold text-lg">Something went wrong</p>
        <p className="text-gray-500 text-sm">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-2 bg-[#ed1c24] text-white px-6 py-2.5 rounded-lg font-semibold text-sm hover:bg-[#d61920] transition-colors"
        >
          Try again
        </button>
      </div>
    );
  }

  if (flights.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <SearchX className="w-14 h-14 text-gray-300" />
        <p className="text-gray-600 font-semibold text-lg">No flights available</p>
        <p className="text-gray-400 text-sm text-center max-w-md">
          We couldn&apos;t find any flights on this route for the selected date. Try a different date or
          check your route selection.
        </p>
        <Link href="/">
          <button className="mt-2 bg-[#ed1c24] text-white px-6 py-2.5 rounded-lg font-semibold text-sm hover:bg-[#d61920] transition-colors">
            Modify search
          </button>
        </Link>
      </div>
    );
  }

  return (
    <>
      {/* Filters & Sort */}
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

      {/* Flight Cards */}
      <div className="flex flex-col gap-3">
        {flights.map(flight => (
          <div key={flight.id} className="bg-white rounded-xl shadow-sm overflow-hidden border border-[#e8e8e8]">
            <div className="flex flex-col sm:flex-row">
              {/* Flight info */}
              <div className="flex-1 px-4 py-4 sm:px-6 sm:py-5">
                <div className="flex items-center gap-0 mb-1.5">
                  <span className="text-[28px] sm:text-[32px] font-extrabold text-[#0d0d0d] tabular-nums leading-none">
                    {flight.departureTime}
                  </span>
                  <div className="flex-1 flex flex-col items-center mx-3">
                    <span className="text-[10px] text-gray-400 uppercase font-semibold tracking-widest mb-1">
                      {flight.stops === 0 ? "nonstop" : `${flight.stops} stop`}
                    </span>
                    <div className="w-full flex items-center gap-1">
                      <div className="flex-1 h-px bg-gray-300" />
                      <Plane className="w-3 h-3 text-gray-400 flex-shrink-0" />
                      <div className="flex-1 h-px bg-gray-300" />
                    </div>
                  </div>
                  <span className="text-[28px] sm:text-[32px] font-extrabold text-[#0d0d0d] tabular-nums leading-none">
                    {flight.arrivalTime}
                  </span>
                </div>
                <div className="flex justify-between text-xs font-bold text-[#0d0d0d] mb-0.5">
                  <span>{flight.origin}</span>
                  <span>{flight.destination}</span>
                </div>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-gray-500 border-t border-gray-100 pt-2.5">
                  <span className="font-medium">Duration {flight.duration}</span>
                  <span className="flex items-center gap-1">
                    {flight.airline}
                    <span className="text-[#ed1c24] border border-[#ed1c24] rounded-full w-3.5 h-3.5 flex items-center justify-center font-black text-[8px] italic">
                      K
                    </span>
                  </span>
                  <span>{flight.aircraft}</span>
                </div>
                <p className="text-[10px] text-gray-400 mt-1">{flight.flightNumber}</p>
              </div>

              {/* Price columns */}
              <div className="flex border-t sm:border-t-0 sm:border-l border-gray-100 sm:w-[280px]">
                <button
                  onClick={() => onToggle(flight.id, "economy")}
                  className={`flex-1 p-3 sm:p-4 flex flex-col justify-center items-center relative border-r border-gray-100 transition-colors ${
                    expanded?.id === flight.id && expanded.cls === "economy"
                      ? "bg-[#e5e5e5]"
                      : "bg-[#f4f4f4] hover:bg-[#ebebeb]"
                  }`}
                >
                  <span className="font-bold text-[11px] text-[#0d0d0d] mt-3">Economy</span>
                  <span className="text-[10px] text-gray-400">from</span>
                  <span className="text-base font-extrabold text-[#ed1c24]">
                    KES {flight.economyPrice.toLocaleString()}
                  </span>
                  <ChevronDown className={`w-4 h-4 text-gray-400 mt-1 transition-transform duration-200 ${expanded?.id === flight.id && expanded.cls === "economy" ? "rotate-180" : ""}`} />
                </button>
                <button
                  onClick={() => onToggle(flight.id, "business")}
                  className={`flex-1 p-3 sm:p-4 flex flex-col justify-center items-center relative transition-colors ${
                    expanded?.id === flight.id && expanded.cls === "business"
                      ? "bg-[#e8ddd0]"
                      : "bg-[#f5ede2] hover:bg-[#ecddd0]"
                  }`}
                >
                  <span className="font-bold text-[11px] text-[#0d0d0d] mt-3">Business</span>
                  <span className="text-[10px] text-gray-400">from</span>
                  <span className="text-base font-extrabold text-[#0d0d0d]">
                    KES {flight.businessPrice.toLocaleString()}
                  </span>
                  <ChevronDown className={`w-4 h-4 text-gray-400 mt-1 transition-transform duration-200 ${expanded?.id === flight.id && expanded.cls === "business" ? "rotate-180" : ""}`} />
                </button>
              </div>
            </div>

            {/* Expandable fare tiers */}
            {expanded?.id === flight.id && (
              <FareTiers
                flight={flight}
                cls={expanded.cls}
                onSelect={(tierIndex) => onSelect(flight, expanded.cls, tierIndex)}
              />
            )}
          </div>
        ))}
      </div>
    </>
  );
}

// ── Main search content ───────────────────────────────────────────────────────
function SearchContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const origin = searchParams.get("from") || "";
  const destination = searchParams.get("to") || "";
  const departDate = searchParams.get("depart") || "";
  const returnDate = searchParams.get("return") || "";
  const adults = parseInt(searchParams.get("adults") || "1");
  const isRoundTrip = !!returnDate;

  const { setSelectedOutboundFlight, setSelectedReturnFlight } = useBookingStore();

  // Outbound flights state
  const [flights, setFlights] = useState<Flight[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedOut, setExpandedOut] = useState<{ id: string; cls: "economy" | "business" } | null>(null);

  // Return flights state (round-trip only)
  const [returnFlights, setReturnFlights] = useState<Flight[]>([]);
  const [returnLoading, setReturnLoading] = useState(false);
  const [returnError, setReturnError] = useState<string | null>(null);
  const [expandedRet, setExpandedRet] = useState<{ id: string; cls: "economy" | "business" } | null>(null);

  // Two-step state: "outbound" | "return"
  const [step, setStep] = useState<"outbound" | "return">("outbound");
  const [pendingOutbound, setPendingOutbound] = useState<{ flight: Flight; tier: "economy" | "business"; price: number } | null>(null);

  const formatDate = (dateStr: string) => {
    if (!dateStr) return "";
    const d = new Date(dateStr + "T00:00:00");
    return d.toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short" });
  };

  const originAirport = getAirport(origin);
  const destAirport = getAirport(destination);

  // Fetch outbound flights
  useEffect(() => {
    if (!origin || !destination) { setLoading(false); return; }
    const fetchFlights = async () => {
      setLoading(true); setError(null); setFlights([]);
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);
      try {
        const url = `/api/flights/search?from=${encodeURIComponent(origin)}&to=${encodeURIComponent(destination)}&depart=${encodeURIComponent(departDate)}&adults=${encodeURIComponent(String(adults))}`;
        const res = await fetch(url, { signal: controller.signal });
        clearTimeout(timeoutId);
        if (!res.ok) { const d = await res.json(); throw new Error(d.error || "Failed to fetch flights"); }
        const data = await res.json();
        setFlights(data.flights || []);
      } catch (err) {
        clearTimeout(timeoutId);
        if (err instanceof Error && err.name === "AbortError") setError("Search is taking longer than expected. Please try again.");
        else setError(err instanceof Error ? err.message : "Something went wrong");
      } finally { setLoading(false); }
    };
    fetchFlights();
  }, [origin, destination, departDate, adults]);

  // Fetch return flights when entering return step
  useEffect(() => {
    if (step !== "return" || !isRoundTrip || !destination || !origin) return;
    const fetchReturn = async () => {
      setReturnLoading(true); setReturnError(null); setReturnFlights([]);
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);
      try {
        // Return leg: destination → origin on the return date
        const url = `/api/flights/search?from=${encodeURIComponent(destination)}&to=${encodeURIComponent(origin)}&depart=${encodeURIComponent(returnDate)}&adults=${encodeURIComponent(String(adults))}`;
        const res = await fetch(url, { signal: controller.signal });
        clearTimeout(timeoutId);
        if (!res.ok) { const d = await res.json(); throw new Error(d.error || "Failed to fetch return flights"); }
        const data = await res.json();
        setReturnFlights(data.flights || []);
      } catch (err) {
        clearTimeout(timeoutId);
        if (err instanceof Error && err.name === "AbortError") setReturnError("Search is taking longer than expected. Please try again.");
        else setReturnError(err instanceof Error ? err.message : "Something went wrong");
      } finally { setReturnLoading(false); }
    };
    fetchReturn();
  }, [step, isRoundTrip, origin, destination, returnDate, adults]);

  // User selects an outbound flight
  const handleOutboundSelect = (flight: Flight, tier: "economy" | "business", tierIndex: number) => {
    const basePrice = tier === "economy" ? flight.economyPrice : flight.businessPrice;
    const multipliers = [1.0, 1.15, 1.35, 1.6];
    const price = Math.round(basePrice * (multipliers[tierIndex] || 1.0));

    setSelectedOutboundFlight({ id: flight.id, class: tier, price });
    setSelectedReturnFlight(null);

    if (isRoundTrip) {
      // Show return flight picker before going to fare-select
      setPendingOutbound({ flight, tier, price });
      setStep("return");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      router.push("/booking/fare-select");
    }
  };

  // User selects a return flight
  const handleReturnSelect = (flight: Flight, tier: "economy" | "business", tierIndex: number) => {
    const basePrice = tier === "economy" ? flight.economyPrice : flight.businessPrice;
    const multipliers = [1.0, 1.15, 1.35, 1.6];
    const price = Math.round(basePrice * (multipliers[tierIndex] || 1.0));
    setSelectedReturnFlight({ id: flight.id, class: tier, price });
    router.push("/booking/fare-select");
  };

  const toggleOut = (id: string, cls: "economy" | "business") =>
    setExpandedOut(prev => (prev?.id === id && prev.cls === cls ? null : { id, cls }));

  const toggleRet = (id: string, cls: "economy" | "business") =>
    setExpandedRet(prev => (prev?.id === id && prev.cls === cls ? null : { id, cls }));

  return (
    <div className="min-h-screen bg-[#f8f8f8] font-sans overflow-x-hidden">
      {/* ── Top route header ── */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-30 shadow-sm">
        <div className="max-w-[1100px] mx-auto px-4 py-3 flex flex-wrap items-center gap-x-4 gap-y-2">
          <div className="flex items-center gap-2 min-w-0">
            <div>
              <div className="flex items-center gap-1.5 font-extrabold text-base tracking-tight text-[#0d0d0d] leading-none">
                <span>{origin || "---"}</span>
                <svg className="w-3.5 h-3.5 text-[#ed1c24]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M14 6l6 6-6 6" />
                </svg>
                <span>{destination || "---"}</span>
              </div>
              <div className="flex gap-4 text-[10px] text-gray-400 font-medium mt-0.5">
                <span>{originAirport?.city || origin}</span>
                <span>{destAirport?.city || destination}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 text-xs font-medium text-gray-700">
            <span>{departDate ? formatDate(departDate) : "No date"}</span>
            {returnDate && (
              <>
                <span className="text-gray-300">|</span>
                <span>{formatDate(returnDate)}</span>
              </>
            )}
            <span className="text-gray-300">|</span>
            <span className="flex items-center gap-1">
              <svg className="w-3.5 h-3.5 text-gray-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
              {adults} Passenger{adults !== 1 ? "s" : ""}
            </span>
          </div>

          <div className="flex items-center gap-3 ml-auto">
            <Link href="/booking/fare-select" className="flex items-center gap-1.5 text-xs font-semibold text-[#0d0d0d] hover:text-[#ed1c24] transition-colors">
              <ShoppingCart className="w-4 h-4" />
              <span className="hidden sm:inline">Your booking</span>
            </Link>
            <button
              onClick={() => router.back()}
              className="bg-white border border-gray-300 rounded-full px-3 py-1.5 text-[11px] font-semibold flex items-center gap-1 hover:bg-gray-50 text-gray-700 shadow-sm"
            >
              Modify <ChevronDown className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* Step indicator for round trips */}
        {isRoundTrip && (
          <div className="border-t border-gray-100 bg-gray-50">
            <div className="max-w-[1100px] mx-auto px-4 py-2 flex items-center gap-4 text-xs font-semibold">
              <div className={`flex items-center gap-1.5 ${step === "outbound" ? "text-[#ed1c24]" : "text-green-600"}`}>
                <span className={`w-5 h-5 rounded-full flex items-center justify-center text-white text-[10px] font-bold ${step === "outbound" ? "bg-[#ed1c24]" : "bg-green-500"}`}>
                  {step === "return" ? "✓" : "1"}
                </span>
                Departure · {formatDate(departDate)}
              </div>
              <div className="flex-1 h-px bg-gray-300" />
              <div className={`flex items-center gap-1.5 ${step === "return" ? "text-[#ed1c24]" : "text-gray-400"}`}>
                <span className={`w-5 h-5 rounded-full flex items-center justify-center text-white text-[10px] font-bold ${step === "return" ? "bg-[#ed1c24]" : "bg-gray-300"}`}>2</span>
                Return · {formatDate(returnDate)}
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="max-w-[1100px] mx-auto w-full px-4 pt-5 pb-16">

        {/* ── OUTBOUND STEP ── */}
        {step === "outbound" && (
          <>
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-5">
              <div>
                <h1 className="font-serif italic text-2xl sm:text-[32px] font-bold text-[#0d0d0d] leading-tight">
                  {loading ? "Searching flights..." : flights.length > 0 ? "Select your departure" : "No flights found"}
                </h1>
                <p className="text-gray-500 text-sm font-medium mt-1 flex items-center gap-1.5">
                  {originAirport?.city || origin}
                  <svg className="w-3 h-3 text-[#ed1c24]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M14 6l6 6-6 6" />
                  </svg>
                  {destAirport?.city || destination}
                  {!loading && flights.length > 0 && (
                    <span className="ml-2 text-gray-400 font-normal">— {flights.length} flight{flights.length !== 1 ? "s" : ""} found</span>
                  )}
                </p>
              </div>
              <div className="border border-gray-300 rounded-md bg-white px-4 py-2 w-full sm:w-56 cursor-pointer shadow-sm hover:border-gray-400 flex-shrink-0">
                <span className="text-[10px] text-gray-400 block mb-0.5">Preferred currency</span>
                <div className="flex justify-between items-center text-sm font-bold text-[#0d0d0d]">
                  KES – Kenyan Shilling <ChevronDown className="w-4 h-4 text-gray-400" />
                </div>
              </div>
            </div>

            <FlightList
              flights={flights}
              loading={loading}
              error={error}
              expanded={expandedOut}
              onToggle={toggleOut}
              onSelect={handleOutboundSelect}
            />
          </>
        )}

        {/* ── RETURN STEP ── */}
        {step === "return" && (
          <>
            {/* Outbound summary banner */}
            {pendingOutbound && (
              <div className="mb-5 bg-green-50 border border-green-200 rounded-xl px-4 py-3 flex items-center gap-3">
                <div className="w-7 h-7 bg-green-500 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0">✓</div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-green-700 font-semibold">Departure selected</p>
                  <p className="text-sm font-bold text-[#0d0d0d]">
                    {origin} → {destination} · {pendingOutbound.flight.flightNumber} · {pendingOutbound.flight.departureTime}–{pendingOutbound.flight.arrivalTime}
                    <span className="ml-2 text-[#ed1c24]">KES {pendingOutbound.price.toLocaleString()}</span>
                  </p>
                </div>
                <button
                  onClick={() => { setStep("outbound"); setPendingOutbound(null); setExpandedOut(null); }}
                  className="text-xs text-green-700 font-semibold hover:underline flex items-center gap-1 flex-shrink-0"
                >
                  <ArrowLeft className="w-3 h-3" /> Change
                </button>
              </div>
            )}

            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-5">
              <div>
                <h1 className="font-serif italic text-2xl sm:text-[32px] font-bold text-[#0d0d0d] leading-tight">
                  {returnLoading ? "Searching return flights..." : returnFlights.length > 0 ? "Select your return flight" : "No return flights found"}
                </h1>
                <p className="text-gray-500 text-sm font-medium mt-1 flex items-center gap-1.5">
                  {destAirport?.city || destination}
                  <svg className="w-3 h-3 text-[#ed1c24]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M14 6l6 6-6 6" />
                  </svg>
                  {originAirport?.city || origin}
                  {!returnLoading && returnFlights.length > 0 && (
                    <span className="ml-2 text-gray-400 font-normal">— {returnFlights.length} flight{returnFlights.length !== 1 ? "s" : ""} found</span>
                  )}
                </p>
              </div>
            </div>

            <FlightList
              flights={returnFlights}
              loading={returnLoading}
              error={returnError}
              expanded={expandedRet}
              onToggle={toggleRet}
              onSelect={handleReturnSelect}
            />
          </>
        )}

        <Link href="/">
          <button className="mt-8 border border-gray-300 rounded-lg px-6 py-2.5 bg-white font-semibold text-sm hover:bg-gray-50 shadow-sm">
            ← Back
          </button>
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
            {[["amex","Amex","h-6"],["visa","Visa","h-5"],["mastercard","Mastercard","h-6"],["paypal","PayPal","h-6"]].map(([k,a,h]) => (
              <div key={k} className="bg-white rounded px-2 py-1">
                <img src={`/${k}.png`} alt={a} className={`${h} w-auto object-contain`} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#f8f8f8] flex items-center justify-center">
          <Loader2 className="w-10 h-10 text-[#ed1c24] animate-spin" />
        </div>
      }
    >
      <SearchContent />
    </Suspense>
  );
}
