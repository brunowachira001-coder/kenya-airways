import { PageHero } from "@/components/shared/page-hero"
import { RelatedArticles } from "@/components/shared/related-articles"
import { Breadcrumb } from "@/components/shared/breadcrumb"
import { Wifi, Coffee, Utensils, Bath, CheckCircle, Tv, Clock, MapPin } from "lucide-react"

const LOUNGES = [
  {
    name: "Pride Lounge – Nairobi JKIA",
    location: "Jomo Kenyatta International Airport, Terminal 1A",
    hours: "Daily 05:00 – 23:00",
    description:
      "Our flagship lounge in Nairobi offers a refined sanctuary with panoramic apron views, gourmet Kenyan cuisine, a premium bar, and private workspaces.",
    image: "/hero_slide_1.png",
    amenities: ["Hot & Cold Buffet", "Premium Bar", "High-Speed Wi-Fi", "Shower Suites", "Business Centre", "Live TV"],
    access: ["Business Class Passengers", "Asante Rewards Gold & Platinum", "Priority Pass Members"],
  },
  {
    name: "Pride Lounge – Mombasa Moi Airport",
    location: "Moi International Airport, Terminal 1",
    hours: "Daily 06:00 – 22:00",
    description:
      "Enjoy the coastal ambience of our Mombasa lounge before your flight. Fresh seafood, tropical drinks, and comfortable seating await.",
    image: "/dest_mombasa.png",
    amenities: ["Coastal Cuisine", "Cocktail Bar", "Wi-Fi", "Kids Corner", "Relaxation Area"],
    access: ["Business Class Passengers", "Asante Rewards Platinum"],
  },
  {
    name: "Partner Lounges – Global Network",
    location: "50+ Partner Airports Worldwide",
    hours: "Varies by airport",
    description:
      "Access over 50 partner lounges across our global network when you travel Business Class or hold qualifying Asante Rewards status.",
    image: "/where_we_fly.png",
    amenities: ["Seating & Wi-Fi", "Snacks & Beverages", "Shower Facilities (select)", "Business Facilities"],
    access: ["Business Class Passengers", "Asante Rewards Gold & Platinum", "Star Alliance Gold (where applicable)"],
  },
]

const AMENITY_ICONS: Record<string, React.ReactNode> = {
  "Hot & Cold Buffet": <Utensils className="w-4 h-4" />,
  "Premium Bar": <Coffee className="w-4 h-4" />,
  "High-Speed Wi-Fi": <Wifi className="w-4 h-4" />,
  "Shower Suites": <Bath className="w-4 h-4" />,
  "Business Centre": <Tv className="w-4 h-4" />,
  "Live TV": <Tv className="w-4 h-4" />,
  "Coastal Cuisine": <Utensils className="w-4 h-4" />,
  "Cocktail Bar": <Coffee className="w-4 h-4" />,
  "Wi-Fi": <Wifi className="w-4 h-4" />,
  "Kids Corner": <CheckCircle className="w-4 h-4" />,
  "Relaxation Area": <Bath className="w-4 h-4" />,
  "Seating & Wi-Fi": <Wifi className="w-4 h-4" />,
  "Snacks & Beverages": <Coffee className="w-4 h-4" />,
  "Shower Facilities (select)": <Bath className="w-4 h-4" />,
  "Business Facilities": <Tv className="w-4 h-4" />,
}

