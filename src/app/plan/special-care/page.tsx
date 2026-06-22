import { PageHero } from "@/components/shared/page-hero"
import { RelatedArticles } from "@/components/shared/related-articles"
import { Breadcrumb } from "@/components/shared/breadcrumb"
import { Baby, Accessibility, Heart, Dog, Pill, HeartHandshake, CheckCircle, Phone } from "lucide-react"

const SERVICES = [
  {
    icon: <Baby className="w-8 h-8" />,
    title: "Travelling with Infants & Children",
    description:
      "We make family travel easy. Infants under 2 years travel on an adult's lap at a discounted fare. Children 2–11 get their own seat. Request bassinets (on long-haul flights), children's meals, and early boarding at check-in.",
    tips: [
      "Bassinet seats: request at booking (subject to availability)",
      "Children's meals available on request (24hrs before)",
      "Pre-boarding priority for families with young children",
      "Dedicated family check-in queues at JKIA",
    ],
    color: "#ed1c24",
  },
  {
    icon: <Accessibility className="w-8 h-8" />,
    title: "Passengers with Disabilities",
    description:
      "Kenya Airways is committed to accessible travel for everyone. Our team is trained to assist wheelchair users, visually impaired, and hearing-impaired passengers at every stage of the journey.",
    tips: [
      "Wheelchair assistance at all airports we serve",
      "Aisle wheelchairs available for boarding on wide-body aircraft",
      "Seats with moveable armrests for easier transfers",
      "Notify us at booking for personalised assistance",
    ],
    color: "#0d0d0d",
  },
  {
    icon: <Heart className="w-8 h-8" />,
    title: "Medical Passengers (MEDA)",
    description:
      "If you have a medical condition that may require special attention, a Medical Information Form (MEDIF) may be required. Our trained cabin crew carry first-aid equipment and AEDs on all flights.",
    tips: [
      "MEDIF form required for passengers with serious conditions",
      "Notify KQ Medical at least 48 hours before departure",
      "Stretcher accommodation available on select routes",
      "Oxygen cylinders available on request (charges apply)",
    ],
    color: "#ed1c24",
  },
  {
    icon: <Dog className="w-8 h-8" />,
    title: "Travelling with Pets",
    description:
      "Small pets (cats, dogs, and birds) may travel in the cabin on select routes. Larger pets travel as checked baggage in pressurised, temperature-controlled holds. All pets must have valid health certificates.",
    tips: [
      "Cabin pets: max 8 kg (pet + carrier) on approved routes",
      "Approved IATA-compliant carrier required",
      "Health certificate required (issued within 10 days of travel)",
      "Service animals accepted in cabin — advance notice required",
    ],
    color: "#0d0d0d",
  },
  {
    icon: <Pill className="w-8 h-8" />,
    title: "Travelling with Medication",
    description:
      "Passengers travelling with prescription medications, syringes, or medical devices should carry a letter from their physician. Medication in carry-on baggage is permitted beyond standard liquid allowances with documentation.",
    tips: [
      "Carry medication in original pharmacy packaging",
      "Doctor's letter required for controlled medications",
      "Notify security and cabin crew of insulin pumps or implants",
      "Liquid medication exempt from 100ml restriction with prescription",
    ],
    color: "#ed1c24",
  },
  {
    icon: <HeartHandshake className="w-8 h-8" />,
    title: "Unaccompanied Minors",
    description:
      "Children aged 5–17 travelling alone are welcomed on Kenya Airways flights. Our UM service ensures your child is escorted by trained staff from check-in to delivery at the destination, with a full chain of custody.",
    tips: [
      "UM service available for children aged 5–17",
      "Parents must complete UM form at check-in",
      "Child escorted by cabin crew throughout the journey",
      "Handed directly to authorised guardian at destination",
    ],
    color: "#0d0d0d",
  },
]

export default function SpecialCarePage() {
  return (
    <>
      <PageHero
        title="Special Care"
        subtitle="Every passenger deserves a comfortable journey. Discover the support we offer for families, medical needs, and more."
        image="/hero_slide_4.png"
      />

      <div className="max-w-content mx-auto px-4 py-8">
        <Breadcrumb
          items={[
            { label: "Plan", href: "/plan" },
            { label: "Special Care" },
          ]}
        />

        <div className="mt-10 mb-8 max-w-3xl">
          <h2 className="text-3xl font-bold text-[#0d0d0d] mb-4">We Care for Every Passenger</h2>
          <p className="text-gray-600 text-lg leading-relaxed">
            Kenya Airways goes beyond transportation — we provide a caring environment for passengers with unique
            needs. From families with young children to medical travellers and passengers with disabilities, our
            specially trained team is ready to help every step of the way.
          </p>
        </div>

        {/* Service Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {SERVICES.map((service, idx) => (
            <div
              key={idx}
              className="bg-white border border-gray-100 rounded-xl p-8 shadow-card hover:shadow-lg transition-all duration-300 flex flex-col"
            >
              <div
                className="w-14 h-14 rounded-full flex items-center justify-center text-white mb-5"
                style={{ backgroundColor: service.color }}
              >
                {service.icon}
              </div>
              <h3 className="text-xl font-bold text-[#0d0d0d] mb-3">{service.title}</h3>
              <p className="text-gray-600 text-sm leading-relaxed mb-5">{service.description}</p>
              <ul className="space-y-2 mt-auto">
                {service.tips.map((tip, tidx) => (
                  <li key={tidx} className="flex items-start gap-2 text-sm text-gray-700">
                    <CheckCircle className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
                    {tip}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Contact Banner */}
        <div className="bg-[#0d0d0d] rounded-xl p-8 text-white flex flex-col md:flex-row gap-6 items-center mb-12">
          <div className="flex-1">
            <h3 className="text-2xl font-bold mb-2">Need Personalised Assistance?</h3>
            <p className="text-gray-300 leading-relaxed">
              Our Special Assistance team is available 24/7. Contact us at least 48 hours before your flight to
              ensure we have all the arrangements in place for your journey.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 shrink-0">
            <a
              href="tel:+254711024747"
              className="flex items-center gap-2 bg-[#ed1c24] hover:bg-red-700 text-white font-bold px-6 py-3 rounded-lg transition-colors"
            >
              <Phone className="w-4 h-4" />
              Call Us
            </a>
            <a
              href="/help"
              className="flex items-center gap-2 border border-white/30 hover:bg-white/10 text-white font-bold px-6 py-3 rounded-lg transition-colors"
            >
              Help Centre
            </a>
          </div>
        </div>
      </div>

      <RelatedArticles
        articles={[
          {
            title: "Baggage Information",
            description: "Everything you need to know about what to pack.",
            href: "/plan/baggage-information",
            image: "/hero_slide_2.png",
          },
          {
            title: "Travel Information",
            description: "Visas, health requirements, and airport procedures.",
            href: "/plan/travel-information",
            image: "/hero_slide_3.png",
          },
          {
            title: "Help Centre",
            description: "Browse FAQs and contact our support team.",
            href: "/help",
            image: "/hero_slide_1.png",
          },
        ]}
      />
    </>
  )
}
