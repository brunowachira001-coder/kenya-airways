"use client"

import Link from "next/link"
import { Plane, ArrowRight, Tag } from "lucide-react"

export function BookTripCTA() {
  return (
    <section className="w-full bg-gradient-to-br from-[#1c2a38] via-[#1a2e42] to-[#0f1c2e] py-12 md:py-16 px-4">
      <div className="max-w-content mx-auto">
        <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
          
          {/* Left: Text content */}
          <div className="flex-1 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 bg-[#ed1c24]/20 text-[#ed1c24] px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-4">
              <Tag className="w-3 h-3" />
              Book Now
            </div>
            <h2 className="font-display text-3xl md:text-5xl font-bold text-white mb-4 leading-tight">
              Book Your Next Adventure
            </h2>
            <p className="text-white/70 text-base md:text-lg max-w-lg mx-auto lg:mx-0 leading-relaxed">
              Find flights to over 50 destinations worldwide with Kenya Airways. Experience the Pride of Africa with world-class service.
            </p>
            
            {/* Stats */}
            <div className="flex items-center gap-6 mt-6 justify-center lg:justify-start">
              <div className="text-center">
                <p className="text-2xl font-black text-white">50+</p>
                <p className="text-xs text-white/50 font-medium">Destinations</p>
              </div>
              <div className="w-px h-8 bg-white/20" />
              <div className="text-center">
                <p className="text-2xl font-black text-white">Daily</p>
                <p className="text-xs text-white/50 font-medium">Flights</p>
              </div>
              <div className="w-px h-8 bg-white/20" />
              <div className="text-center">
                <p className="text-2xl font-black text-white">4-Star</p>
                <p className="text-xs text-white/50 font-medium">Airline Rating</p>
              </div>
            </div>
          </div>

          {/* Right: CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 lg:flex-col lg:gap-4">
            <Link
              href="/search"
              className="group flex items-center justify-center gap-3 bg-[#ed1c24] hover:bg-[#c11218] text-white font-bold rounded-xl px-8 py-4 text-base transition-all shadow-lg hover:shadow-xl hover:scale-[1.02] min-w-[220px]"
            >
              <Plane className="w-5 h-5" />
              Search Flights
              <ArrowRight className="w-4 h-4 opacity-70 group-hover:translate-x-1 transition-transform" />
            </Link>
            
            <Link
              href="/deals"
              className="group flex items-center justify-center gap-3 bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl px-8 py-4 text-base transition-all border border-white/20 hover:border-white/30 min-w-[220px]"
            >
              <Tag className="w-5 h-5" />
              View Deals
              <ArrowRight className="w-4 h-4 opacity-70 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

        </div>
      </div>
    </section>
  )
}