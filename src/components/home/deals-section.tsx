"use client"

import { useState, useRef, useEffect } from "react"
import { ChevronDown, X, ArrowRight, Plane } from "lucide-react"
import { useBookingStore } from "@/store/booking-store"
import { useRouter } from "next/navigation"
import { DEALS } from "@/lib/deals"

// Legacy deal type for backwards compatibility with existing deals-section logic
type LegacyDeal = {
  id: number
  destination: string
  dateRange: string
  price: string
  image: string
  destCode: string
}

// Legacy data structure for deals-section (origin city keyed)
const DEALS_DATA: Record<string, LegacyDeal[]> = {
  Nairobi: DEALS.filter(d => d.originCity === "Nairobi").map(d => ({
    id: d.id,
    destination: d.destinationCity,
    dateRange: d.dateRange,
    price: d.price,
    image: d.image,
    destCode: d.destination
  })),
  Mombasa: DEALS.filter(d => d.originCity === "Nairobi" && ["NBO", "MBA"].includes(d.destination)).map(d => ({
    id: d.id + 100,
    destination: d.destinationCity,
    dateRange: d.dateRange,
    price: d.price,
    image: d.image,
    destCode: d.destination
  })).slice(0, 4),
  Kisumu: DEALS.filter(d => d.originCity === "Nairobi" && ["NBO", "MBA", "KIS", "DXB"].includes(d.destination)).map(d => ({
    id: d.id + 200,
    destination: d.destinationCity,
    dateRange: d.dateRange,
    price: d.price,
    image: d.image,
    destCode: d.destination
  })).slice(0, 3)
}

function DealCard({ deal, onClick }: { deal: LegacyDeal, onClick: () => void }) {
  return (
    <div
      onClick={onClick}
      className="bg-white border border-gray-200 rounded-xl overflow-hidden group flex flex-col cursor-pointer hover:shadow-lg hover:border-gray-300 transition-all duration-300 hover:scale-[1.02]"
    >
      <div className="relative h-[130px] md:h-[160px] w-full overflow-hidden bg-gray-100">
        <div className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105" style={{ backgroundImage: `url(${deal.image})` }} />
        <div className="absolute bottom-0 left-3 w-6 h-1 bg-[#ed1c24] rounded-t-sm" />
      </div>
      <div className="p-3 flex flex-col flex-grow">
        <h3 className="font-serif italic text-sm md:text-base font-bold text-[#0d0d0d] group-hover:text-[#ed1c24] transition-colors leading-tight mb-0.5">{deal.destination}</h3>
        <p className="text-gray-500 text-[10px] md:text-xs font-medium mb-0.5">{deal.dateRange}</p>
        <div className="mt-auto pt-1">
          <span className="text-xs md:text-sm font-black text-[#ed1c24]">{deal.price}</span>
        </div>
      </div>
    </div>
  )
}

