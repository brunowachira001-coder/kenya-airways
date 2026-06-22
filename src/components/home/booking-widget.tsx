"use client"

import { useState, useRef, useEffect } from "react"
import { format } from "date-fns"
import { Calendar as CalendarIcon, Users, Plane, ArrowRightLeft } from "lucide-react"

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
  
  const originRef = useRef<HTMLDivElement>(null)
  const destRef = useRef<HTMLDivElement>(null)

  const totalPassengers = passengers.adults + passengers.children + passengers.infants

  const depDate = departureDate ? new Date(departureDate) : undefined
  const retDate = returnDate ? new Date(returnDate) : undefined

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
    const depStr = departureDate ? departureDate.split("T")[0] : ""
    const retStr = returnDate ? returnDate.split("T")[0] : ""
    const url = `/search?from=${origin}&to=${destination}&depart=${depStr}${tripType === "round-trip" ? `&return=${retStr}` : ""}&adults=${passengers.adults}&cabin=${cabinClass.toLowerCase()}`
    router.push(url)
  }

  const handleSwapAirports = () => {
    if (!origin || !destination) return
    const temp = origin
    setOrigin(destination)
    setDestination(temp)
  }

  const getAirportLabel = (code: string) => {
    const airport = AIRPORTS.find(a => a.iata === code)
    return airport ? `${airport.city} (${airport.iata})` : ""
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
  const allAirports = [...filteredAirports].sort((a, b) => a.city.localeCompare(b.city))

  const isSearchDisabled = !origin || !destination || !departureDate || (tripType === "round-trip" && !returnDate)

  return (
    <div className="bg-[#1c2a38] md:bg-[#1c2a38]/85 backdrop-blur-md rounded-xl shadow-2xl w-full max-w-[1100px] mx-auto overflow-hidden relative z-20 text-white border border-white/10">
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
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg> KQ Holidays
            </TabsTrigger>
          </TabsList>
        </div>

        <div className="p-4 md:p-6">
          <TabsContent value="flights" className="mt-0 outline-none">
            {/* ROW 1: Trip Type, Where from, Where to */}
            <div className="flex flex-col desktop:flex-row gap-2 md:gap-3 items-stretch relative w-full">
              
              {/* Trip Type */}
              <div className="flex flex-col gap-1 w-full desktop:w-44">
                <label className="text-xs font-semibold text-white/80 uppercase tracking-wider">Trip type</label>
                <select 
                  value={tripType} 
                  onChange={(e) => setTripType(e.target.value as TripType)}
                  className="bg-white text-[#0d0d0d] font-semibold text-sm h-12 px-3 rounded-md border border-gray-300 focus:border-[#ed1c24] focus:outline-none cursor-pointer w-full appearance-none"
                >
                  <option value="round-trip">Return</option>
                  <option value="one-way">One Way</option>
                  <option value="multi-city">Multi-City</option>
                </select>
              </div>

              {/* Where from? */}
              <div ref={originRef} className="flex-1 relative w-full flex flex-col gap-1">
                <label className="text-xs font-semibold text-white/80 uppercase tracking-wider">Where from?</label>
                <div className="relative">
                  <Plane className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input 
                    value={activeInput === "origin" ? searchQuery : getAirportLabel(origin)}
                    onFocus={() => { setActiveInput("origin"); setSearchQuery("") }}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Where from?" 
                    className="pl-9 bg-white text-[#0d0d0d] h-12 text-sm font-medium border border-gray-300 rounded-md focus-visible:border-[#ed1c24] focus-visible:ring-0 w-full"
                  />
                </div>
                {activeInput === "origin" && (
                  <div className="absolute top-full left-0 w-full mt-1 bg-white text-[#0d0d0d] border border-gray-200 rounded-md shadow-lg max-h-56 overflow-y-auto z-50 p-2">
                    {nearbyAirports.length > 0 && searchQuery === "" && (
                      <div className="mb-2">
                        <span className="text-xs font-bold text-gray-400 px-2 uppercase tracking-wider">Nearby Airports</span>
                        {nearbyAirports.map(airport => (
                          <button key={airport.iata} type="button" onClick={() => { setOrigin(airport.iata); setActiveInput(null) }}
                            className="flex items-center justify-between w-full text-left px-2 py-2 hover:bg-gray-100 rounded-sm text-sm">
                            <div><p className="font-semibold">{airport.city}, {airport.country}</p><p className="text-xs text-gray-500">{airport.name}</p></div>
                            <span className="font-mono font-bold text-[#ed1c24] text-xs bg-red-50 px-1.5 py-0.5 rounded">{airport.iata}</span>
                          </button>
                        ))}
                      </div>
                    )}
                    <div>
                      <span className="text-xs font-bold text-gray-400 px-2 uppercase tracking-wider">{searchQuery !== "" ? "Search Results" : "All Airports"}</span>
                      {allAirports.length > 0 ? allAirports.map(airport => (
                        <button key={airport.iata} type="button" onClick={() => { setOrigin(airport.iata); setActiveInput(null) }}
                          className="flex items-center justify-between w-full text-left px-2 py-2 hover:bg-gray-100 rounded-sm text-sm">
                          <div><p className="font-semibold">{airport.city}, {airport.country}</p><p className="text-xs text-gray-500">{airport.name}</p></div>
                          <span className="font-mono font-bold text-[#ed1c24] text-xs bg-red-50 px-1.5 py-0.5 rounded">{airport.iata}</span>
                        </button>
                      )) : <p className="text-xs text-gray-500 p-2">No airports found for &quot;{searchQuery}&quot;</p>}
                    </div>
                  </div>
                )}
              </div>

              {/* Swap Button */}
              <div className="flex items-center justify-center pb-1 z-10 desktop:-mx-2">
                <button type="button" onClick={handleSwapAirports} disabled={!origin || !destination}
                  className="w-9 h-9 rounded-full bg-white hover:bg-gray-100 disabled:opacity-50 text-[#ed1c24] shadow flex items-center justify-center transition-colors rotate-90 desktop:rotate-0 flex-shrink-0"
                  aria-label="Swap origin and destination">
                  <ArrowRightLeft className="w-4 h-4" />
                </button>
              </div>

              {/* Where to? */}
              <div ref={destRef} className="flex-1 relative w-full flex flex-col gap-1">
                <label className="text-xs font-semibold text-white/80 uppercase tracking-wider">Where to?</label>
                <div className="relative">
                  <Plane className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input 
                    value={activeInput === "destination" ? searchQuery : getAirportLabel(destination)}
                    onFocus={() => { setActiveInput("destination"); setSearchQuery("") }}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Where to?" 
                    className="pl-9 bg-white text-[#0d0d0d] h-12 text-sm font-medium border border-gray-300 rounded-md focus-visible:border-[#ed1c24] focus-visible:ring-0 w-full"
                  />
                </div>
                {activeInput === "destination" && (
                  <div className="absolute top-full left-0 w-full mt-1 bg-white text-[#0d0d0d] border border-gray-200 rounded-md shadow-lg max-h-56 overflow-y-auto z-50 p-2">
                    {nearbyAirports.length > 0 && searchQuery === "" && (
                      <div className="mb-2">
                        <span className="text-xs font-bold text-gray-400 px-2 uppercase tracking-wider">Nearby Airports</span>
                        {nearbyAirports.map(airport => (
                          <button key={airport.iata} type="button" onClick={() => { setDestination(airport.iata); setActiveInput(null) }}
                            className="flex items-center justify-between w-full text-left px-2 py-2 hover:bg-gray-100 rounded-sm text-sm">
                            <div><p className="font-semibold">{airport.city}, {airport.country}</p><p className="text-xs text-gray-500">{airport.name}</p></div>
                            <span className="font-mono font-bold text-[#ed1c24] text-xs bg-red-50 px-1.5 py-0.5 rounded">{airport.iata}</span>
                          </button>
                        ))}
                      </div>
                    )}
                    <div>
                      <span className="text-xs font-bold text-gray-400 px-2 uppercase tracking-wider">{searchQuery !== "" ? "Search Results" : "All Airports"}</span>
                      {allAirports.length > 0 ? allAirports.map(airport => (
                        <button key={airport.iata} type="button" onClick={() => { setDestination(airport.iata); setActiveInput(null) }}
                          className="flex items-center justify-between w-full text-left px-2 py-2 hover:bg-gray-100 rounded-sm text-sm">
                          <div><p className="font-semibold">{airport.city}, {airport.country}</p><p className="text-xs text-gray-500">{airport.name}</p></div>
                          <span className="font-mono font-bold text-[#ed1c24] text-xs bg-red-50 px-1.5 py-0.5 rounded">{airport.iata}</span>
                        </button>
                      )) : <p className="text-xs text-gray-500 p-2">No airports found for &quot;{searchQuery}&quot;</p>}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* ROW 2: Passengers, Depart, Return, Search */}
            <div className="flex flex-col desktop:flex-row gap-2 md:gap-3 items-end relative w-full mt-2 md:mt-3">

              {/* Passengers / Cabin Class */}
              <div className="desktop:w-52 flex flex-col gap-1 w-full min-w-0">
                <label className="text-xs font-semibold text-white/80 uppercase tracking-wider">Passengers / Cabin class</label>
                <Popover>
                  <PopoverTrigger
                    className="w-full h-12 justify-start text-left text-sm font-semibold border border-gray-300 flex items-center px-4 py-2 rounded-md bg-white text-[#0d0d0d] whitespace-nowrap overflow-hidden"
                  >
                    <Users className="mr-2 h-5 w-5 flex-shrink-0 text-gray-500" />
                    <span className="truncate">{totalPassengers} {totalPassengers === 1 ? 'Adult' : 'Passenger(s)'} in {cabinClass}</span>
                  </PopoverTrigger>
                  <PopoverContent className="w-80 p-4 backdrop-blur-md bg-white/95 text-[#0d0d0d]" align="start">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div><p className="font-medium text-sm">Adults</p><p className="text-xs text-gray-400">12+ years</p></div>
                        <div className="flex items-center gap-3">
                          <button type="button" onClick={() => updatePassengers('adults', passengers.adults - 1)} disabled={passengers.adults <= 1} className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center disabled:opacity-50 text-sm">-</button>
                          <span className="w-4 text-center font-medium text-sm">{passengers.adults}</span>
                          <button type="button" onClick={() => updatePassengers('adults', passengers.adults + 1)} disabled={totalPassengers >= 9} className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center disabled:opacity-50 text-sm">+</button>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div><p className="font-medium text-sm">Children</p><p className="text-xs text-gray-400">2-11 years</p></div>
                        <div className="flex items-center gap-3">
                          <button type="button" onClick={() => updatePassengers('children', passengers.children - 1)} disabled={passengers.children <= 0} className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center disabled:opacity-50 text-sm">-</button>
                          <span className="w-4 text-center font-medium text-sm">{passengers.children}</span>
                          <button type="button" onClick={() => updatePassengers('children', passengers.children + 1)} disabled={totalPassengers >= 9} className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center disabled:opacity-50 text-sm">+</button>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div><p className="font-medium text-sm">Infants</p><p className="text-xs text-gray-400">Under 2 years</p></div>
                        <div className="flex items-center gap-3">
                          <button type="button" onClick={() => updatePassengers('infants', passengers.infants - 1)} disabled={passengers.infants <= 0} className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center disabled:opacity-50 text-sm">-</button>
                          <span className="w-4 text-center font-medium text-sm">{passengers.infants}</span>
                          <button type="button" onClick={() => updatePassengers('infants', passengers.infants + 1)} disabled={passengers.infants >= passengers.adults} className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center disabled:opacity-50 text-sm">+</button>
                        </div>
                      </div>
                      <div className="border-t pt-4 mt-2">
                        <label className="text-sm font-semibold mb-2 block">Cabin Class</label>
                        <select value={cabinClass} onChange={(e) => setCabinClass(e.target.value)} className="w-full h-10 px-3 border border-gray-300 rounded-md bg-white text-sm focus:ring-1 focus:ring-[#ed1c24]">
                          <option value="Economy">Economy</option>
                          <option value="Premium Economy">Premium Economy</option>
                          <option value="Business">Business</option>
                        </select>
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>
              </div>

              {/* Dates row: on mobile use 2-col grid */}
              <div className="flex-1 grid grid-cols-2 desktop:flex desktop:flex-row gap-2 md:gap-3 w-full">
                {/* Depart */}
                <div className="flex flex-col gap-1 min-w-0">
                  <label className="text-xs font-semibold text-white/80 uppercase tracking-wider">Depart</label>
                  <Popover>
                    <PopoverTrigger
                      className={cn(
                        "w-full h-12 justify-start text-left text-sm border border-gray-300 flex items-center px-3 py-2 rounded-md bg-white text-[#0d0d0d] whitespace-nowrap overflow-hidden",
                        !departureDate && "text-gray-400"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4 text-gray-400 flex-shrink-0" />
                      <span className="truncate text-xs md:text-sm">{depDate ? format(depDate, "dd MMM yy") : "Depart"}</span>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <div className="bg-white text-[#0d0d0d] p-1">
                        <Calendar mode="single" selected={depDate} onSelect={(date) => setDepartureDate(date?.toISOString())} initialFocus disabled={(date) => date < new Date(new Date().setHours(0,0,0,0))} />
                      </div>
                    </PopoverContent>
                  </Popover>
                </div>

                {/* Return */}
                {tripType === "round-trip" && (
                  <div className="flex flex-col gap-1 min-w-0">
                    <label className="text-xs font-semibold text-white/80 uppercase tracking-wider">Return</label>
                    <Popover>
                      <PopoverTrigger
                        className={cn(
                          "w-full h-12 justify-start text-left text-sm border border-gray-300 flex items-center px-3 py-2 rounded-md bg-white text-[#0d0d0d] whitespace-nowrap overflow-hidden",
                          !returnDate && "text-gray-400"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4 text-gray-400 flex-shrink-0" />
                        <span className="truncate text-xs md:text-sm">{retDate ? format(retDate, "dd MMM yy") : "Return"}</span>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <div className="bg-white text-[#0d0d0d] p-1">
                          <Calendar mode="single" selected={retDate} onSelect={(date) => setReturnDate(date?.toISOString())} initialFocus disabled={(date) => date < new Date(depDate ?? new Date())} />
                        </div>
                      </PopoverContent>
                    </Popover>
                  </div>
                )}
              </div>

              {/* Search Button */}
              <div className="w-full desktop:w-auto flex flex-col gap-1 min-w-0">
                <label className="text-xs font-semibold text-transparent uppercase tracking-wider select-none hidden desktop:block">Search</label>
                <Button
                  disabled={isSearchDisabled}
                  onClick={handleSearch}
                  className="w-full desktop:w-auto bg-[#ed1c24] hover:bg-[#c11218] disabled:opacity-50 text-white h-12 px-7 text-sm font-bold rounded-md transition-colors flex items-center justify-center gap-2 shadow-lg"
                >
                  <Plane className="w-4 h-4" />
                  Search flights
                </Button>
              </div>

            </div>
          </TabsContent>
          
          <TabsContent value="kq-holidays" className="mt-0 outline-none">
            <div className="flex flex-col items-center justify-center py-8 text-center text-white">
              <h3 className="text-2xl font-bold mb-3 font-display">Discover Your Next Adventure</h3>
              <p className="text-white/80 max-w-md mb-6 text-sm">Book flights, hotels, and activities all in one place with KQ Holidays.</p>
              <a 
                href="https://www.kqholidays.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-[#ed1c24] hover:bg-[#c11218] text-white px-8 py-3 rounded-md font-bold text-base transition-colors inline-block"
              >
                Explore KQ Holidays
              </a>
            </div>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  )
}
