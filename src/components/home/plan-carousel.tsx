"use client"

// @ts-expect-error SplideJS types export mismatch
import { Splide, SplideSlide, SplideTrack } from "@splidejs/react-splide"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

const PLAN_ITEMS = [
  {
    title: "Baggage Information",
    image: "/baggage_info.png",
    link: "/plan/baggage-information/"
  },
  {
    title: "Travel Requirements",
    image: "/travel_reqs.png",
    link: "/plan/travel-information/"
  },
  {
    title: "Discover Where We Fly",
    image: "/where_we_fly.png",
    link: "/explore"
  },
  {
    title: "Special Care",
    image: "/special_care.png",
    link: "/plan/special-care/"
  }
]

export function PlanCarousel() {
  return (
    <div className="w-full py-4 md:py-6">
      <div className="max-w-[1200px] mx-auto md:px-4">
        <div className="flex items-center justify-between mb-5 px-4 md:px-0">
          <div className="flex items-center gap-3">
            <div className="w-5 h-1 bg-[#ed1c24] rounded-sm"></div>
            <h2 className="font-serif italic text-xl md:text-2xl font-bold text-[#0d0d0d]">Plan Your Trip</h2>
          </div>
        </div>

        {/* Desktop: 2x2 compact grid */}
        <div className="hidden md:grid md:grid-cols-2 gap-4 px-4 md:px-0">
          {PLAN_ITEMS.map((item) => (
            <Link
              key={item.title}
              href={item.link}
              className="block rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-500 group relative h-[190px]"
            >
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                style={{ backgroundImage: `url(${item.image})` }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              {/* KQ red accent line */}
              <div className="absolute bottom-0 left-0 w-10 h-1 bg-[#ed1c24] rounded-tr-sm" />
              <div className="absolute bottom-0 left-0 w-full p-5 text-white">
                <h3 className="font-sans text-base font-semibold flex items-center gap-2">
                  {item.title} <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </h3>
              </div>
            </Link>
          ))}
        </div>

        {/* Mobile: Carousel with full-width slides */}
        <div className="md:hidden">
          <Splide
            hasTrack={false}
            options={{
              type: "loop",
              perPage: 1,
              perMove: 1,
              gap: 0,
              padding: 0,
              arrows: false,
              pagination: true,
              autoplay: true,
              interval: 5000,
              pauseOnHover: false,
            }}
            className="pb-6 [&_.splide__pagination__page.is-active]:bg-[#ed1c24] [&_.splide__pagination__page]:bg-gray-300 [&_.splide__pagination]:bottom-2 [&_.splide__pagination]:z-20"
          >
            <SplideTrack>
              {PLAN_ITEMS.map((item, index) => (
                <SplideSlide key={index}>
                  <Link 
                    href={item.link}
                    className="block w-full overflow-hidden relative h-[160px]"
                  >
                    <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url('${item.image}')` }} />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
                    <div className="absolute bottom-0 left-0 w-full p-5 text-white">
                      <h3 className="font-sans text-sm font-semibold flex items-center gap-1.5">
                        {item.title} <ArrowRight className="w-4 h-4" />
                      </h3>
                    </div>
                  </Link>
                </SplideSlide>
              ))}
            </SplideTrack>
          </Splide>
        </div>
      </div>
    </div>
  )
}