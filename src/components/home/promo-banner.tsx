"use client"

// @ts-expect-error SplideJS types export mismatch with Node16/Bundler resolution
import { Splide, SplideSlide, SplideTrack } from "@splidejs/react-splide"

const OFFERS = [
  {
    id: 1,
    title: "Enjoy a Stopover in Nairobi",
    subtitle: "Transform a 24–96hr connection into a Nairobi escape.",
    image: "/kq_duty_free_banner.jpg",
    cta: "Book Your Stopover",
    link: "https://kqholidays.com"
  },
  {
    id: 2,
    title: "Enjoy Up to 10% Off as an Asante Rewards Member",
    subtitle: "Use Code: ASANTE10",
    image: "/kq_asante_rewards.jpg",
    cta: "Book Now",
    link: "/search?from=NBO&to=DXB&depart=2026-07-15&adults=1"
  },
  {
    id: 3,
    title: "Kenya Airways Safari Data",
    subtitle: "Stay connected anywhere with our eSIM global connectivity.",
    image: "/kq_safari_data.jpg",
    cta: "Order Now",
    link: "https://kqsafaridata.com"
  },
  {
    id: 4,
    title: "Treat Yourself Early",
    subtitle: "Pre-order your duty free items 48hrs before your flight.",
    image: "/duty_free_luxury.png",
    cta: "Shop Duty-Free Now",
    link: "https://kqdutyfree.com"
  },
  {
    id: 5,
    title: "The Koolest Way to go Back to School",
    subtitle: "Up to 30% off for students joining the Kool Flyer's Club.",
    image: "/service_kool_flyers.jpg",
    cta: "Register Today",
    link: "/plan/travel-services/kool-flyers-club/"
  }
]

export function PromoBanner() {
  return (
    <section className="w-full py-6 md:py-16 px-4 bg-[#f8f8f8] overflow-hidden">
      <div className="max-w-content mx-auto">
        <div className="flex items-center gap-3 mb-4 md:mb-8">
          <div className="w-4 md:w-6 h-1 bg-[#ed1c24] rounded-sm"></div>
          <h2 className="font-sans text-xl md:text-4xl font-bold text-[#0d0d0d]">Exclusive Offers</h2>
        </div>
        <Splide
          hasTrack={false}
          options={{
            type: "loop",
            perPage: 2,
            perMove: 1,
            gap: "1rem",
            autoplay: true,
            interval: 5000,
            arrows: false,
            pagination: true,
            breakpoints: {
              640: { perPage: 1, gap: "0.75rem" }
            }
          }}
          className="w-full pb-10 [&_.splide\_\_pagination]:bottom-0 [&_.splide\_\_pagination\_\_page.is-active]:bg-brand-primary [&_.splide\_\_pagination\_\_page]:bg-gray-300"
        >
          <SplideTrack className="pb-4">
            {OFFERS.map((offer) => (
              <SplideSlide key={offer.id}>
                <div className="relative w-full h-[200px] sm:h-[240px] md:h-[380px] rounded-xl overflow-hidden shadow-sm group">
                  <div className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105" style={{ backgroundImage: `url(${offer.image})` }} />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent" />
                  <div className="absolute inset-0 p-4 md:p-8 flex flex-col justify-end text-white">
                    <h3 className="font-sans text-sm md:text-2xl font-bold mb-1 md:mb-2 leading-snug">{offer.title}</h3>
                    <p className="text-gray-200 text-xs md:text-base mb-3 md:mb-5 opacity-90">{offer.subtitle}</p>
                    <div>
                      <a href={offer.link} className="inline-flex items-center justify-center bg-brand-primary hover:bg-[#A00D25] text-white rounded-md px-4 md:px-6 h-8 md:h-10 text-xs md:text-sm font-bold transition-colors">
                        {offer.cta}
                      </a>
                    </div>
                  </div>
                </div>
              </SplideSlide>
            ))}
          </SplideTrack>
        </Splide>
      </div>
    </section>
  )
}
