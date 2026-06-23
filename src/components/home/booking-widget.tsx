"use client"

import { useState, useRef, useEffect } from "react"
import { format, addDays } from "date-fns"
import { Calendar as CalendarIcon, Users, Plane, ArrowRightLeft, Loader2 } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { useBookingStore, TripType } from "@/store/booking-store"
import { useRouter } from "next/navigation"
import { AIRPORTS } from "@/lib/airports"

export function BookingWidget() {
  const router = useRouter()
  const {
    tripType, setTripType,
    origin, setOrigin,
    destination, setDestination,
    departureDate, setDepartureDate,
    returnDate, setReturnDate,
    passengers, updatePassengers,
    cabinClass, setCabinClass
  } = useBookingStore()

  const [activeInput, setActiveInput] = useState<"origin" | "destination" | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [isSearching, setIsSearching] = useState(false)

  const originRef = useRef<HTMLDivElement>(null)
  const destRef = useRef<HTMLDivElement>(null)

  const totalPassengers = passengers.adults + passengers.children + passengers.infants

  const depDate = departureDate ? new Date(departureDate) : undefined
  const retDate = returnDate ? new Date(returnDate) : undefined

  // Set sensible defaults on first mount
  useEffect(() => {
    const defaults = {
      origin: origin || "NBO",
      destination: destination || "MBA",
      departureDate: departureDate || addDays(new Date(), 1).toISOString(),
      returnDate: tripType === "round-trip"
        ? (returnDate || addDays(new Date(), 8).toISOString())
        : undefined,
    }
    if (!origin) setOrigin(defaults.origin)
    if (!destination) setDestination(defaults.destination)
    if (!departureDate) setDepartureDate(defaults.departureDate)
    if (tripType === "round-trip" && !returnDate) setReturnDate(defaults.returnDate)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Sync return date when switching to round-trip
  useEffect(() => {
    if (tripType === "round-trip" && !returnDate && departureDate) {
      const dep = new Date(departureDate)
      const ret = addDays(dep, 7)
      setReturnDate(ret.toISOString())
    }
  }, [tripType, returnDate, departureDate, setReturnDate])

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        activeInput === "origin" &&
        originRef.current &&
        !originRef.current.contains(e.target as Node)
      ) {
        setActiveInput(null)
      }
      if (
        activeInput === "destination" &&
        destRef.current &&
        !destRef.current.contains(e.target as Node)
      ) {
        setActiveInput(null)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [activeInput])

  const handleSearch = () => {
    if (isSearching) return

    // Apply defaults before searching if not set
    const finalOrigin = origin || "NBO"
    const finalDestination = destination || "MBA"
    const finalDepart = departureDate || addDays(new Date(), 1).toISOString()
    const finalReturn = tripType === "round-trip"
      ? (returnDate || addDays(new Date(), 8).toISOString())
      : undefined

    // Ensure store has defaults applied
    if (!origin) setOrigin(finalOrigin)
    if (!destination) setDestination(finalDestination)
    if (!departureDate) setDepartureDate(finalDepart)
    if (tripType === "round-trip" && !returnDate) setReturnDate(finalReturn)

    setIsSearching(true)

    const depStr = finalDepart.split("T")[0]
    const retStr = finalReturn ? finalReturn.split("T")[0] : ""

    // Small delay for loading state UX
    setTimeout(() => {
      const url = `/search?from=${finalOrigin}&to=${finalDestination}&depart=${depStr}${tripType === "round-trip" ? `&return=${retStr}` : ""}&adults=${passengers.adults}&cabin=${cabinClass.toLowerCase()}`
      router.push(url)
    }, 300)
  }

  const handleSwapAirports = () => {
    if (!origin && !destination) return
    const temp = origin || "NBO"
    const tempDest = destination || "MBA"
    setOrigin(tempDest)
    setDestination(temp)
  }

  const getAirportLabel = (code: string) => {
    if (!code) return ""
    const airport = AIRPORTS.find(a => a.iata === code)
    return airport ? `${airport.city} (${airport.iata})` : code
  }

  const filteredAirports = AIRPORTS.filter(airport => {
    const query = searchQuery.toLowerCase()
    return (
      airport.city.toLowerCase().includes(query) ||
      airport.country.toLowerCase().includes(query) ||
      airport.name.toLowerCase().includes(query) ||
      airport.iata.toLowerCase().includes(query)
    )
  })

  const nearbyAirports = filteredAirports.filter(a => a.nearby)
  const otherAirports = filteredAirports.filter(a => !a.nearby)
  const sortedOtherAirports = [...otherAirports].sort((a, b) => a.city.localeCompare(b.city))

  return (
    <div className="bg-[#1c2a38] md:bg-[#1c2a38]/90 backdrop-blur-md rounded-xl shadow-2xl w-full max-w-[1100px] mx-auto overflow-hidden relative z-20 text-white border border-white/10">
      <Tabs defaultValue="flights" className="w-full">
        <div className="bg-transparent text-white w-full overflow-x-auto border-b border-white/10">
          <TabsList className="h-11 bg-transparent p-0 flex justify-start w-full min-w-max rounded-none">
            <TabsTrigger
              value="flights"
              className="h-full rounded-none px-5 md:px-8 data-[state=active]:bg-transparent data-[state=active]:text-white data-[state=active]:border-b-2 data-[state=active]:border-white text-sm font-semibold transition-all bg-transparent text-white/60 hover:text-white flex items-center gap-2"
            >
              <Plane className="w-4 h-4" /> Flights
            </TabsTrigger>
            <TabsTrigger
              value="kq-holidays"
              className="h-full rounded-none px-5 md:px-8 data-[state=active]:bg-transparent data-[state=active]:text-white data-[state=active]:border-b-2 data-[state=active]:border-white text-sm font-semibold transition-all bg-transparent text-white/60 hover:text-white flex items-center gap-2"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
              KQ Holidays
            </TabsTrigger>
          </TabsList>
        </div>

        <div className="p-4 md:p-5">
          <TabsContent value="flights" className="mt-0 outline-none">

            {/* ROW 1: Trip Type, Where from, Where to */}
            <div className="flex flex-col md:flex-row gap-2 md:gap-3 items-stretch relative w-full">

              {/* Trip Type */}
              <div className="flex flex-col gap-1 w-full md:w-44 shrink-0">
                <label className="text-[10px] md:text-xs font-bold text-white/70 uppercase tracking-wider">Trip type</label>
                <select
                  value={tripType}
                  onChange={(e) => setTripType(e.target.value as TripType)}
                  className="bg-white text-[#0d0d0d] font-semibold text-sm h-11 md:h-12 px-3 rounded-md border border-gray-300 focus:border-[#ed1c24] focus:outline-none cursor-pointer w-full appearance-none"
                >
                  <option value="round-trip">Return</option>
                  <option value="one-way">One Way</option>
                  <option value="multi-city">Multi-City</option>
                </select>
              </div>

              {/* Where from? */}
              <div ref={originRef} className="flex-1 relative w-full flex flex-col gap-1">
                <label className="text-[10px] md:text-xs font-bold text-white/70 uppercase tracking-wider">Where from?</label>
                <div className="relative">
                  <Plane className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    value={activeInput === "origin" ? searchQuery : getAirportLabel(origin)}
                    onFocus={() => { setActiveInput("origin"); setSearchQuery(origin && !AIRPORTS.find(a => a.iata === origin) ? origin : "") }}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="City or airport"
                    className="pl-9 pr-16 bg-white text-[#0d0d0d] h-11 md:h-12 text-sm font-medium border border-gray-300 rounded-md focus-visible:border-[#ed1c24] focus-visible:ring-0 w-full"
                  />
                  {/* IATA badge - shown when input is not active */}
                  {origin && activeInput !== "origin" && (
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 font-mono font-bold text-[10px] bg-red-50 text-[#ed1c24] px-1.5 py-0.5 rounded">
                      {origin}
                    </span>
                  )}
                </div>

                {activeInput === "origin" && (
                  <AirportDropdown
                    nearbyAirports={nearbyAirports}
                    otherAirports={sortedOtherAirports}
                    searchQuery={searchQuery}
                    onSelect={(iata) => { setOrigin(iata); setActiveInput(null) }}
                  />
                )}
              </div>

              {/* Swap Button */}
              <div className="flex items-center justify-center pb-0 z-10 md:-mx-1">
                <button type="button" onClick={handleSwapAirports}
                  className="w-8 h-8 md:w-9 md:h-9 rounded-full bg-white hover:bg-gray-100 text-[#ed1c24] shadow flex items-center justify-center transition-all hover:scale-110 disabled:opacity-40"
                  aria-label="Swap origin and destination">
                  <ArrowRightLeft className="w-3.5 h-3.5 md:w-4 md:h-4" />
                </button>
              </div>

              {/* Where to? */}
              <div ref={destRef} className="flex-1 relative w-full flex flex-col gap-1">
                <label className="text-[10px] md:text-xs font-bold text-white/70 uppercase tracking-wider">Where to?</label>
                <div className="relative">
                  <Plane className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    value={activeInput === "destination" ? searchQuery : getAirportLabel(destination)}
                    onFocus={() => { setActiveInput("destination"); setSearchQuery(destination && !AIRPORTS.find(a => a.iata === destination) ? destination : "") }}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="City or airport"
                    className="pl-9 pr-16 bg-white text-[#0d0d0d] h-11 md:h-12 text-sm font-medium border border-gray-300 rounded-md focus-visible:border-[#ed1c24] focus-visible:ring-0 w-full"
                  />
                  {destination && activeInput !== "destination" && (
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 font-mono font-bold text-[10px] bg-red-50 text-[#ed1c24] px-1.5 py-0.5 rounded">
                      {destination}
                    </span>
                  )}
                </div>

                {activeInput === "destination" && (
                  <AirportDropdown
                    nearbyAirports={nearbyAirports}
                    otherAirports={sortedOtherAirports}
                    searchQuery={searchQuery}
                    onSelect={(iata) => { setDestination(iata); setActiveInput(null) }}
                  />
                )}
              </div>

            </div>

            {/* ROW 2: Passengers, Dates, Search */}
            <div className="flex flex-col md:flex-row gap-2 md:gap-3 items-end relative w-full mt-2 md:mt-3">

              {/* Passengers / Cabin Class */}
              <div className="md:w-52 flex flex-col gap-1 w-full min-w-0 shrink-0">
                <label className="text-[10px] md:text-xs font-bold text-white/70 uppercase tracking-wider">Passengers &amp; Class</label>
                <Popover>
                  <PopoverTrigger
                    className="w-full h-11 md:h-12 justify-start text-left text-sm font-semibold border border-gray-300 flex items-center px-3 py-2 rounded-md bg-white text-[#0d0d0d] whitespace-nowrap overflow-hidden"
                  >
                    <Users className="mr-2 h-4 w-4 flex-shrink-0 text-gray-500" />
                    <span className="truncate">
                      {totalPassengers} {totalPassengers === 1 ? "Adult" : "Adults"} &middot; {cabinClass}
                    </span>
                  </PopoverTrigger>
                  <PopoverContent className="w-80 p-4 bg-white text-[#0d0d0d]" align="start">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-semibold text-sm">Adults</p>
                          <p className="text-xs text-gray-400">12+ years</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <button type="button" onClick={() => updatePassengers("adults", Math.max(1, passengers.adults - 1))} disabled={passengers.adults <= 1}
                            className="w-7 h-7 rounded-full border border-gray-300 flex items-center justify-center text-sm font-bold hover:bg-gray-100 disabled:opacity-40 transition-colors">−</button>
                          <span className="w-5 text-center font-semibold text-sm">{passengers.adults}</span>
                          <button type="button" onClick={() => updatePassengers("adults", Math.min(9, passengers.adults + 1))} disabled={totalPassengers >= 9}
                            className="w-7 h-7 rounded-full border border-gray-300 flex items-center justify-center text-sm font-bold hover:bg-gray-100 disabled:opacity-40 transition-colors">+</button>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-semibold text-sm">Children</p>
                          <p className="text-xs text-gray-400">2–11 years</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <button type="button" onClick={() => updatePassengers("children", Math.max(0, passengers.children - 1))} disabled={passengers.children <= 0}
                            className="w-7 h-7 rounded-full border border-gray-300 flex items-center justify-center text-sm font-bold hover:bg-gray-100 disabled:opacity-40 transition-colors">−</button>
                          <span className="w-5 text-center font-semibold text-sm">{passengers.children}</span>
                          <button type="button" onClick={() => updatePassengers("children", Math.min(9, passengers.children + 1))} disabled={totalPassengers >= 9}
                            className="w-7 h-7 rounded-full border border-gray-300 flex items-center justify-center text-sm font-bold hover:bg-gray-100 disabled:opacity-40 transition-colors">+</button>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-semibold text-sm">Infants</p>
                          <p className="text-xs text-gray-400">Under 2 years</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <button type="button" onClick={() => updatePassengers("infants", Math.max(0, passengers.infants - 1))} disabled={passengers.infants <= 0}
                            className="w-7 h-7 rounded-full border border-gray-300 flex items-center justify-center text-sm font-bold hover:bg-gray-100 disabled:opacity-40 transition-colors">−</button>
                          <span className="w-5 text-center font-semibold text-sm">{passengers.infants}</span>
                          <button type="button" onClick={() => updatePassengers("infants", Math.min(passengers.adults, passengers.infants + 1))} disabled={passengers.infants >= passengers.adults}
                            className="w-7 h-7 rounded-full border border-gray-300 flex items-center justify-center text-sm font-bold hover:bg-gray-100 disabled:opacity-40 transition-colors">+</button>
                        </div>
                      </div>

                      <div className="border-t pt-3 mt-1">
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 block">Cabin Class</label>
                        <select
                          value={cabinClass}
                          onChange={(e) => setCabinClass(e.target.value)}
                          className="w-full h-9 px-3 border border-gray-300 rounded-md bg-white text-sm focus:ring-1 focus:ring-[#ed1c24] focus:border-[#ed1c24] transition-colors"
                        >
                          <option value="Economy">Economy</option>
                          <option value="Premium Economy">Premium Economy</option>
                          <option value="Business">Business</option>
                        </select>
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>
              </div>

              {/* Dates */}
              <div className="flex-1 grid grid-cols-2 md:flex md:flex-row gap-2 md:gap-3 w-full">

                {/* Depart */}
                <div className="flex flex-col gap-1 min-w-0">
                  <label className="text-[10px] md:text-xs font-bold text-white/70 uppercase tracking-wider">Depart</label>
                  <Popover>
                    <PopoverTrigger
                      className={cn(
                        "w-full h-11 md:h-12 justify-start text-left text-sm border border-gray-300 flex items-center px-3 py-2 rounded-md bg-white text-[#0d0d0d] whitespace-nowrap overflow-hidden",
                        !departureDate && "text-gray-400"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4 text-gray-400 flex-shrink-0" />
                      <span className="truncate text-xs md:text-sm font-medium">
                        {depDate ? format(depDate, "EEE, dd MMM yyyy") : "Select date"}
                      </span>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <div className="bg-white text-[#0d0d0d] p-1">
                        <Calendar
                          mode="single"
                          selected={depDate}
                          onSelect={(date) => {
                            setDepartureDate(date?.toISOString())
                            // Auto-adjust return date if it's before new depart date
                            if (date && returnDate && new Date(returnDate) < date) {
                              setReturnDate(addDays(date, 7).toISOString())
                            }
                          }}
                          initialFocus
                          disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                        />
                      </div>
                    </PopoverContent>
                  </Popover>
                </div>

                {/* Return (round-trip only) */}
                {tripType === "round-trip" && (
                  <div className="flex flex-col gap-1 min-w-0">
                    <label className="text-[10px] md:text-xs font-bold text-white/70 uppercase tracking-wider">Return</label>
                    <Popover>
                      <PopoverTrigger
                        className={cn(
                          "w-full h-11 md:h-12 justify-start text-left text-sm border border-gray-300 flex items-center px-3 py-2 rounded-md bg-white text-[#0d0d0d] whitespace-nowrap overflow-hidden",
                          !returnDate && "text-gray-400"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4 text-gray-400 flex-shrink-0" />
                        <span className="truncate text-xs md:text-sm font-medium">
                          {retDate ? format(retDate, "EEE, dd MMM yyyy") : "Select date"}
                        </span>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <div className="bg-white text-[#0d0d0d] p-1">
                          <Calendar
                            mode="single"
                            selected={retDate}
                            onSelect={(date) => setReturnDate(date?.toISOString())}
                            initialFocus
                            disabled={(date) => date < new Date(depDate ?? new Date())}
                          />
                        </div>
                      </PopoverContent>
                    </Popover>
                  </div>
                )}

              </div>

              {/* Search Button */}
              <div className="w-full md:w-auto flex flex-col gap-1 min-w-0 shrink-0">
                <label className="text-[10px] md:text-xs font-bold text-transparent select-none hidden md:block">Search</label>
                <Button
                  disabled={isSearching}
                  onClick={handleSearch}
                  className="w-full md:w-auto bg-[#ed1c24] hover:bg-[#c11218] text-white h-11 md:h-12 px-6 md:px-8 text-sm font-bold rounded-md transition-all flex items-center justify-center gap-2 shadow-lg hover:shadow-xl active:scale-[0.98]"
                >
                  {isSearching ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Searching...
                    </>
                  ) : (
                    <>
                      <Plane className="w-4 h-4" />
                      Search Flights
                    </>
                  )}
                </Button>
              </div>

            </div>
          </TabsContent>

          <TabsContent value="kq-holidays" className="mt-0 outline-none">
            <div className="flex flex-col items-center justify-center py-10 text-center text-white">
              <div className="w-16 h-16 bg-[#ed1c24]/20 rounded-full flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-[#ed1c24]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
              </div>
              <h3 className="text-2xl font-bold mb-3">Discover Your Next Adventure</h3>
              <p className="text-white/70 max-w-md mb-6 text-sm">Book flights, hotels, and activities all in one place with KQ Holidays.</p>
              <a
                href="https://www.kqholidays.com"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#ed1c24] hover:bg-[#c11218] text-white px-8 py-3 rounded-md font-bold text-base transition-colors inline-flex items-center gap-2"
              >
                Explore KQ Holidays
                <ArrowRightLeft className="w-4 h-4 rotate-90" />
              </a>
            </div>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  )
}

// Airport dropdown sub-component
function AirportDropdown({
  nearbyAirports,
  otherAirports,
  searchQuery,
  onSelect,
}: {
  nearbyAirports: typeof AIRPORTS
  otherAirports: typeof AIRPORTS
  searchQuery: string
  onSelect: (iata: string) => void
}) {
  const sectionTitle = searchQuery ? "Search Results" : "All Airports"
  const hasResults = nearbyAirports.length > 0 || otherAirports.length > 0

  return (
    <div className="absolute top-full left-0 w-full mt-1 bg-white text-[#0d0d0d] border border-gray-200 rounded-lg shadow-2xl max-h-64 overflow-y-auto z-50">
      {nearbyAirports.length > 0 && (
        <div className="p-2 border-b border-gray-100">
          <span className="text-[10px] font-bold text-gray-400 px-2 uppercase tracking-widest">Nearby Airports</span>
          {nearbyAirports.map(airport => (
            <AirportRow key={airport.iata} airport={airport} onSelect={onSelect} />
          ))}
        </div>
      )}

      <div className="p-2">
        <span className="text-[10px] font-bold text-gray-400 px-2 uppercase tracking-widest">{sectionTitle}</span>
        {hasResults ? (
          otherAirports.map(airport => (
            <AirportRow key={airport.iata} airport={airport} onSelect={onSelect} />
          ))
        ) : (
          <p className="text-xs text-gray-400 p-3 text-center">No airports found for &quot;{searchQuery}&quot;</p>
        )}
      </div>
    </div>
  )
}

function AirportRow({ airport, onSelect }: { airport: typeof AIRPORTS[0]; onSelect: (iata: string) => void }) {
  return (
    <button
      type="button"
      onClick={() => onSelect(airport.iata)}
      className="flex items-center justify-between w-full text-left px-3 py-2.5 hover:bg-gray-100 rounded-md transition-colors group"
    >
      <div className="min-w-0 flex-1">
        <p className="font-semibold text-sm text-[#0d0d0d] group-hover:text-[#ed1c24] transition-colors truncate">
          {airport.city}, {airport.country}
        </p>
        <p className="text-xs text-gray-400 truncate">{airport.name}</p>
      </div>
      <span className="font-mono font-bold text-xs bg-red-50 text-[#ed1c24] px-1.5 py-0.5 rounded ml-2 shrink-0">
        {airport.iata}
      </span>
    </button>
  )
}