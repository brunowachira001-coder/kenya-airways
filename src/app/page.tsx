import { HeroSlider } from "@/components/home/hero-slider"
import { BookingWidget } from "@/components/home/booking-widget"
import { QuickActions } from "@/components/home/quick-actions"
import { DealsSection } from "@/components/home/deals-section"
import { PlanCarousel } from "@/components/home/plan-carousel"
import { FeaturedDestinations } from "@/components/home/featured-destinations"
import { AdditionalServices } from "@/components/home/additional-services"
import { Newsletter } from "@/components/home/newsletter"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <div className="relative w-full">
        <HeroSlider />
        {/* BookingWidget overlay on desktop — positioned at bottom of hero */}
        <div className="hidden md:block absolute bottom-0 left-0 right-0 z-20 px-4 md:px-8 lg:px-12">
          <div className="max-w-[1140px] mx-auto">
            <BookingWidget />
          </div>
        </div>
        {/* BookingWidget inline below hero on mobile */}
        <div className="md:hidden px-3 py-4 bg-[#1c2a38]">
          <BookingWidget />
        </div>
      </div>

      <QuickActions />
      <div className="bg-white"><DealsSection /></div>
      <div className="bg-[#f8f8f8]"><PlanCarousel /></div>
      <div className="bg-white"><FeaturedDestinations /></div>
      <div className="bg-[#f8f8f8]"><AdditionalServices /></div>
      <div className="bg-white"><Newsletter /></div>
    </div>
  );
}
