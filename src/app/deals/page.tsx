"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Plane, ArrowRight, Calendar, MapPin } from "lucide-react"
import { Deal, getDealsByRegion } from "@/lib/deals"
import { useBookingStore } from "@/store/booking-store"

type Region = "All" | "Africa" | "Europe" | "Asia" | "America" | "Middle East"

const REGIONS: Region[] = ["All", "Africa", "Europe", "Asia", "America", "Middle East"]

function DealCard({ deal, onBookNow }: { deal: Deal; onBookNow: (deal: Deal) => void }) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden group flex flex-col cursor-pointer hover:shadow-lg hover:border-gray-300 transition-all duration-300">
      {/* Image */}
      <div className="relative h-[160px] md:h-[200px] w-full overflow-hidden bg-gray-100">
        <div 
          className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105" 
          style={{ backgroundImage: `url(${deal.image})` }} 
        />
        {/* Red accent bar */}
        <div className="absolute bottom-0 left-0 w-8 md:w-10 h-1.5 bg-[#ed1c24] rounded-tr-sm" />
        {/* Cabin class badge */}
        <div className="absolute top-3 right-3 bg-black/70 backdrop-blur-sm text-white text-xs font-semibold px-2.5 py-1 rounded-full">
          {deal.cabinClass}
        </div>
      </div>

      {/* Content */}
      <div className="p-3 md:p-4 flex flex-col flex-grow">
        {/* Route */}
        <div className="flex items-center gap-1.5 mb-2">
          <span className="text-xs md:text-sm font-bold text-[#0d0d0d]">{deal.origin}</span>
          <Plane className="w-3 h-3 text-[#ed1c24] transform rotate-45" />
          <span className="text-xs md:text-sm font-bold text-[#ed1c24]">{deal.destination}</span>
        </div>

        {/* Destination city */}
        <h3 className="font-sans text-base md:text-lg font-bold mb-1 text-[#0d0d0d] italic group-hover:text-[#ed1c24] transition-colors leading-tight">
          {deal.destinationCity}
        </h3>

        {/* Country */}
        <p className="text-gray-500 text-[10px] md:text-xs font-medium mb-2 flex items-center gap-1">
          <MapPin className="w-3 h-3" />
          {deal.country}
        </p>

        {/* Date range */}
        <div className="flex items-center gap-1.5 mb-2">
          <Calendar className="w-3 h-3 text-gray-400" />
          <p className="text-gray-500 text-[10px] md:text-xs">{deal.dateRange}</p>
        </div>

        {/* Region tag */}
        <div className="mb-3">
          <span className="inline-block bg-gray-100 text-gray-600 text-[10px] md:text-xs px-2 py-0.5 rounded-full font-medium">
            {deal.region}
          </span>
        </div>

        {/* Price and Book Button */}
        <div className="mt-auto flex items-center justify-between">
          <span className="text-sm md:text-base font-black text-[#0d0d0d]">{deal.price}</span>
          <button 
            onClick={(e) => {
              e.stopPropagation()
              onBookNow(deal)
            }}
            className="bg-[#ed1c24] hover:bg-[#c4191f] text-white text-xs md:text-sm font-semibold px-4 py-2 rounded-md transition-colors flex items-center gap-1"
          >
            Book Now
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>
      </div>
    </div>
  )
}

