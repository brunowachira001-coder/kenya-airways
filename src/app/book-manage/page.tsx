"use client"

import Link from "next/link"
import { Calendar, Search, CreditCard, ClipboardList, ArrowRight } from "lucide-react"

const MANAGE_SECTIONS = [
  {
    title: "Book a Flight",
    description: "Search for the best fares and book new flights to over 40 global destinations.",
    icon: <Calendar className="w-6 h-6 text-[#ed1c24]" />,
    href: "/",
    cta: "Start Booking"
  },
  {
    title: "Manage Booking",
    description: "Retrieve your reservation, select seats, request special meals, buy extra baggage, or make changes.",
    icon: <ClipboardList className="w-6 h-6 text-[#ed1c24]" />,
    href: "/book-manage/manage-booking",
    cta: "Manage Reservation"
  },
  {
    title: "Online Check-in",
    description: "Check-in online 30 hours to 1 hour before departure, choose seats, and download your boarding pass.",
    icon: <CreditCard className="w-6 h-6 text-[#ed1c24]" />,
    href: "/book-manage/check-in",
    cta: "Check-in Online"
  },
  {
    title: "Flight Status",
    description: "View real-time flight arrival, departure, and delay information for any Kenya Airways flight.",
    icon: <Search className="w-6 h-6 text-[#ed1c24]" />,
    href: "/book-manage/flight-status",
    cta: "Check Flight Status"
  },
]

export default function BookManagePage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Header */}
      <div 
        className="relative h-[40vh] min-h-[300px] bg-cover bg-center flex items-end pb-12 text-white"
        style={{ backgroundImage: `url('/hero_slide_1.png')` }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
        <div className="max-w-content mx-auto px-4 w-full relative z-10">
          <div className="max-w-2xl">
            <span className="bg-[#ed1c24] text-xs uppercase px-2.5 py-1 rounded font-bold tracking-wider mb-3 inline-block">
              Control
            </span>
            <h1 className="text-4xl md:text-5xl font-display font-bold tracking-tight mb-2">
              Book & Manage
            </h1>
            <p className="text-lg opacity-90">
              Easily manage your travel plans, check in, and track flight statuses.
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-content mx-auto px-4 py-12 md:py-16 w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {MANAGE_SECTIONS.map((section) => (
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
                className="inline-flex items-center justify-center bg-[#0d0d0d] hover:bg-[#ed1c24] text-white font-bold py-2.5 px-6 rounded-md text-sm transition-colors w-max"
              >
                {section.cta} <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