export default function LoungesPage() {
  return (
    <>
      <PageHero
        title="Premium Lounges"
        subtitle="Your sanctuary before you fly. Unwind, work, or dine in our exclusive lounges worldwide."
        image="/hero_slide_3.png"
      />

      <div className="max-w-content mx-auto px-4 py-8">
        <Breadcrumb
          items={[
            { label: "Experience", href: "/experience" },
            { label: "Lounges" },
          ]}
        />

        {/* Intro */}
        <div className="mt-10 mb-12 max-w-3xl">
          <h2 className="text-3xl font-bold text-[#0d0d0d] mb-4">Escape the Terminal Rush</h2>
          <p className="text-gray-600 text-lg leading-relaxed">
            Kenya Airways lounge guests enjoy a world apart from the airport bustle. From gourmet African fusion
            cuisine to high-speed Wi-Fi, shower suites, and a curated bar selection, our lounges are designed to
            make every moment before departure feel like the journey has already begun.
          </p>
        </div>

        {/* Lounge Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          {LOUNGES.map((lounge, idx) => (
            <div
              key={idx}
              className="bg-white rounded-xl overflow-hidden shadow-card border border-gray-100 flex flex-col hover:shadow-lg transition-all duration-300"
            >
              {/* Image */}
              <div
                className="h-52 bg-cover bg-center relative"
                style={{ backgroundImage: `url('${lounge.image}')` }}
              >
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-4 left-4">
                  <span className="bg-[#ed1c24] text-white text-xs font-bold px-2.5 py-1 rounded uppercase tracking-wide">
                    Pride Lounge
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 flex flex-col flex-1">
                <h3 className="text-xl font-bold text-[#0d0d0d] mb-2">{lounge.name}</h3>
                <div className="flex items-start gap-1.5 text-sm text-gray-500 mb-1">
                  <MapPin className="w-4 h-4 mt-0.5 text-[#ed1c24] shrink-0" />
                  <span>{lounge.location}</span>
                </div>
                <div className="flex items-center gap-1.5 text-sm text-gray-500 mb-4">
                  <Clock className="w-4 h-4 text-[#ed1c24] shrink-0" />
                  <span>{lounge.hours}</span>
                </div>
                <p className="text-gray-600 text-sm leading-relaxed mb-5">{lounge.description}</p>

                {/* Amenities */}
                <div className="mb-5">
                  <p className="text-xs font-semibold uppercase tracking-wide text-gray-400 mb-2">Amenities</p>
                  <div className="flex flex-wrap gap-2">
                    {lounge.amenities.map((amenity) => (
                      <div
                        key={amenity}
                        className="flex items-center gap-1.5 bg-gray-50 border border-gray-200 text-gray-700 text-xs rounded-full px-3 py-1"
                      >
                        {AMENITY_ICONS[amenity]}
                        {amenity}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Access */}
                <div className="mt-auto">
                  <p className="text-xs font-semibold uppercase tracking-wide text-gray-400 mb-2">Who Can Access</p>
                  <ul className="space-y-1">
                    {lounge.access.map((rule) => (
                      <li key={rule} className="flex items-center gap-2 text-sm text-gray-700">
                        <CheckCircle className="w-3.5 h-3.5 text-green-500 shrink-0" />
                        {rule}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Access Policy Banner */}
        <div className="bg-[#0d0d0d] rounded-xl p-8 text-white mb-12 flex flex-col md:flex-row gap-6 items-center">
          <div className="flex-1">
            <h3 className="text-2xl font-bold mb-2">Not sure if you qualify?</h3>
            <p className="text-gray-300 leading-relaxed">
              Lounge access depends on your travel class, Asante Rewards tier, and partner eligibility. Check your
              itinerary confirmation or contact our team for details.
            </p>
          </div>
          <a
            href="/help"
            className="shrink-0 bg-[#ed1c24] hover:bg-red-700 text-white font-bold px-8 py-3 rounded-lg transition-colors"
          >
            Contact Support
          </a>
        </div>
      </div>

      <RelatedArticles
        articles={[
          {
            title: "The On-Board Experience",
            description: "Discover a world of comfort and entertainment at 35,000 feet.",
            href: "/experience/on-board",
            image: "/hero_slide_1.png",
          },
          {
            title: "Asante Rewards",
            description: "Earn miles and enjoy complimentary lounge access.",
            href: "/asante-rewards",
            image: "/dest_mumbai.png",
          },
          {
            title: "In-flight Dining",
            description: "Explore our menus and pre-order special meals.",
            href: "/experience/on-board/dining",
            image: "/hero_slide_2.png",
          },
        ]}
      />
    </>
  )
}
