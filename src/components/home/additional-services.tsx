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
    <section className="w-full py-5 md:py-8 px-4 bg-white">
      <div className="max-w-content mx-auto">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-5 h-1 bg-[#ed1c24] rounded-sm"></div>
          <h2 className="font-sans text-xl md:text-2xl font-bold text-[#0d0d0d]">Additional Services</h2>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Duty Free banner card */}
          <Link 
            href="/duty-free"
            className="relative block w-full h-[200px] md:h-[220px] rounded-2xl overflow-hidden group shadow-md hover:shadow-xl transition-all duration-500"
          >
            <div className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105" style={{ backgroundImage: `url(/duty_free_luxury.png)` }} />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
            {/* KQ red accent */}
            <div className="absolute bottom-0 right-0 w-10 h-1 bg-[#ed1c24] rounded-tl-sm" />
            <div className="absolute bottom-0 left-0 p-5 w-full flex justify-between items-end z-10">
              <div>
                <span className="bg-[#ed1c24] text-white text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded mb-1.5 inline-block">Duty Free</span>
                <h3 className="text-white text-lg md:text-2xl font-bold font-sans">Duty Free Shopping</h3>
              </div>
              <div className="w-9 h-9 bg-[#ed1c24] text-white rounded-full flex items-center justify-center transform group-hover:scale-110 transition-transform shadow-md shrink-0 ml-3">
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>
          </Link>

          {/* Services list - 3 cards in a column */}
          <div className="flex flex-col gap-3">
            {services.map((service, index) => (
              <Link 
                key={index} 
                href={service.link} 
                className="flex flex-row gap-3 p-3 bg-[#f8f8f8] hover:bg-gray-50 rounded-xl overflow-hidden border border-gray-100 hover:shadow-md hover:border-gray-200 transition-all duration-300 group"
              >
                <div className="relative w-20 h-20 md:w-24 md:h-24 overflow-hidden rounded-lg bg-gray-200 shrink-0">
                  <div className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105" style={{ backgroundImage: `url(${service.image})` }} />
                </div>
                <div className="flex flex-col justify-center flex-grow min-w-0 pr-2">
                  <h3 className="font-sans text-sm md:text-base font-bold text-[#0d0d0d] mb-0.5 group-hover:text-[#ed1c24] transition-colors leading-tight">
                    {service.title}
                  </h3>
                  <p className="text-gray-500 text-xs leading-relaxed line-clamp-2">
                    {service.description}
                  </p>
                </div>
                <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-[#ed1c24] shrink-0 self-center transition-colors" />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}