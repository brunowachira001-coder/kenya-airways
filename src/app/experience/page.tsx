"use client"

import Link from "next/link"
import { Coffee, ShieldCheck, Utensils, ArrowRight } from "lucide-react"

const EXPERIENCE_SECTIONS = [
  {
    title: "Premium Airport Lounges",
    description: "Relax at our Pride and Simba lounges in Jomo Kenyatta International Airport, offering refreshments, workspaces, and showers.",
    icon: <Coffee className="w-6 h-6 text-[#ed1c24]" />,
    href: "/experience/lounges",
  },
  {
    title: "Onboard Dining",
    description: "Savor local African cuisine and curated international dishes created by top chefs, paired with fine wines.",
    icon: <Utensils className="w-6 h-6 text-[#ed1c24]" />,
    href: "/experience/on-board/dining",
  },
  {
    title: "In-Flight Services",
    description: "Discover our premium economy seats, flatbeds in business class, and extensive audio-video entertainment systems.",
    icon: <ShieldCheck className="w-6 h-6 text-[#ed1c24]" />,
    href: "/experience/on-board",
  },
]

export default function ExperiencePage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Header */}
      <div 
        className="relative h-[40vh] min-h-[300px] bg-cover bg-center flex items-end pb-12 text-white"
        style={{ backgroundImage: `url('/hero_slide_2.png')` }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
        <div className="max-w-content mx-auto px-4 w-full relative z-10">
          <div className="max-w-2xl">
            <span className="bg-[#ed1c24] text-xs uppercase px-2.5 py-1 rounded font-bold tracking-wider mb-3 inline-block">
              Hospitality
            </span>
            <h1 className="text-4xl md:text-5xl font-display font-bold tracking-tight mb-2">
              The KQ Experience
            </h1>
            <p className="text-lg opacity-90">
              Immerse yourself in true African hospitality from ground to air.
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-content mx-auto px-4 py-12 md:py-16 w-full">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {EXPERIENCE_SECTIONS.map((section) => (
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
                Explore <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
