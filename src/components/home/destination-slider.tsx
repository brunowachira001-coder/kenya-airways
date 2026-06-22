"use client"

import Link from "next/link"
import Image from "next/image"

export function DestinationSlider() {
  return (
    <section className="w-full py-6 md:py-16 bg-[#F8F8F8] overflow-hidden">
      <div className="max-w-content mx-auto px-4">
        <div className="relative w-full h-[200px] sm:h-[280px] md:h-[500px] rounded-2xl overflow-hidden shadow-card">
          
          <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(/gatwick_bg.png)` }} />
          <div className="absolute inset-0 bg-gradient-to-r from-black/30 to-black/10" />
          
          <div className="absolute top-0 left-0 z-10">
            <div className="bg-brand-primary text-white font-bold text-xs md:text-base px-3 md:px-6 py-2 md:py-3 rounded-br-[14px] md:rounded-br-[24px] shadow-md flex items-center">
              <span className="mr-1">↗</span> UP TO 10% OFF
            </div>
          </div>

          <div className="absolute inset-0 p-4 md:p-16 flex flex-col justify-center items-end text-right">
            <div className="max-w-[160px] sm:max-w-[240px] md:max-w-md">
              <Link 
                href="/book-manage"
                className="inline-flex items-center justify-center bg-brand-primary hover:bg-[#A00D25] text-white rounded-full h-9 md:h-12 px-5 md:px-8 text-sm md:text-base font-bold transition-colors shadow-lg"
              >
                Book Now
              </Link>
            </div>
          </div>

          <div 
            className="absolute bottom-0 right-0 h-10 md:h-24 bg-white flex items-center justify-center pl-6 pr-3 md:pl-12 md:pr-8"
            style={{ clipPath: 'polygon(2rem 0, 100% 0, 100% 100%, 0 100%)' }}
          >
            <Image src="/logo_gatwick.png" alt="Gatwick Logo" width={160} height={60} className="object-contain h-5 md:h-14 w-auto" />
          </div>

        </div>
      </div>
    </section>
  )
}