function DealsHero() {
  return (
    <section className="relative bg-gradient-to-r from-[#0d0d0d] to-[#2a2a2a] py-16 md:py-24 px-4">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{ 
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>
      
      <div className="max-w-content mx-auto relative z-10">
        <div className="text-center">
          <h1 className="font-serif italic text-4xl md:text-5xl lg:text-6xl text-white mb-4">
            Flight Deals
          </h1>
          <p className="text-gray-300 text-lg md:text-xl max-w-2xl mx-auto">
            Discover amazing fares to destinations across Africa, Europe, Asia, Middle East, and the Americas
          </p>
        </div>
        
        {/* Best Price Badge */}
        <div className="flex justify-center mt-8">
          <img 
            src="/logo_best_price.svg" 
            alt="KQ Best Price Guarantee" 
            className="h-12 md:h-14 w-auto"
          />
        </div>
      </div>
    </section>
  )
}

function RegionFilter({ 
  selectedRegion, 
  onRegionChange 
}: { 
  selectedRegion: Region
  onRegionChange: (region: Region) => void 
}) {
  return (
    <div className="w-full overflow-x-auto pb-2">
      <div className="flex gap-2 min-w-max">
        {REGIONS.map((region) => (
          <button
            key={region}
            onClick={() => onRegionChange(region)}
            className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-200 whitespace-nowrap ${
              selectedRegion === region
                ? "bg-[#ed1c24] text-white shadow-md"
                : "bg-white border border-gray-300 text-gray-700 hover:border-[#ed1c24] hover:text-[#ed1c24]"
            }`}
          >
            {region}
          </button>
        ))}
      </div>
    </div>
  )
}

function DealsGrid({ 
  deals, 
  onBookNow 
}: { 
  deals: Deal[]
  onBookNow: (deal: Deal) => void 
}) {
  if (deals.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-gray-500 text-lg">No deals available for this region.</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {deals.map((deal) => (
        <DealCard key={deal.id} deal={deal} onBookNow={onBookNow} />
      ))}
    </div>
  )
}

export default function DealsPage() {
  const router = useRouter()
  const { setOrigin, setDestination, setTripType, setDepartureDate, setReturnDate, setCabinClass } = useBookingStore()
  
  const [selectedRegion, setSelectedRegion] = useState<Region>("All")

  const filteredDeals = getDealsByRegion(selectedRegion === "All" ? undefined : selectedRegion)

  const handleBookNow = (deal: Deal) => {
    // Set booking store values
    setOrigin(deal.origin)
    setDestination(deal.destination)
    setTripType("round-trip")
    setCabinClass(deal.cabinClass)
    
    // Set dates: tomorrow to tomorrow + 7 days
    const today = new Date()
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)
    const dayAfter = new Date(today)
    dayAfter.setDate(dayAfter.getDate() + 8)
    
    setDepartureDate(tomorrow.toISOString())
    setReturnDate(dayAfter.toISOString())
    
    // Build search URL
    const depStr = tomorrow.toISOString().split("T")[0]
    const retStr = dayAfter.toISOString().split("T")[0]
    const cabinParam = deal.cabinClass.toLowerCase()
    
    router.push(
      `/search?from=${deal.origin}&to=${deal.destination}&depart=${depStr}&return=${retStr}&adults=1&cabin=${cabinParam}`
    )
  }

  return (
    <main className="min-h-screen bg-gray-50">
      {/* SEO Meta */}
      <title>Flight Deals | Kenya Airways</title>
      
      {/* Hero Section */}
      <DealsHero />
      
      {/* Main Content */}
      <section className="max-w-content mx-auto px-4 py-8 md:py-12">
        {/* Region Filter */}
        <div className="mb-8">
          <h2 className="text-xl md:text-2xl font-bold text-[#0d0d0d] mb-4">Filter by Region</h2>
          <RegionFilter selectedRegion={selectedRegion} onRegionChange={setSelectedRegion} />
        </div>
        
        {/* Results count */}
        <div className="mb-6 flex items-center justify-between">
          <p className="text-gray-600 text-sm md:text-base">
            Showing <span className="font-bold text-[#0d0d0d]">{filteredDeals.length}</span> deal{filteredDeals.length !== 1 ? "s" : ""}
            {selectedRegion !== "All" && <span> in <span className="font-semibold text-[#ed1c24]">{selectedRegion}</span></span>}
          </p>
        </div>
        
        {/* Deals Grid */}
        <DealsGrid deals={filteredDeals} onBookNow={handleBookNow} />
        
        {/* Bottom CTA */}
        <div className="mt-12 text-center bg-white rounded-xl p-8 shadow-sm border border-gray-100">
          <h3 className="text-xl md:text-2xl font-bold text-[#0d0d0d] mb-3">
            Can&apos;t find your perfect destination?
          </h3>
          <p className="text-gray-600 mb-6 max-w-lg mx-auto">
            Explore all our destinations and discover even more travel opportunities with Kenya Airways.
          </p>
          <button 
            onClick={() => router.push('/search')}
            className="px-8 py-3 bg-[#ed1c24] hover:bg-[#c4191f] text-white font-semibold rounded-md transition-colors"
          >
            Search All Flights
          </button>
        </div>
      </section>
    </main>
  )
}