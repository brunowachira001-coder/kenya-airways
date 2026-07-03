"use client"

import { useEffect, useState, useRef } from "react"
// @ts-expect-error SplideJS types export mismatch with Node16/Bundler resolution
import { Splide, SplideSlide, SplideTrack } from "@splidejs/react-splide"
import '@splidejs/react-splide/css'
import { ChevronLeft, ChevronRight } from "lucide-react"

const HERO_SLIDES = [
  {
    id: 1,
    image: "/hero_slide_1.png",
    title: "Explore the World for Less with Visa",
    subtitle: "Domestic: Up to 5% Off | International: Up to 8% Off",
    promoCode: "Use Code: VISAKQ",
    hasCountdown: false,
    ctaText: "Book Now",
    ctaLink: "/search?from=NBO&to=MBA&depart=2026-07-15&adults=1"
  },
  {
    id: 2,
    image: "/hero_nairobi_stopover.png",
    title: "Enjoy a Stopover in Nairobi",
    subtitle: "Transform a 24 to 96-hour connection into an unforgettable Nairobi escape at no extra cost to your ticket.",
    hasCountdown: false,
    ctaText: "Book Your Stopover",
    ctaLink: "/search?from=MBA&to=NBO&depart=2026-07-15&adults=1"
  },
  {
    id: 3,
    image: "/hero_dubai_desert.png",
    title: "Dubai is Calling. The Skies Are Open.",
    subtitle: "Direct flights from Nairobi have officially resumed. Experience seamless, non-stop travel once again with the Pride of Africa.",
    hasCountdown: false,
    ctaText: "Book Now",
    ctaLink: "/search?from=NBO&to=DXB&depart=2026-07-15&adults=1"
  },
  {
    id: 4,
    image: "/hero_slide_3.png",
    title: "From Africa to New York",
    subtitle: "Your Gateway to the World's Biggest Game",
    promoCode: "Use Code: WCUP26",
    travelPeriod: "1st Jun – 15th Aug 2026",
    hasCountdown: true,
    targetDate: "2026-08-15T23:59:59",
    ctaText: "Book Now",
    ctaLink: "/search?from=NBO&to=JFK&depart=2026-08-01&adults=1"
  }
]

export function CountdownBar() {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 })

  useEffect(() => {
    const targetDate = new Date("2026-06-30T23:59:59")

    const tick = () => {
      const now = new Date()
      const diff = targetDate.getTime() - now.getTime()
      if (diff <= 0) return
      setTimeLeft({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((diff / 1000 / 60) % 60),
        seconds: Math.floor((diff / 1000) % 60),
      })
    }
    tick()
    const interval = setInterval(tick, 1000)
    return () => clearInterval(interval)
  }, [])

  const pad = (n: number) => n.toString().padStart(2, "0")

  return (
    <div className="w-full bg-[#1c3553] text-white text-sm font-semibold flex items-center justify-center gap-3 px-4 py-2.5">
      <span className="tracking-wide text-white/90">KQ &amp; VISA Sale Ends in:</span>
      
      {/* DAY */}
      <div className="flex items-center gap-1">
        <span className="bg-[#0d1e30] text-white font-bold text-base px-2.5 py-1 rounded min-w-[2.5rem] text-center tabular-nums">
          {timeLeft.days}
        </span>
        <span className="text-[10px] font-bold text-white/70 uppercase tracking-widest">DAY</span>
      </div>

      <span className="text-white/50 font-bold text-lg leading-none">:</span>

      {/* HRS */}
      <div className="flex items-center gap-1">
        <span className="bg-[#0d1e30] text-white font-bold text-base px-2.5 py-1 rounded min-w-[2.5rem] text-center tabular-nums">
          {pad(timeLeft.hours)}
        </span>
        <span className="text-[10px] font-bold text-white/70 uppercase tracking-widest">HRS</span>
      </div>

      <span className="text-white/50 font-bold text-lg leading-none">:</span>

      {/* MIN */}
      <div className="flex items-center gap-1">
        <span className="bg-[#0d1e30] text-white font-bold text-base px-2.5 py-1 rounded min-w-[2.5rem] text-center tabular-nums">
          {pad(timeLeft.minutes)}
        </span>
        <span className="text-[10px] font-bold text-white/70 uppercase tracking-widest">MIN</span>
      </div>

      <span className="text-white/50 font-bold text-lg leading-none">:</span>

      {/* SEC */}
      <div className="flex items-center gap-1">
        <span className="bg-[#0d1e30] text-white font-bold text-base px-2.5 py-1 rounded min-w-[2.5rem] text-center tabular-nums">
          {pad(timeLeft.seconds)}
        </span>
        <span className="text-[10px] font-bold text-white/70 uppercase tracking-widest">SEC</span>
      </div>
    </div>
  )
}

