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
        <div className="hidden md:block absolute top-0 left-0 right-0 z-20 pt-0 px-4 md:px-8 max-w-[1440px] mx-auto">
          <BookingWidget />
        </div>
      </div>

      <QuickActions />
      <DealsSection />
      <PlanCarousel />
      <FeaturedDestinations />
      <AdditionalServices />
      <Newsletter />
    </div>
  );
}
