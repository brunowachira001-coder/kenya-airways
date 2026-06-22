"use client"

import { Palmtree, ArrowRight, Star } from "lucide-react"

const VACATION_PACKAGES = [
  {
    title: "Zanzibar Island Beach Escape",
    duration: "5 Days / 4 Nights",
    description: "Relax on white sand beaches, tour historic Stone Town, and enjoy premium resort accommodations.",
    image: "/dest_mombasa.png", // Zanzibari beach lookalike
    price: "KES 64,000",
    rating: 4.8,
  },
  {
    title: "Maasai Mara Luxury Safari",
    duration: "3 Days / 2 Nights",
    description: "Experience spectacular game drives, see the Big Five, and sleep under the stars in a luxury tented camp.",
    image: "/where_we_fly.png", // Safari lookalike
    price: "KES 52,500",
    rating: 4.9,
  },
  {
    title: "Dubai City Lights & Desert Safari",
    duration: "6 Days / 5 Nights",
    description: "Shop at global malls, view the Burj Khalifa, and enjoy a traditional desert camp dinner.",
    image: "/dest_dubai.png",
    price: "KES 92,000",
    rating: 4.7,
  },
]

export default function KqHolidaysPage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Header */}
      <div 
        className="relative h-[40vh] min-h-[300px] bg-cover bg-center flex items-end pb-12 text-white"
        style={{ backgroundImage: `url('/hero_slide_1.png')` }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
        <div className="max-w-content mx-auto px-4 w-full relative z-10">
          <div className="max-w-2xl">
            <span className="bg-[#ed1c24] text-xs uppercase px-2.5 py-1 rounded font-bold tracking-wider mb-3 inline-block">
              KQ Holidays
            </span>
            <h1 className="text-4xl md:text-5xl font-display font-bold tracking-tight mb-2">
              Book Your Perfect Vacation
            </h1>
            <p className="text-lg opacity-90">
              Complete flight, hotel, and transfer packages curated by our travel experts.
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-content mx-auto px-4 py-12 md:py-16 w-full">
        <div className="flex items-center gap-3 mb-8">
          <Palmtree className="w-6 h-6 text-[#ed1c24]" />
          <h2 className="text-2xl md:text-3xl font-bold font-sans text-[#0d0d0d]">Trending Holiday Packages</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {VACATION_PACKAGES.map((pkg, idx) => (
            <div 
              key={idx}
              className="bg-white rounded-xl overflow-hidden shadow-card border border-gray-100 flex flex-col justify-between hover:shadow-lg transition-shadow"
            >
              <div 
                className="h-48 bg-cover bg-center relative"
                style={{ backgroundImage: `url('${pkg.image}')` }}
              >
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm text-[#0d0d0d] px-2.5 py-1 rounded-md text-xs font-bold flex items-center gap-1 shadow-sm">
                  <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                  {pkg.rating}
                </div>
                <div className="absolute bottom-4 left-4 bg-[#0d0d0d]/80 text-white px-2 py-0.5 rounded text-xs font-medium">
                  {pkg.duration}
                </div>
              </div>
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-xl font-bold mb-2 text-[#0d0d0d] leading-tight">{pkg.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed mb-4">{pkg.description}</p>
                  <div className="flex items-baseline gap-1.5 mb-6">
                    <span className="text-xs text-gray-400">Package from</span>
                    <span className="text-lg font-extrabold text-[#ed1c24]">{pkg.price}</span>
                    <span className="text-[10px] text-gray-400">/ person</span>
                  </div>
                </div>
                <a 
                  href="https://www.kqholidays.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-full bg-[#0d0d0d] hover:bg-[#ed1c24] text-white font-semibold py-2.5 rounded-md transition-colors flex items-center justify-center gap-2 text-sm text-center"
                >
                  Inquire Now <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