export function DealsSection() {
  const router = useRouter()
  const { setOrigin, setDestination, setTripType, setDepartureDate, setReturnDate } = useBookingStore()
  
  const [selectedCity, setSelectedCity] = useState("Nairobi")
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [drawerDeal, setDrawerDeal] = useState<LegacyDeal | null>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleCardClick = (deal: typeof DEALS_DATA.Nairobi[0]) => {
    const originCode = selectedCity === "Nairobi" ? "NBO" : selectedCity === "Mombasa" ? "MBA" : "KIS"
    setOrigin(originCode)
    setDestination(deal.destCode)
    setTripType("round-trip")
    
    const today = new Date()
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)
    const dayAfter = new Date(today)
    dayAfter.setDate(dayAfter.getDate() + 8)
    
    setDepartureDate(tomorrow.toISOString())
    setReturnDate(dayAfter.toISOString())
    
    const depStr = tomorrow.toISOString().split("T")[0]
    const retStr = dayAfter.toISOString().split("T")[0]
    
    router.push(`/search?from=${originCode}&to=${deal.destCode}&depart=${depStr}&return=${retStr}&adults=1&cabin=economy`)
  }

  const handleBookNow = () => {
    if (!drawerDeal) return
    const originCode = selectedCity === "Nairobi" ? "NBO" : selectedCity === "Mombasa" ? "MBA" : "KIS"
    setOrigin(originCode)
    setDestination(drawerDeal.destCode)
    setTripType("round-trip")
    
    const today = new Date()
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)
    const dayAfter = new Date(today)
    dayAfter.setDate(dayAfter.getDate() + 8)
    
    setDepartureDate(tomorrow.toISOString())
    setReturnDate(dayAfter.toISOString())
    
    const depStr = tomorrow.toISOString().split("T")[0]
    const retStr = dayAfter.toISOString().split("T")[0]
    
    router.push(`/search?from=${originCode}&to=${drawerDeal.destCode}&depart=${depStr}&return=${retStr}&adults=1&cabin=economy`)
  }

  const currentDeals = DEALS_DATA[selectedCity] || DEALS_DATA.Nairobi

  return (
    <div>
      <div className="w-full py-4 md:py-6 px-4">
        <div className="max-w-content mx-auto">
          {/* Header Row */}
          <div className="flex flex-col sm:flex-row sm:items-end gap-3 mb-5 relative">
            {/* Best Price Guarantee Badge - hidden on mobile */}
            <div className="absolute top-0 right-0 hidden sm:block">
              <img 
                src="/logo_best_price.svg" 
                alt="KQ Best Price Guarantee" 
                className="h-10 md:h-11 w-auto"
              />
            </div>

            <div className="flex flex-col gap-2 w-full sm:w-auto sm:flex-1">
              <div className="flex items-center gap-3">
                <div className="w-5 h-1 bg-[#ed1c24] rounded-sm" />
                <h2 className="font-serif italic text-base md:text-2xl text-[#0d0d0d]">Deals from</h2>
              </div>
              <div className="relative w-full sm:w-52 z-10" ref={dropdownRef}>
                <button 
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="w-full flex items-center justify-between px-4 py-2.5 border border-gray-300 rounded-md bg-white text-left text-sm font-normal text-[#0d0d0d] focus:outline-none focus:border-[#ed1c24] hover:border-gray-400 transition-colors"
                  aria-expanded={dropdownOpen}
                  aria-haspopup="listbox"
                >
                  {selectedCity} 
                  <ChevronDown className={`w-4 h-4 text-gray-600 transition-transform ${dropdownOpen ? "rotate-180" : ""}`} />
                </button>
                
                {dropdownOpen && (
                  <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-md shadow-xl z-[60] py-1 w-full max-h-60 overflow-auto" role="listbox">
                    {Object.keys(DEALS_DATA).map((city) => (
                      <button
                        key={city}
                        onClick={() => { setSelectedCity(city); setDropdownOpen(false) }}
                        className={`block w-full text-left px-4 py-2.5 text-sm hover:bg-gray-50 transition-colors ${selectedCity === city ? "font-bold text-[#ed1c24] bg-red-50" : "text-gray-700"}`}
                        role="option"
                        aria-selected={selectedCity === city}
                      >
                        {city}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Grid: 2 col tablet, 4 col desktop */}
          <div className="hidden sm:grid sm:grid-cols-2 md:grid-cols-4 gap-4">
            {currentDeals.map((deal) => (
              <DealCard key={deal.id} deal={deal} onClick={() => handleCardClick(deal)} />
            ))}
          </div>

          {/* Mobile: stacked full-width cards matching KQ (kenya-airways.com) */}
          <div className="sm:hidden flex flex-col gap-3">
            {currentDeals.slice(0, 4).map((deal) => (
              <div
                key={deal.id}
                onClick={() => handleCardClick(deal)}
                className="bg-white rounded-xl overflow-hidden flex flex-col cursor-pointer hover:shadow-md transition-all duration-300 group border border-gray-100"
              >
                <div className="relative w-full h-[180px] overflow-hidden">
                  <div className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105" style={{ backgroundImage: `url(${deal.image})` }} />
                  {/* Subtle bottom gradient for legibility if a label is overlaid */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/15 to-transparent" />
                  {/* KQ red accent bar — bottom-left like KQ */}
                  <div className="absolute bottom-0 left-0 w-6 h-1 bg-[#ed1c24] rounded-tr-sm" />
                </div>
                <div className="px-4 py-3 flex flex-col">
                  <h3 className="font-serif italic text-lg font-bold text-[#0d0d0d] leading-tight mb-1 group-hover:text-[#ed1c24] transition-colors">{deal.destination}</h3>
                  <p className="text-gray-500 text-xs leading-tight mb-2">{deal.dateRange}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-base font-black text-[#ed1c24]">{deal.price}</span>
                    <span className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Book</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* View all deals button */}
          <div className="flex justify-center mt-4">
            <button 
              onClick={() => router.push('/deals')}
              className="px-8 py-2.5 border-2 border-gray-900 rounded-full text-sm font-semibold hover:bg-gray-900 hover:text-white transition-colors"
            >
              View all deals
            </button>
          </div>
        </div>
      </div>

      {/* Drawer Overlay */}
      {drawerDeal && (
        <div className="fixed inset-0 z-[100] flex justify-end">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/50 transition-opacity" 
            onClick={() => setDrawerDeal(null)}
          />
          
          {/* Drawer Content */}
          <div className="relative w-full md:w-[480px] bg-white h-full shadow-2xl flex flex-col transform transition-transform duration-300 translate-x-0 overflow-y-auto">
            {/* Top Image Area */}
            <div className="relative h-[300px] w-full flex-shrink-0">
              <div 
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: `url(${drawerDeal.image})` }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/10" />
              
              <button 
                onClick={() => setDrawerDeal(null)}
                className="absolute top-4 right-4 p-2 bg-black/20 hover:bg-black/40 rounded-full text-white backdrop-blur-sm transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="absolute bottom-16 left-6 right-6 text-white">
                <div className="flex items-center gap-2 mb-2 font-bold text-sm tracking-wider uppercase">
                  <span>{selectedCity === "Nairobi" ? "NBO" : selectedCity === "Mombasa" ? "MBA" : "KIS"}</span>
                  <Plane className="w-4 h-4 transform rotate-45" />
                  <span>{drawerDeal.destCode}</span>
                </div>
                <h2 className="font-serif italic text-4xl font-bold mb-4">
                  {selectedCity} to {drawerDeal.destination}
                </h2>
                
                <div className="space-y-1 text-sm">
                  <p className="font-semibold text-gray-200">Round Trip in Economy Class</p>
                  <p className="font-bold text-xl text-white">From {drawerDeal.price}</p>
                </div>
                
                <div className="mt-4 grid grid-cols-2 gap-4 text-sm text-gray-300">
                  <div>
                    <p className="font-semibold text-white">Travel Dates</p>
                    <p>{drawerDeal.dateRange}</p>
                  </div>
                  <div>
                    <p className="font-semibold text-white">Trip Duration</p>
                    <p>5 days</p>
                  </div>
                </div>
                <div className="mt-2 text-sm text-gray-300">
                  <p className="font-semibold text-white">Promo Fare</p>
                </div>
              </div>
            </div>

            {/* Floating Action Card (Overlapping the image) */}
            <div className="relative -mt-8 mx-4 z-10 bg-[#0d0d0d] text-white rounded-xl p-4 flex flex-col md:flex-row items-center justify-between shadow-xl gap-4">
              <div className="flex items-center gap-2 font-semibold">
                <span>Flying to {drawerDeal.destination}?</span>
                <span className="text-gray-300">Here&apos;s what you need</span>
                <ArrowRight className="w-4 h-4 text-gray-400" />
              </div>
              <button 
                onClick={handleBookNow}
                className="w-full md:w-auto bg-[#ed1c24] hover:bg-[#A00D25] text-white px-8 py-3 rounded-md font-bold transition-colors shadow-md"
              >
                Book now
              </button>
            </div>

            {/* Fare Guidelines */}
            <div className="p-8 pt-10 flex-grow">
              <h3 className="font-bold text-lg text-black mb-4">Fare Guidelines</h3>
              <p className="text-gray-600 text-sm leading-relaxed mb-4">
                All Kenya Airways flight tickets are subject to availability and are governed by the Kenya Airways <a href="#" className="underline text-black">Conditions of Carriage</a> and relevant ticket conditions stated during the booking process. The fares may vary due to currency fluctuations and government tax regulations, depending on the booked itinerary. Please note the fare being displayed is for a return flight.
              </p>
              <p className="text-gray-600 text-sm leading-relaxed">
                It is essential to review the applicable fare rules and ticket conditions to understand the specific terms and guidelines. We recommend booking early to secure the best fare. Safe Travels!
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}