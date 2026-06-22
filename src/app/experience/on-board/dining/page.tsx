"use client"

import { PageHero } from "@/components/shared/page-hero"
import { RelatedArticles } from "@/components/shared/related-articles"
import { Breadcrumb } from "@/components/shared/breadcrumb"
import { Leaf, Wine, Coffee, ChevronDown, ChevronUp } from "lucide-react"
import { useState } from "react"

const MENUS = [
  {
    cabin: "Business Class",
    tagline: "Fine Dining at Altitude",
    description:
      "Our Business Class menu is crafted by award-winning chefs and changes seasonally. Enjoy a multi-course experience with African-inspired starters, globally-sourced mains, and decadent desserts — all paired with our curated wine cellar.",
    items: [
      {
        category: "Starters",
        dishes: [
          "Grilled Zanzibar prawns with avocado salsa and mango vinaigrette",
          "Kenyan beetroot & goat cheese salad with candied walnuts",
          "Wild mushroom velouté with truffle oil and sourdough crostini",
        ],
      },
      {
        category: "Mains",
        dishes: [
          "Pan-seared Tilapia with lemon butter sauce, roasted vegetables & wild rice",
          "Slow-braised Kenyan beef short rib with ugali truffle mash and jus",
          "Pasta Primavera with garden herbs, sundried tomatoes & parmesan (V)",
        ],
      },
      {
        category: "Desserts",
        dishes: [
          "Chocolate lava cake with vanilla bean ice cream",
          "Fresh tropical fruit platter with passion fruit coulis",
          "Artisan cheese board with crackers and fig jam",
        ],
      },
    ],
    image: "/hero_slide_2.png",
    color: "#ed1c24",
  },
  {
    cabin: "Economy Class",
    tagline: "Flavours of Africa & Beyond",
    description:
      "Economy Class passengers enjoy hearty, freshly-prepared hot meals with African flavours and international options. Special dietary meals are available on request at the time of booking.",
    items: [
      {
        category: "Mains",
        dishes: [
          "Chicken stew with pilau rice and chapati",
          "Pasta with marinara sauce and garlic bread (V)",
          "Grilled fish fillet with mashed potatoes and green beans",
        ],
      },
      {
        category: "Snacks & Desserts",
        dishes: [
          "African spiced nuts and cassava chips",
          "Yoghurt with granola and honey",
          "Seasonal fresh fruit cup",
        ],
      },
      {
        category: "Beverages",
        dishes: [
          "Kenyan AA-grade tea and coffee",
          "Fruit juices: Passion, Mango, Pineapple",
          "Soft drinks, water, and on-board beer & wine",
        ],
      },
    ],
    image: "/hero_slide_4.png",
    color: "#0d0d0d",
  },
]

const SPECIAL_MEALS = [
  { code: "VGML", name: "Vegetarian (Strict)", icon: <Leaf className="w-5 h-5 text-green-500" /> },
  { code: "HNML", name: "Hindu Meal", icon: <Leaf className="w-5 h-5 text-orange-500" /> },
  { code: "MOML", name: "Muslim Meal (Halal)", icon: <Leaf className="w-5 h-5 text-teal-500" /> },
  { code: "KSML", name: "Kosher Meal", icon: <Leaf className="w-5 h-5 text-blue-500" /> },
  { code: "DBML", name: "Diabetic Meal", icon: <Coffee className="w-5 h-5 text-purple-500" /> },
  { code: "GFML", name: "Gluten-Free Meal", icon: <Leaf className="w-5 h-5 text-amber-500" /> },
  { code: "BBML", name: "Baby Meal", icon: <Coffee className="w-5 h-5 text-pink-500" /> },
  { code: "LSML", name: "Low Sodium Meal", icon: <Wine className="w-5 h-5 text-indigo-500" /> },
]

