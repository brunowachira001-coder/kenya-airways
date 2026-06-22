import { PageHero } from "@/components/shared/page-hero"
import { RelatedArticles } from "@/components/shared/related-articles"
import { Breadcrumb } from "@/components/shared/breadcrumb"
import { Shield, Car, Hotel, CreditCard, Smartphone, Globe, CheckCircle, ArrowRight } from "lucide-react"

const SERVICES = [
  {
    icon: <Shield className="w-10 h-10" />,
    title: "Travel Insurance",
    description:
      "Protect your trip from the unexpected. Kenya Airways partners with AIG to offer comprehensive travel insurance covering medical emergencies, trip cancellation, lost baggage, and flight delays.",
    highlights: [
      "Medical coverage up to USD 1,000,000",
      "Trip cancellation and interruption",
      "Baggage loss & delay protection",
      "24/7 emergency assistance hotline",
    ],
    cta: "Get a Quote",
    ctaHref: "#",
    color: "#ed1c24",
  },
  {
    icon: <Car className="w-10 h-10" />,
    title: "Car Hire",
    description:
      "Hit the ground running at your destination. Book a rental car through our partner network and enjoy competitive rates with vehicles waiting for you on arrival — no queues, no stress.",
    highlights: [
      "Partner networks at 150+ airports",
      "Economy, SUV, and premium options",
      "Flexible pick-up and drop-off",
      "Earn Asante miles on select rentals",
    ],
    cta: "Browse Cars",
    ctaHref: "#",
    color: "#0d0d0d",
  },
  {
    icon: <Hotel className="w-10 h-10" />,
    title: "Hotel Bookings",
    description:
      "Complete your trip package with hand-picked hotels. From budget guesthouses to five-star resorts, our hotel booking platform offers curated options at your destination, bundled with your flight for savings.",
    highlights: [
      "50,000+ hotels worldwide",
      "Flexible cancellation policies",
      "Exclusive rates for KQ passengers",
      "Earn Asante Rewards on bookings",
    ],
    cta: "Find Hotels",
    ctaHref: "#",
    color: "#ed1c24",
  },
  {
    icon: <Globe className="w-10 h-10" />,
    title: "Visa Assistance",
    description:
      "Navigating visa requirements can be complex. Our visa assistance service provides step-by-step guidance, application support, and up-to-date entry requirements for all the destinations we fly to.",
    highlights: [
      "Destination-specific visa guides",
      "eVisa application support",
      "Documentation checklists",
      "Partner facilitation for complex visas",
    ],
    cta: "Check Requirements",
    ctaHref: "/plan/travel-information",
    color: "#0d0d0d",
  },
  {
    icon: <Smartphone className="w-10 h-10" />,
    title: "Kenya Airways App",
    description:
      "Manage your entire trip from your pocket. The Kenya Airways mobile app lets you book flights, check in, access your boarding pass, track your flight in real-time, and manage your Asante Rewards account.",
    highlights: [
      "Mobile check-in up to 30 hours before departure",
      "Digital boarding pass on your phone",
      "Real-time flight status & notifications",
      "Asante miles balance and redemption",
    ],
    cta: "Download App",
    ctaHref: "#",
    color: "#ed1c24",
  },
  {
    icon: <CreditCard className="w-10 h-10" />,
    title: "Flexible Payment Options",
    description:
      "Book now, pay your way. Kenya Airways accepts Visa, Mastercard, M-Pesa, bank transfers, and BNPL (Buy Now, Pay Later) options through our partners, making it easier than ever to secure your journey.",
    highlights: [
      "M-Pesa & mobile money accepted",
      "BNPL through select partners",
      "Multi-currency payment support",
      "Secure 3D-verified transactions",
    ],
    cta: "Learn More",
    ctaHref: "/help",
    color: "#0d0d0d",
  },
]

export default function TravelServicesPage() {
  return (
    <>
      <PageHero
        title="Travel Services"
        subtitle="Enhance your journey with our range of additional services and exclusive partnerships."
        image="/hero_slide_1.png"
      />

      <div className="max-w-content mx-auto px-4 py-8">
        <Breadcrumb
          items={[
            { label: "Plan", href: "/plan" },
            { label: "Travel Services" },
          ]}
        />

        <div className="mt-10 mb-12 max-w-3xl">
          <h2 className="text-3xl font-bold text-[#0d0d0d] mb-4">Everything You Need for a Smooth Journey</h2>
          <p className="text-gray-600 text-lg leading-relaxed">
            From the moment you book to the moment you arrive, Kenya Airways partners with world-class providers to
            ensure every aspect of your trip is covered. Explore our range of travel services designed to give you
            peace of mind.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {SERVICES.map((service, idx) => (
            <div
              key={idx}
              className="bg-white border border-gray-100 rounded-xl p-8 shadow-card hover:shadow-lg transition-all duration-300 flex flex-col"
            >
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center text-white mb-5"
                style={{ backgroundColor: service.color }}
              >
                {service.icon}
              </div>
              <h3 className="text-xl font-bold text-[#0d0d0d] mb-3">{service.title}</h3>
              <p className="text-gray-600 text-sm leading-relaxed mb-5">{service.description}</p>

              <ul className="space-y-2 mb-6 flex-1">
                {service.highlights.map((point, pidx) => (
                  <li key={pidx} className="flex items-start gap-2 text-sm text-gray-700">
                    <CheckCircle className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
                    {point}
                  </li>
                ))}
              </ul>

              <a
                href={service.ctaHref}
                className="mt-auto flex items-center gap-2 font-semibold text-sm transition-colors hover:gap-3"
                style={{ color: service.color }}
              >
                {service.cta} <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          ))}
        </div>

        {/* Partner Strip */}
        <div className="bg-[#f5f5f5] rounded-xl p-8 text-center mb-12">
          <p className="text-sm uppercase tracking-widest text-gray-400 mb-3">Trusted Partners</p>
          <h3 className="text-2xl font-bold text-[#0d0d0d] mb-2">Powered by the Best in the Industry</h3>
          <p className="text-gray-600 max-w-xl mx-auto">
            Kenya Airways carefully selects world-class partners to deliver each service — so you can trust that
            every recommendation meets our standards for quality, reliability, and value.
          </p>
        </div>
      </div>

      <RelatedArticles
        articles={[
          {
            title: "Baggage Information",
            description: "Everything you need to know about what to pack and how to carry it.",
            href: "/plan/baggage-information",
            image: "/hero_slide_2.png",
          },
          {
            title: "Travel Information",
            description: "Passports, visas, and health requirements for your destination.",
            href: "/plan/travel-information",
            image: "/hero_slide_3.png",
          },
          {
            title: "Special Care",
            description: "Information about traveling with pets, infants, or medical needs.",
            href: "/plan/special-care",
            image: "/hero_slide_4.png",
          },
        ]}
      />
    </>
  )
}
