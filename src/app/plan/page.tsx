"use client"

import Link from "next/link"
import { Calendar, Briefcase, Heart, ShieldAlert, ArrowRight } from "lucide-react"

const PLAN_SECTIONS = [
  {
    title: "Baggage Information",
    description: "Understand our carry-on and checked baggage allowances, excess baggage rates, and restricted items.",
    icon: <Briefcase className="w-6 h-6 text-[#ed1c24]" />,
    href: "/plan/baggage-information",
  },
  {
    title: "Travel Requirements",
    description: "Check visa requirements, health advisories, passport validity, and entry guidelines for your destination.",
    icon: <ShieldAlert className="w-6 h-6 text-[#ed1c24]" />,
    href: "/plan/travel-information",
  },
  {
    title: "Special Assistance",
    description: "Request services for passengers requiring wheelchair support, medical care, traveling with infants, or unaccompanied minors.",
    icon: <Heart className="w-6 h-6 text-[#ed1c24]" />,
    href: "/plan/special-care",
  },
  {
    title: "Travel Services",
    description: "Enhance your trip by booking travel insurance, airport lounges, or extra comfort legroom seating.",
    icon: <Calendar className="w-6 h-6 text-[#ed1c24]" />,
    href: "/plan/travel-services",
  },
]

export default function PlanPage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Header */}
      <div 
        className="relative h-[40vh] min-h-[300px] bg-cover bg-center flex items-end pb-12 text-white"
        style={{ backgroundImage: `url('/travel_reqs.png')` }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
        <div className="max-w-content mx-auto px-4 w-full relative z-10">
          <div className="max-w-2xl">
            <span className="bg-[#ed1c24] text-xs uppercase px-2.5 py-1 rounded font-bold tracking-wider mb-3 inline-block">
              Prepare
            </span>
            <h1 className="text-4xl md:text-5xl font-display font-bold tracking-tight mb-2">
              Plan Your Journey
            </h1>
            <p className="text-lg opacity-90">
              Find everything you need to prepare for a smooth and comfortable flight.
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-content mx-auto px-4 py-12 md:py-16 w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {PLAN_SECTIONS.map((section) => (
            <div 
              key={section.title}
              className="bg-white p-6 md:p-8 rounded-xl border border-gray-100 shadow-card flex flex-col justify-between hover:shadow-md transition-shadow"
            >
              <div>
                <div className="w-12 h-12 rounded-lg bg-red-50 flex items-center justify-center mb-6">
                  {section.icon}
                </div>
                <h3 className="text-xl font-bold mb-3 text-[#0d0d0d]">{section.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed mb-6">{section.description}</p>
              </div>
              <Link
                href={section.href}
                className="inline-flex items-center gap-2 text-[#ed1c24] hover:text-[#c11218] font-bold text-sm transition-colors"
              >
                Learn More <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
