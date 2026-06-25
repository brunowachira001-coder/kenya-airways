"use client"

import Link from "next/link"
import { ArrowRight } from "lucide-react"

export function AdditionalServices() {
  const services = [
    {
      title: "Kool Flyer's Club",
      description: "Discover a world of great Student Offers with exclusive unlimited access when you sign up.",
      image: "/service_kool_flyers.jpg",
      // Was /plan/travel-services/kool-flyers-club/ — no such route. Link to the parent
      // functional page so the card no longer 404s.
      link: "/plan/travel-services"
    },
    {
      title: "Group Travel",
      description: "Travelling as a group, family or associates? It's fun travelling together but not always as fun to organize. Let us help you!",
      image: "/service_group_travel.jpg",
      // Was /book-manage/manage-booking/group-booking/ — no such route. Link to the
      // existing manage-booking page (functional form UI).
      link: "/book-manage/manage-booking"
    },
    {
      title: "Exquisite Charter Flights",
      description: "Fly beyond luxury in our Private Jets by booking from any of our tiers; Classy, Executive or Royal.",
      image: "/service_charter.jpg",
      // Was /plan/travel-services/charter-flights/ — no such route. Link to the parent
      // functional page so the card no longer 404s.
      link: "/plan/travel-services"
    }
  ]

  return (
    <div className="w-full py-4 md:py-6 px-4">
      <div className="max-w-content mx-auto">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-5 h-1 bg-[#ed1c24] rounded-sm"></div>
          <h2 className="font-sans text-base md:text-2xl font-bold text-[#0d0d0d]">Additional Services</h2>
        </div>

        {/* Mobile: 1 big Duty Free card on top + 3 stacked service cards (image-left) — matches KQ layout */}
        {/* Desktop: 4-col grid */}
        <div className="flex flex-col md:grid md:grid-cols-4 md:gap-3 gap-3">
          {/* Duty Free — large card with full-width image */}
          <Link
            href="/duty-free"
            className="relative block w-full h-[360px] md:h-[180px] rounded-xl overflow-hidden group shadow-sm hover:shadow-lg transition-all duration-300 order-1"
          >
            <div className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105" style={{ backgroundImage: `url(/duty_free_luxury.png)` }} />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
            {/* KQ red accent — bottom-right */}
            <div className="absolute bottom-0 right-0 w-8 h-1 bg-[#ed1c24] rounded-tl-sm" />
            <div className="absolute bottom-0 left-0 right-0 p-4 flex justify-between items-end">
              <h3 className="text-white text-lg md:text-base font-bold font-sans leading-tight">Duty Free Shopping</h3>
              <div className="w-8 h-8 bg-[#ed1c24] text-white rounded-full flex items-center justify-center transform group-hover:scale-110 transition-transform shadow-md shrink-0 ml-2">
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>
          </Link>

          {/* Service cards — horizontal layout on mobile (image left, text right) */}
          {services.map((service, index) => (
            <Link
              key={index}
              href={service.link}
              className={`relative flex w-full shrink-0 rounded-xl overflow-hidden group shadow-sm hover:shadow-lg transition-all duration-300 bg-white border border-gray-100 md:flex-col md:border-0 order-${index + 2}`}
            >
              {/* Image — 140x140 square on mobile, full-width on desktop */}
              <div className="relative w-[140px] h-[140px] md:w-full md:h-[120px] flex-shrink-0 overflow-hidden">
                <div className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105" style={{ backgroundImage: `url(${service.image})` }} />
                <div className="absolute bottom-0 left-0 w-8 h-1 bg-[#ed1c24] rounded-tr-sm" />
              </div>
              {/* Text — right side on mobile, below on desktop */}
              <div className="flex-1 md:flex-none px-4 py-3 md:px-0 md:py-2 flex flex-col justify-center">
                <h3 className="font-sans text-sm md:text-xs font-bold text-[#0d0d0d] group-hover:text-[#ed1c24] transition-colors leading-tight">
                  {service.title}
                </h3>
                <p className="hidden md:block text-gray-500 text-[10px] mt-1 leading-tight line-clamp-2">
                  {service.description}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}