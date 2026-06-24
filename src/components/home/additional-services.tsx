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

        {/* 2x2 grid on mobile, 4-col on desktop — matches KQ layout */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {/* Duty Free banner card */}
          <Link
            href="/duty-free"
            className="relative block w-full rounded-xl overflow-hidden group shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100"
          >
            <div className="relative w-full aspect-[4/5] md:aspect-[3/4]">
              <div className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105" style={{ backgroundImage: `url(/duty_free_luxury.png)` }} />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
              {/* KQ red accent — bottom-right corner */}
              <div className="absolute bottom-0 right-0 w-6 h-1 bg-[#ed1c24] rounded-tl-sm" />
              <div className="absolute bottom-0 left-0 right-0 p-3 flex justify-between items-end">
                <h3 className="text-white text-sm md:text-base font-bold font-sans leading-tight">Duty Free Shopping</h3>
                <div className="w-7 h-7 md:w-8 md:h-8 bg-[#ed1c24] text-white rounded-full flex items-center justify-center transform group-hover:scale-110 transition-transform shadow-md shrink-0 ml-2">
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </div>
          </Link>

          {/* Services cards — image on top, title + arrow below */}
          {services.map((service, index) => (
            <Link
              key={index}
              href={service.link}
              className="relative block w-full rounded-xl overflow-hidden group shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 bg-white"
            >
              <div className="relative w-full aspect-[4/5] md:aspect-[3/4]">
                <div className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105" style={{ backgroundImage: `url(${service.image})` }} />
                {/* KQ red accent — bottom-left */}
                <div className="absolute bottom-0 left-0 w-6 h-1 bg-[#ed1c24] rounded-tr-sm" />
                <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/60 to-transparent">
                  <div className="flex justify-between items-end">
                    <h3 className="text-white text-sm md:text-base font-bold font-sans leading-tight">{service.title}</h3>
                    <div className="w-7 h-7 md:w-8 md:h-8 bg-[#ed1c24] text-white rounded-full flex items-center justify-center transform group-hover:scale-110 transition-transform shadow-md shrink-0 ml-2">
                      <ArrowRight className="w-3.5 h-3.5" />
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}