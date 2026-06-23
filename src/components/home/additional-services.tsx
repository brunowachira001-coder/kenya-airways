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
    <section className="w-full py-6 md:py-16 px-4 bg-white">
      <div className="max-w-content mx-auto">
        <div className="flex items-center gap-3 mb-4 md:mb-10">
          <div className="w-4 md:w-6 h-1 bg-[#ed1c24] rounded-sm"></div>
          <h2 className="font-sans text-xl md:text-4xl font-bold text-[#0d0d0d]">Additional Services</h2>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-8">
          {/* Duty Free tall card - Always visible, larger */}
          <Link 
            href="/duty-free"
            className="relative block w-full h-[240px] md:h-full min-h-[240px] md:min-h-[460px] rounded-2xl overflow-hidden group shadow-md hover:shadow-xl transition-all duration-500"
          >
            <div className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105" style={{ backgroundImage: `url(/duty_free_luxury.png)` }} />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
            {/* KQ red accent */}
            <div className="absolute bottom-0 right-0 w-14 h-1 bg-[#ed1c24] rounded-tl-sm" />
            <div className="absolute bottom-0 left-0 p-5 md:p-8 w-full flex justify-between items-end z-10">
              <div>
                <span className="bg-[#ed1c24] text-white text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded mb-1.5 md:mb-2 inline-block">Duty Free</span>
                <h3 className="text-white text-xl md:text-3xl font-bold font-sans">Duty Free Shopping</h3>
              </div>
              <div className="w-10 h-10 md:w-12 md:h-12 bg-[#ed1c24] text-white rounded-full flex items-center justify-center transform group-hover:scale-110 transition-transform shadow-md shrink-0 ml-3">
                <ArrowRight className="w-5 h-5 md:w-6 md:h-6" />
              </div>
            </div>
          </Link>

          {/* Services list */}
          <div className="flex flex-col gap-3 md:gap-5">
            {services.map((service, index) => (
              <Link 
                key={index} 
                href={service.link} 
                className="flex flex-row gap-3 md:gap-5 p-3 md:p-4 bg-[#f8f8f8] hover:bg-gray-50 rounded-2xl overflow-hidden border border-gray-100 hover:shadow-md hover:border-gray-200 transition-all duration-300 group min-h-[100px] md:min-h-[120px]"
              >
                <div className="relative w-24 h-24 md:w-28 md:h-28 overflow-hidden rounded-xl bg-gray-200 shrink-0">
                  <div className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105" style={{ backgroundImage: `url(${service.image})` }} />
                </div>
                <div className="flex flex-col justify-center flex-grow min-w-0 pr-2">
                  <h3 className="font-sans text-base md:text-xl font-bold text-[#0d0d0d] mb-1 group-hover:text-[#ed1c24] transition-colors leading-tight">
                    {service.title}
                  </h3>
                  <p className="text-gray-500 text-xs md:text-sm leading-relaxed line-clamp-2">
                    {service.description}
                  </p>
                </div>
                <ArrowRight className="w-5 h-5 text-gray-300 group-hover:text-[#ed1c24] shrink-0 self-center transition-colors" />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
