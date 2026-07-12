"use client"

import Link from "next/link"
import { ArrowRight } from "lucide-react"

export function AdditionalServices() {
  const services = [
    {
      title: "Duty Free Shopping",
      description: "Pre-order your favourite products onboard and have them delivered to your seat.",
      image: "/kq_duty_free_banner.jpg",
      link: "/duty-free",
      featured: true,
    },
    {
      title: "Group Travel",
      description: "Travelling as a group, family or associates?  It's fun travelling together but not always as fun to organize. Let us help you!",
      image: "/service_group_travel.jpg",
      link: "/book-manage/manage-booking",
    },
    {
      title: "Kool Flyer's Club",
      description: "Discover a world of great Student Offers with exclusive unlimited access when you sign up.",
      image: "/service_kool_flyers.jpg",
      link: "/plan/travel-services",
    },
    {
      title: "Exquisite Charter Flights",
      description: "Fly beyond luxury in our Private Jets by booking from any of our tiers; Classy, Executive or Royal.",
      image: "/service_charter.jpg",
      link: "/plan/travel-services",
    },
  ]

  const featured = services[0]
  const rest = services.slice(1)

  return (
    <section className="w-full bg-white py-6 md:py-10 px-4">
      <div className="max-w-content mx-auto">
        {/* Section heading — matches KQ: small red bar + bold title */}
        <div className="flex items-center gap-3 mb-5 md:mb-6">
          <div className="w-5 h-1 bg-[#ed1c24] rounded-sm" />
          <h2 className="font-sans text-base md:text-2xl font-bold text-[#0d0d0d] tracking-tight">
            Additional Services
          </h2>
        </div>

        {/* Desktop: 4-col grid. Featured card spans 1 col on desktop but renders taller.
            Mobile: featured first, then 3 stacked rows (image left, text right). */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 md:gap-4">
          {/* Featured card — Duty Free Shopping (large, tall, full-bleed image with overlay) */}
          <Link
            href={featured.link}
            className="relative block w-full h-[260px] md:h-[420px] rounded-xl overflow-hidden group shadow-sm hover:shadow-lg transition-all duration-300 md:row-span-2"
          >
            <div
              className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
              style={{ backgroundImage: `url(${featured.image})` }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
            {/* KQ red accent — bottom-right */}
            <div className="absolute bottom-0 right-0 w-10 h-1 bg-[#ed1c24] rounded-tl-sm" />
            <div className="absolute bottom-0 left-0 right-0 p-5 md:p-6 flex justify-between items-end gap-3">
              <div className="flex-1">
                <h3 className="text-white text-xl md:text-2xl font-bold font-sans leading-tight mb-2">
                  {featured.title}
                </h3>
                <p className="hidden md:block text-white/85 text-sm leading-snug max-w-xs">
                  {featured.description}
                </p>
              </div>
              <div className="w-10 h-10 bg-[#ed1c24] text-white rounded-full flex items-center justify-center transform group-hover:scale-110 transition-transform shadow-md shrink-0">
                <ArrowRight className="w-5 h-5" />
              </div>
            </div>
          </Link>

          {/* Service cards — KQ style: image-top on desktop, image-left on mobile, with title + description */}
          {rest.map((service) => (
            <Link
              key={service.title}
              href={service.link}
              className="relative flex w-full rounded-xl overflow-hidden group shadow-sm hover:shadow-lg transition-all duration-300 bg-white border border-gray-100 md:flex-col md:border-0"
            >
              {/* Image — square on mobile, full-width on desktop */}
              <div className="relative w-[140px] h-[140px] md:w-full md:h-[140px] flex-shrink-0 overflow-hidden">
                <div
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                  style={{ backgroundImage: `url(${service.image})` }}
                />
                <div className="absolute bottom-0 left-0 w-10 h-1 bg-[#ed1c24] rounded-tr-sm" />
              </div>
              {/* Text */}
              <div className="flex-1 md:flex-none px-4 py-3 md:px-0 md:pt-3 md:pb-4 flex flex-col justify-center">
                <h3 className="font-sans text-sm md:text-base font-bold text-[#0d0d0d] group-hover:text-[#ed1c24] transition-colors leading-tight mb-1">
                  {service.title}
                </h3>
                <p className="text-gray-500 text-xs md:text-[13px] leading-snug line-clamp-3 md:line-clamp-3">
                  {service.description}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
