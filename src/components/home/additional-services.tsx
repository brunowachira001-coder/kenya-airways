"use client"

import Link from "next/link"
import { ArrowRight } from "lucide-react"

export function AdditionalServices() {
  const services = [
    {
      title: "Kool Flyer's Club",
      description: "Discover a world of great Student Offers with exclusive unlimited access when you sign up.",
      image: "/service_kool_flyers.jpg",
      link: "/plan/travel-services/kool-flyers-club/"
    },
    {
      title: "Group Travel",
      description: "Travelling as a group, family or associates? It's fun travelling together but not always as fun to organize. Let us help you!",
      image: "/service_group_travel.jpg",
      link: "/book-manage/manage-booking/group-booking/"
    },
    {
      title: "Exquisite Charter Flights",
      description: "Fly beyond luxury in our Private Jets by booking from any of our tiers; Classy, Executive or Royal.",
      image: "/service_charter.jpg",
      link: "/plan/travel-services/charter-flights/"
    }
  ]

  return (
    <div className="w-full py-4 md:py-6 px-4">
      <div className="max-w-content mx-auto">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-5 h-1 bg-[#ed1c24] rounded-sm"></div>
          <h2 className="font-sans text-base md:text-2xl font-bold text-[#0d0d0d]">Additional Services</h2>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-2 gap-3">
          {/* Duty Free banner card — takes 1 column */}
          <Link 
            href="/duty-free"
            className="relative block w-full h-[140px] md:h-[180px] rounded-2xl overflow-hidden group shadow-md hover:shadow-xl transition-all duration-500"
          >
            <div className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105" style={{ backgroundImage: `url(/duty_free_luxury.png)` }} />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
            {/* KQ red accent */}
            <div className="absolute bottom-0 right-0 w-10 h-1 bg-[#ed1c24] rounded-tl-sm" />
            <div className="absolute bottom-0 left-0 p-4 w-full flex justify-between items-end z-10">
              <div>
                <span className="bg-[#ed1c24] text-white text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded mb-1 inline-block">Duty Free</span>
                <h3 className="text-white text-base md:text-xl font-bold font-sans">Duty Free Shopping</h3>
              </div>
              <div className="w-8 h-8 bg-[#ed1c24] text-white rounded-full flex items-center justify-center transform group-hover:scale-110 transition-transform shadow-md shrink-0 ml-2">
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>
          </Link>

          {/* Services list - 3 cards in a row */}
          <div className="grid grid-cols-3 gap-3">
            {services.map((service, index) => (
              <Link 
                key={index} 
                href={service.link} 
                className="flex flex-col items-center text-center p-2 bg-[#f8f8f8] hover:bg-gray-50 rounded-xl overflow-hidden border border-gray-100 hover:shadow-md hover:border-gray-200 transition-all duration-300 group relative"
              >
                <div className="relative w-full h-[60px] md:h-[70px] overflow-hidden rounded-lg bg-gray-200 mb-2">
                  <div className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105" style={{ backgroundImage: `url(${service.image})` }} />
                  <div className="absolute bottom-0 left-0 w-8 h-1 bg-[#ed1c24] rounded-tr-sm" />
                </div>
                <h3 className="font-sans text-[10px] md:text-xs font-bold text-[#0d0d0d] group-hover:text-[#ed1c24] transition-colors leading-tight">
                  {service.title}
                </h3>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}