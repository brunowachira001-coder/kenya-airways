"use client"

import { Compass, MapPin, ArrowRight } from "lucide-react"
import { useBookingStore } from "@/store/booking-store"
import { useRouter } from "next/navigation"

const DESTINATIONS = [
  { city: "Mombasa", code: "MBA", country: "Kenya", image: "/dest_mombasa.png", price: "KES 4,800" },
  { city: "Dubai", code: "DXB", country: "UAE", image: "/dest_dubai.png", price: "KES 27,300" },
  { city: "Mumbai", code: "BOM", country: "India", image: "/dest_mumbai.png", price: "KES 31,300" },
  { city: "London", code: "LHR", country: "UK", image: "/hero_slide_2.png", price: "KES 53,900" },
  { city: "New York", code: "JFK", country: "USA", image: "/hero_slide_3.png", price: "KES 69,000" },
]

export default function ExplorePage() {
  const router = useRouter()
  const { setDestination, setOrigin, setDepartureDate, setTripType } = useBookingStore()

  const handleBookDestination = (code: string) => {
    setOrigin("NBO")
    setDestination(code)
    setTripType("round-trip")
    
    // Set departure to tomorrow
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    setDepartureDate(tomorrow.toISOString())

    router.push("/")
  }

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Header */}
      <div 
        className="relative h-[40vh] min-h-[300px] bg-cover bg-center flex items-end pb-12 text-white"
        style={{ backgroundImage: `url('/where_we_fly.png')` }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
        <div className="max-w-content mx-auto px-4 w-full relative z-10">
          <div className="max-w-2xl">
            <span className="bg-[#ed1c24] text-xs uppercase px-2.5 py-1 rounded font-bold tracking-wider mb-3 inline-block">
              Destinations
            </span>
            <h1 className="text-4xl md:text-5xl font-display font-bold tracking-tight mb-2">
              Explore Our World
            </h1>
            <p className="text-lg opacity-90">
              Discover beautiful destinations across the Pride of Africa network.
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-content mx-auto px-4 py-12 md:py-16 w-full">
        <div className="flex items-center gap-3 mb-8">
          <Compass className="w-6 h-6 text-[#ed1c24]" />
          <h2 className="text-2xl md:text-3xl font-bold font-sans">Popular Routes & Offers</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {DESTINATIONS.map((dest) => (
            <div 
              key={dest.code}
              className="bg-white rounded-xl overflow-hidden shadow-card border border-gray-100 flex flex-col justify-between hover:shadow-lg transition-shadow"
            >
              <div 
                className="h-48 bg-cover bg-center relative"
                style={{ backgroundImage: `url('${dest.image}')` }}
              >
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm text-[#0d0d0d] px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-sm">
                  <MapPin className="w-3.5 h-3.5 text-[#ed1c24]" />
                  {dest.city} ({dest.code})
                </div>
              </div>
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-xl font-bold mb-1 text-[#0d0d0d]">{dest.city}</h3>
                  <p className="text-sm text-gray-500 mb-4">{dest.country}</p>
                  <div className="flex items-baseline gap-1.5 mb-6">
                    <span className="text-xs text-gray-400">Fares from</span>
                    <span className="text-lg font-extrabold text-[#ed1c24]">{dest.price}</span>
                  </div>
                </div>
                <button
                  onClick={() => handleBookDestination(dest.code)}
                  className="w-full bg-[#0d0d0d] hover:bg-[#ed1c24] text-white font-semibold py-2.5 rounded-md transition-colors flex items-center justify-center gap-2 text-sm"
                >
                  Book Flight <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
