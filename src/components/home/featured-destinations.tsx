"use client"

// @ts-expect-error SplideJS types export mismatch
import { Splide, SplideSlide, SplideTrack } from "@splidejs/react-splide"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

const FEATURED = [
  {
    id: 1,
    title: "Nairobi Stopover",
    subtitle: "Turn your layover into an adventure. 24–96 hours in Nairobi at no extra cost.",
    image: "/hero_nairobi_stopover.png",
    link: "/search"
  },
  {
    id: 2,
    title: "Fly to Dubai",
    subtitle: "Direct flights from Nairobi resumed. Non-stop travel with the Pride of Africa.",
    image: "/hero_dubai_desert.png",
    link: "/search"
  },
  {
    id: 3,
    title: "World Cup 2026",
    subtitle: "From Africa to New York. Your gateway to the world's biggest game.",
    image: "/hero_slide_3.png",
    link: "/search"
  }
]

export function FeaturedDestinations() {
  return (
    <section className="w-full py-0 md:py-14 bg-white">
      <div className="max-w-[1200px] mx-auto md:px-4">
        {/* Section Header */}
        <div className="flex items-center gap-3 mb-6 md:mb-8 px-4 md:px-0">
          <div className="w-4 md:w-6 h-1 bg-[#ed1c24] rounded-sm" />
          <h2 className="font-serif italic text-2xl md:text-4xl font-bold text-[#0d0d0d]">Where Will You Go?</h2>
        </div>

        {/* Carousel for all screen sizes */}
        <div className="md:px-0">
          <Splide
            hasTrack={false}
            options={{
              type: "loop",
              perPage: 3,
              perMove: 1,
              gap: "1.25rem",
              padding: { left: 0, right: 0 },
              arrows: false,
              pagination: true,
              autoplay: true,
              interval: 5000,
              pauseOnHover: true,
              breakpoints: {
                768: {
                  perPage: 1,
                  gap: 0,
                  padding: 0,
                  pagination: true,
                },
              },
            }}
            className="pb-8 [&_.splide__pagination__page.is-active]:bg-[#ed1c24] [&_.splide__pagination__page]:bg-gray-300 [&_.splide__pagination]:bottom-2 [&_.splide__pagination]:z-20"
          >
            <SplideTrack>
              {FEATURED.map(card => (
                <SplideSlide key={card.id}>
                  <FeatCard card={card} />
                </SplideSlide>
              ))}
            </SplideTrack>
          </Splide>
        </div>
      </div>
    </section>
  )
}

function FeatCard({ card }: { card: typeof FEATURED[0] }) {
  return (
    <div className="relative overflow-hidden group shadow-md hover:shadow-xl transition-all duration-500 flex flex-col h-[380px] md:h-[500px] rounded-none md:rounded-2xl">
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
        style={{ backgroundImage: `url(${card.image})` }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
      {/* KQ red accent marker — signature corner element */}
      <div className="absolute bottom-0 right-0 w-14 h-1 bg-[#ed1c24] rounded-tl-sm" />

      {/* Content */}
      <div className="relative mt-auto text-white z-10 p-6 pb-10 md:p-7">
        <h3 className="font-serif italic font-bold mb-2 leading-tight text-3xl md:text-3xl">{card.title}</h3>
        <p className="text-gray-200 mb-5 leading-relaxed text-base md:text-sm line-clamp-2">{card.subtitle}</p>
        <Link
          href={card.link}
          className="inline-flex items-center gap-2 bg-[#ed1c24] hover:bg-[#c91520] text-white font-bold rounded-md transition-all hover:scale-105 text-sm px-5 py-2.5 shadow-md"
        >
          Book Now <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  )
}