export function HeroSlider() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const splideRef = useRef<any>(null)

  const handlePrev = () => {
    if (splideRef.current) splideRef.current.splide.go("<")
  }
  const handleNext = () => {
    if (splideRef.current) splideRef.current.splide.go(">")
  }

  return (
    <section className="relative w-full h-[50vw] md:h-[72vh] min-h-[240px] md:min-h-[480px] max-h-[360px] md:max-h-none overflow-hidden">
      <Splide
        ref={splideRef}
        hasTrack={false}
        options={{
          type: "fade",
          rewind: true,
          autoplay: true,
          interval: 7000,
          pauseOnHover: false,
          arrows: false,
          pagination: true,
          speed: 1500,
        }}
        className="w-full h-full [&_.splide\_\_pagination\_\_page.is-active]:bg-[#ed1c24] [&_.splide\_\_pagination\_\_page]:bg-white/60 [&_.splide\_\_pagination]:bottom-3 md:[&_.splide\_\_pagination]:bottom-5"
      >
        <SplideTrack className="w-full h-full">
          {HERO_SLIDES.map((slide) => (
            <SplideSlide key={slide.id} className="relative w-full h-full">
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: `url(${slide.image})` }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-black/15" />

              {slide.id === 3 && (
                <div className="absolute left-[5%] top-[25%] z-20 flex flex-col items-center justify-center w-16 h-16 md:w-36 md:h-36 rounded-full bg-white/90 text-[#0d0d0d] text-center p-2 shadow-lg border border-white/40 animate-fade-in hidden xs:flex">
                  <div className="absolute inset-1.5 rounded-full border border-dashed border-gray-300" />
                  <span className="text-[6px] md:text-[9px] uppercase font-bold tracking-wider text-gray-500 leading-tight">Fly Nairobi</span>
                  <span className="text-[6px] md:text-[9px] uppercase font-bold tracking-wider text-gray-500 leading-tight">to Dubai Direct</span>
                  <span className="text-2xl md:text-4xl font-black text-[#0d0d0d] leading-none my-0.5">7x</span>
                  <span className="text-[8px] md:text-[11px] uppercase font-extrabold text-[#0d0d0d] tracking-wide leading-none">weekly</span>
                </div>
              )}

              {/* Slide content — optimized for mobile */}
              <div className="absolute inset-0 flex items-end pb-8 md:pb-24">
                <div className="max-w-[1440px] mx-auto px-4 md:px-12 w-full">
                  <div className="max-w-2xl text-white">
                    <h2 className="font-display text-lg sm:text-2xl md:text-5xl font-bold mb-1.5 md:mb-3 drop-shadow-lg tracking-tight leading-snug">
                      {slide.title}
                    </h2>
                    <p className="text-xs sm:text-sm md:text-lg mb-2.5 md:mb-4 opacity-90 drop-shadow max-w-xl leading-relaxed hidden sm:block">
                      {slide.subtitle}
                    </p>

                    {(slide.promoCode || slide.travelPeriod) && (
                      <div className="flex flex-col gap-1 mb-2.5 md:mb-5 hidden sm:flex">
                        {slide.promoCode && (
                          <p className="flex items-center gap-2 text-sm md:text-base font-bold">
                            <span className="inline-block w-5 h-0.5 bg-[#ed1c24]" />
                            {slide.promoCode}
                          </p>
                        )}
                        {slide.travelPeriod && (
                          <p className="text-xs md:text-sm font-medium opacity-90">Travel Period: {slide.travelPeriod}</p>
                        )}
                      </div>
                    )}

                    <a
                      href={slide.ctaLink}
                      className="inline-flex items-center justify-center bg-[#ed1c24] hover:bg-red-700 text-white rounded-md h-9 md:h-11 px-4 md:px-7 text-xs md:text-sm font-bold transition-colors shadow-md"
                    >
                      {slide.ctaText}
                    </a>
                  </div>
                </div>
              </div>
            </SplideSlide>
          ))}
        </SplideTrack>
      </Splide>

      {/* Prev/Next buttons – hidden on mobile */}
      <div className="hidden md:flex absolute right-6 md:right-12 bottom-16 z-30 items-center gap-2">
        <button
          onClick={handlePrev}
          className="w-10 h-10 rounded-full bg-black/50 hover:bg-[#ed1c24] text-white flex items-center justify-center transition-colors shadow-md"
          aria-label="Previous slide"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button
          onClick={handleNext}
          className="w-10 h-10 rounded-full bg-[#ed1c24] hover:bg-red-700 text-white flex items-center justify-center transition-colors shadow-md"
          aria-label="Next slide"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </section>
  )
}
