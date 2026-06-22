"use client"

import { PageHero } from "@/components/shared/page-hero"
import { RelatedArticles } from "@/components/shared/related-articles"
import { Breadcrumb } from "@/components/shared/breadcrumb"
import { Tv, Headphones, Utensils, Wifi, Armchair, Heart, ChevronRight } from "lucide-react"
import { useState } from "react"

const CABIN_CLASSES = [
  {
    id: "business",
    name: "Business Class",
    tagline: "The Pride Experience",
    color: "#ed1c24",
    description:
      "Kenya Airways Business Class redefines premium travel with fully flat-bed seats in a 1-2-1 configuration, gourmet dining designed by award-winning chefs, and a curated wine cellar with African and European selections.",
    image: "/hero_slide_1.png",
    features: [
      { icon: <Armchair className="w-5 h-5" />, label: "Fully Flat-Bed Seats", detail: "Up to 180° recline in a 1-2-1 configuration" },
      { icon: <Utensils className="w-5 h-5" />, label: "Gourmet À La Carte Dining", detail: "Chef-designed Kenyan and international cuisine" },
      { icon: <Headphones className="w-5 h-5" />, label: "Premium Entertainment", detail: '18" personal screen with 1,000+ hours of content' },
      { icon: <Wifi className="w-5 h-5" />, label: "In-flight Wi-Fi", detail: "Stay connected with high-speed Panasonic eXConnect" },
      { icon: <Tv className="w-5 h-5" />, label: "Amenity Kits", detail: "Elemis skincare products and Scion of Africa kits" },
    ],
  },
  {
    id: "economy",
    name: "Economy Class",
    tagline: "Comfortable & Connected",
    color: "#0d0d0d",
    description:
      "Our Economy Class delivers a comfortable, connected journey with ergonomic seats, a generous in-flight entertainment selection, and delicious African-inspired meals at every altitude.",
    image: "/hero_slide_2.png",
    features: [
      { icon: <Armchair className="w-5 h-5" />, label: "Ergonomic Seating", detail: "Adjustable headrests and generous pitch of 32–34\"" },
      { icon: <Utensils className="w-5 h-5" />, label: "Hot Meals Included", detail: "African-inspired menus with special meal options" },
      { icon: <Headphones className="w-5 h-5" />, label: "Personal Entertainment", detail: '10.6" screens with 500+ hours of content' },
      { icon: <Wifi className="w-5 h-5" />, label: "Wi-Fi Available", detail: "Connect with in-flight Wi-Fi packages (select routes)" },
      { icon: <Heart className="w-5 h-5" />, label: "Miles Earn", detail: "Earn Asante Rewards miles on every flight" },
    ],
  },
]

export default function OnBoardPage() {
  const [activeTab, setActiveTab] = useState("business")
  const active = CABIN_CLASSES.find((c) => c.id === activeTab)!

  return (
    <>
      <PageHero
        title="The On-Board Experience"
        subtitle="Discover a world of comfort, cuisine, and entertainment at 35,000 feet."
        image="/hero_slide_1.png"
      />

      <div className="max-w-content mx-auto px-4 py-8">
        <Breadcrumb
          items={[
            { label: "Experience", href: "/experience" },
            { label: "On Board" },
          ]}
        />

        {/* Cabin Class Tabs */}
        <div className="mt-10 mb-8">
          <div className="flex gap-2 border-b border-gray-200">
            {CABIN_CLASSES.map((cabin) => (
              <button
                key={cabin.id}
                onClick={() => setActiveTab(cabin.id)}
                className={`px-6 py-3 font-semibold text-sm transition-all border-b-2 -mb-[2px] ${
                  activeTab === cabin.id
                    ? "border-[#ed1c24] text-[#ed1c24]"
                    : "border-transparent text-gray-500 hover:text-gray-800"
                }`}
              >
                {cabin.name}
              </button>
            ))}
          </div>
        </div>

        {/* Active Cabin Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16 items-center">
          {/* Image */}
          <div
            className="h-72 lg:h-96 rounded-xl bg-cover bg-center shadow-lg"
            style={{ backgroundImage: `url('${active.image}')` }}
          />

          {/* Details */}
          <div>
            <span
              className="text-xs font-bold uppercase tracking-widest mb-3 inline-block"
              style={{ color: active.color }}
            >
              {active.tagline}
            </span>
            <h2 className="text-3xl font-bold text-[#0d0d0d] mb-4">{active.name}</h2>
            <p className="text-gray-600 leading-relaxed mb-8">{active.description}</p>

            <ul className="space-y-4">
              {active.features.map((feat) => (
                <li key={feat.label} className="flex items-start gap-4">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 text-white"
                    style={{ backgroundColor: active.color }}
                  >
                    {feat.icon}
                  </div>
                  <div>
                    <p className="font-semibold text-[#0d0d0d]">{feat.label}</p>
                    <p className="text-sm text-gray-500">{feat.detail}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Promo Banners */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
          <a
            href="/experience/on-board/dining"
            className="relative overflow-hidden rounded-xl p-8 bg-[#0d0d0d] text-white flex flex-col justify-end min-h-[200px] group hover:scale-[1.01] transition-transform"
            style={{ backgroundImage: "url('/hero_slide_2.png')", backgroundSize: "cover", backgroundPosition: "center" }}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-black/10" />
            <div className="relative z-10">
              <h3 className="text-2xl font-bold mb-1">In-Flight Dining</h3>
              <p className="text-gray-300 text-sm mb-3">Explore our menus and pre-order special meals</p>
              <span className="inline-flex items-center gap-1.5 text-[#ed1c24] font-semibold text-sm group-hover:gap-3 transition-all">
                Explore menus <ChevronRight className="w-4 h-4" />
              </span>
            </div>
          </a>
          <a
            href="/experience/lounges"
            className="relative overflow-hidden rounded-xl p-8 bg-[#ed1c24] text-white flex flex-col justify-end min-h-[200px] group hover:scale-[1.01] transition-transform"
            style={{ backgroundImage: "url('/hero_slide_4.png')", backgroundSize: "cover", backgroundPosition: "center" }}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-[#ed1c24]/80 to-[#ed1c24]/10" />
            <div className="relative z-10">
              <h3 className="text-2xl font-bold mb-1">Premium Lounges</h3>
              <p className="text-white/80 text-sm mb-3">Your sanctuary before you fly</p>
              <span className="inline-flex items-center gap-1.5 text-white font-semibold text-sm group-hover:gap-3 transition-all">
                View lounges <ChevronRight className="w-4 h-4" />
              </span>
            </div>
          </a>
        </div>
      </div>

      <RelatedArticles
        articles={[
          {
            title: "Premium Lounges",
            description: "Your sanctuary before you fly.",
            href: "/experience/lounges",
            image: "/hero_slide_3.png",
          },
          {
            title: "In-flight Dining",
            description: "Explore our menus and pre-order special meals.",
            href: "/experience/on-board/dining",
            image: "/hero_slide_2.png",
          },
          {
            title: "Asante Rewards",
            description: "Earn miles on every Kenya Airways flight.",
            href: "/asante-rewards",
            image: "/dest_mumbai.png",
          },
        ]}
      />
    </>
  )
}