function MenuAccordion({ menu }: { menu: (typeof MENUS)[0] }) {
  const [open, setOpen] = useState<number | null>(0)

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start mb-16">
      <div
        className="h-72 lg:h-full rounded-xl bg-cover bg-center shadow-lg order-2 lg:order-1"
        style={{ backgroundImage: `url('${menu.image}')`, minHeight: "300px" }}
      />
      <div className="order-1 lg:order-2">
        <span className="text-xs font-bold uppercase tracking-widest mb-2 inline-block" style={{ color: menu.color }}>
          {menu.tagline}
        </span>
        <h2 className="text-3xl font-bold text-[#0d0d0d] mb-3">{menu.cabin}</h2>
        <p className="text-gray-600 leading-relaxed mb-6">{menu.description}</p>

        <div className="space-y-2">
          {menu.items.map((section, idx) => (
            <div key={idx} className="border border-gray-200 rounded-lg overflow-hidden">
              <button
                onClick={() => setOpen(open === idx ? null : idx)}
                className="w-full flex items-center justify-between px-5 py-4 font-semibold text-[#0d0d0d] hover:bg-gray-50 transition-colors"
              >
                {section.category}
                {open === idx ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
              {open === idx && (
                <ul className="border-t border-gray-100 px-5 py-4 space-y-2">
                  {section.dishes.map((dish, di) => (
                    <li key={di} className="text-sm text-gray-700 flex items-start gap-2">
                      <span className="text-[#ed1c24] mt-1">•</span>
                      {dish}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default function DiningPage() {
  return (
    <>
      <PageHero
        title="In-flight Dining"
        subtitle="A culinary journey inspired by African flavours and international cuisine, served at 35,000 feet."
        image="/hero_slide_2.png"
      />

      <div className="max-w-content mx-auto px-4 py-8">
        <Breadcrumb
          items={[
            { label: "Experience", href: "/experience" },
            { label: "On Board", href: "/experience/on-board" },
            { label: "Dining" },
          ]}
        />

        <div className="mt-10">
          {MENUS.map((menu, idx) => (
            <MenuAccordion key={idx} menu={menu} />
          ))}
        </div>

        {/* Special Meals */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-[#0d0d0d] mb-2">Special Dietary Meals</h2>
          <p className="text-gray-600 mb-8 max-w-2xl">
            We cater to all dietary needs. Request your special meal at least 24 hours before departure through Manage
            My Booking or by contacting our reservations team.
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {SPECIAL_MEALS.map((meal) => (
              <div
                key={meal.code}
                className="bg-white border border-gray-200 rounded-xl p-5 flex flex-col items-center text-center hover:border-[#ed1c24] hover:shadow-md transition-all group"
              >
                <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mb-3 group-hover:bg-red-50 transition-colors">
                  {meal.icon}
                </div>
                <p className="text-xs font-bold text-gray-400 mb-1">{meal.code}</p>
                <p className="text-sm font-semibold text-[#0d0d0d]">{meal.name}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Pre-order CTA */}
        <div className="bg-[#0d0d0d] text-white rounded-xl p-8 flex flex-col md:flex-row items-center gap-6 mb-12">
          <div className="flex-1">
            <h3 className="text-2xl font-bold mb-2">Pre-order Your Meal</h3>
            <p className="text-gray-300">
              Secure your preferred dining choice before your flight by managing your booking online. Pre-ordering opens
              48 hours after booking and closes 24 hours before departure.
            </p>
          </div>
          <a
            href="/book-manage/manage-booking"
            className="shrink-0 bg-[#ed1c24] hover:bg-red-700 text-white font-bold px-8 py-3 rounded-lg transition-colors"
          >
            Manage My Booking
          </a>
        </div>
      </div>

      <RelatedArticles
        articles={[
          {
            title: "Business Class Experience",
            description: "Discover our fully flat-bed seats and premium service.",
            href: "/experience/on-board",
            image: "/hero_slide_1.png",
          },
          {
            title: "Premium Lounges",
            description: "Relax and dine before your flight in our exclusive lounges.",
            href: "/experience/lounges",
            image: "/hero_slide_3.png",
          },
          {
            title: "Special Care",
            description: "Information for passengers who need extra assistance.",
            href: "/plan/special-care",
            image: "/hero_slide_4.png",
          },
        ]}
      />
    </>
  )
}
