"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { ChevronDown, ChevronUp } from "lucide-react"

const FacebookIcon = () => <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
const InstagramIcon = () => <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
const LinkedinIcon = () => <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
const YoutubeIcon = () => <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>

// Custom SVG Icons for X (formerly Twitter) and Spotify
const XIcon = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
)

const SpotifyIcon = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
  </svg>
)

export function Footer() {
  const pathname = usePathname()
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({})

  if (pathname?.startsWith('/search')) {
    return null
  }

  const toggleSection = (id: string) => {
    setOpenSections(prev => ({
      ...prev,
      [id]: !prev[id]
    }))
  }

  const sectionsRow1 = [
    {
      id: "kq",
      title: "Kenya Airways",
      links: [
        { label: "About Us", href: "/about" },
        { label: "Careers", href: "/about/careers" },
        { label: "Press Room", href: "/about/press" },
        { label: "Investor Relations", href: "/about/investors" },
        { label: "Sustainability", href: "/about/sustainability" }
      ]
    },
    {
      id: "brands",
      title: "KQ Group Brands",
      links: [
        { label: "KQ Holidays", href: "https://kqholidays.com" },
        { label: "KQ Safari Data", href: "https://kqsafaridata.com" },
        { label: "KQ Duty Free", href: "/duty-free" },
        { label: "Jambojet", href: "https://jambojet.com" }
      ]
    },
    {
      id: "routes",
      title: "Our Destinations",
      links: [
        { label: "Flights to Mombasa", href: "/explore" },
        { label: "Flights to Dubai", href: "/explore" },
        { label: "Flights to Mumbai", href: "/explore" },
        { label: "Flights to Mauritius", href: "/explore" },
        { label: "Flights to London", href: "/explore" }
      ]
    },
    {
      id: "help",
      title: "Help",
      links: [
        { label: "FAQs", href: "/help/faqs" },
        { label: "Contact Us", href: "/help/contact" },
        { label: "Lost & Found", href: "/help/lost-found" },
        { label: "Feedback", href: "/help/feedback" }
      ]
    }
  ]

  const sectionsRow2 = [
    {
      id: "useful",
      title: "Useful Links",
      links: [
        { label: "Travel Advisory", href: "/plan/advisory" },
        { label: "Flight Status", href: "/book-manage/flight-status" },
        { label: "Flight Schedule", href: "/book-manage/flight-schedule" },
        { label: "Cargo Services", href: "/cargo" },
        { label: "Group Travel", href: "/group-travel" }
      ]
    },
    {
      id: "rewards",
      title: "Asante Rewards",
      links: [
        { label: "About Asante Rewards", href: "/asante-rewards" },
        { label: "Join Asante Rewards", href: "/asante-rewards/join" },
        { label: "Earn Miles", href: "/asante-rewards/earn" },
        { label: "Spend Miles", href: "/asante-rewards/spend" },
        { label: "Partner Airlines", href: "/asante-rewards/partners" }
      ]
    },
    {
      id: "pop-dest",
      title: "Popular Destinations",
      links: [
        { label: "Mombasa Flights", href: "/explore" },
        { label: "Dubai Flights", href: "/explore" },
        { label: "Nairobi Flights", href: "/explore" },
        { label: "London Flights", href: "/explore" },
        { label: "Guangzhou Flights", href: "/explore" }
      ]
    },
    {
      id: "manage",
      title: "Manage",
      links: [
        { label: "Manage Booking", href: "/book-manage/manage-booking" },
        { label: "Online Check-in", href: "/book-manage/check-in" },
        { label: "Flight Status", href: "/book-manage/flight-status" },
        { label: "Special Assistance", href: "/plan/special-care" }
      ]
    }
  ]

  return (
    <footer className="bg-[#0d0d0d] text-white pt-16 pb-0 border-t-[8px] border-[#ed1c24]">
      <div className="max-w-content mx-auto px-4">
        
        {/* Row 1: Nav Links */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 pb-8 border-b border-white/10">
          {sectionsRow1.map((section) => (
            <div key={section.id} className="border-b border-white/5 md:border-b-0 pb-4 md:pb-0">
              <button 
                onClick={() => toggleSection(section.id)}
                className="flex items-center justify-between w-full md:cursor-default text-left font-sans text-lg font-bold mb-2 md:mb-4 outline-none"
              >
                <span>{section.title}</span>
                <span className="md:hidden">
                  {openSections[section.id] ? <ChevronUp className="w-5 h-5 text-[#ed1c24]" /> : <ChevronDown className="w-5 h-5" />}
                </span>
              </button>
              <ul className={`space-y-3 text-sm text-gray-400 md:block ${openSections[section.id] ? "block" : "hidden"}`}>
                {section.links.map((link) => (
                  <li key={link.label}>
                    <Link href={link.href} className="hover:text-[#ed1c24] transition-colors">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Row 2: Secondary Nav Links */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 py-8 border-b border-white/10">
          {sectionsRow2.map((section) => (
            <div key={section.id} className="border-b border-white/5 md:border-b-0 pb-4 md:pb-0">
              <button 
                onClick={() => toggleSection(section.id)}
                className="flex items-center justify-between w-full md:cursor-default text-left font-sans text-lg font-bold mb-2 md:mb-4 outline-none"
              >
                <span>{section.title}</span>
                <span className="md:hidden">
                  {openSections[section.id] ? <ChevronUp className="w-5 h-5 text-[#ed1c24]" /> : <ChevronDown className="w-5 h-5" />}
                </span>
              </button>
              <ul className={`space-y-3 text-sm text-gray-400 md:block ${openSections[section.id] ? "block" : "hidden"}`}>
                {section.links.map((link) => (
                  <li key={link.label}>
                    <Link href={link.href} className="hover:text-[#ed1c24] transition-colors">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Row 3: Social Media */}
        <div className="flex justify-center py-8 border-b border-white/10">
          {/* Social Media */}
          <div className="text-center">
            <h4 className="font-semibold mb-3">Follow us</h4>
            <div className="flex justify-center gap-3">
              {[
                { icon: <FacebookIcon />, href: "https://www.facebook.com/officialkenyaairways/" },
                { icon: <XIcon />, href: "https://twitter.com/KenyaAirways" },
                { icon: <InstagramIcon />, href: "https://www.instagram.com/officialkenyaairways/" },
                { icon: <LinkedinIcon />, href: "https://www.linkedin.com/company/kenya-airways" },
                { icon: <YoutubeIcon />, href: "https://youtube.com/@officialkenyaairways" },
                { icon: <SpotifyIcon />, href: "https://open.spotify.com/show/3Pykcb3K4tJEaDeFxyDd07" }
              ].map((social, index) => (
                <a 
                  key={index} 
                  href={social.href} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-[#ed1c24] hover:text-white transition-colors"
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Row 4: Awards Badge Row */}
        <div className="py-12 border-b border-white/10 flex flex-col justify-center items-center gap-8">
          <img 
            src="/award_leading_airline.svg" 
            alt="Africa's Leading Airline - World Travel Awards 2025" 
            className="w-[280px] h-[280px] md:w-[300px] md:h-[300px]"
          />
          <img 
            src="/award_airline_brand.svg" 
            alt="Africa's Leading Airline Brand - World Travel Awards 2025" 
            className="w-[280px] h-[280px] md:w-[300px] md:h-[300px]"
          />
          <img 
            src="/award_business_class.svg" 
            alt="Africa's Leading Business Class - World Travel Awards 2025" 
            className="w-[280px] h-[280px] md:w-[300px] md:h-[300px]"
          />
          <img 
            src="/award_inflight_magazine.svg" 
            alt="Africa's Leading Inflight Magazine - World Travel Awards 2025" 
            className="w-[280px] h-[280px] md:w-[300px] md:h-[300px]"
          />
        </div>

        {/* Row 5: Legal Links & Copyright */}
        <div className="pt-8 flex flex-col items-center gap-6">
          <div className="flex flex-wrap justify-center gap-y-2 gap-x-4 text-xs text-gray-400 text-center max-w-4xl">
            {[
              "Privacy Statement", "Conditions of Carriage", "Website Security", 
              "Browser Compatibility", "Cookie Policy", "Customer Service Plan", 
              "Contingency Plan", "Optional Fees", "24 Hours Refund Statement", 
              "EU Passenger Rights", "Thai Passenger Rights"
            ].map((linkText) => (
              <Link key={linkText} href={`/${linkText.toLowerCase().replace(/ /g, "-")}`} className="hover:text-[#ed1c24] transition-colors">
                {linkText}
              </Link>
            ))}
          </div>

          <div className="text-center text-xs text-gray-500 py-8">
            <p>© {new Date().getFullYear()} Kenya Airways PLC. All rights reserved.</p>
          </div>
        </div>

      </div>
    </footer>
  )
}
