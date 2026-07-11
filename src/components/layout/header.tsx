"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu, X, Globe, Search, ChevronDown } from "lucide-react"

import { cn } from "@/lib/utils"

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [mobilePlanOpen, setMobilePlanOpen] = useState(false)
  const [mobileBookOpen, setMobileBookOpen] = useState(false)
  const pathname = usePathname()

  const isSearchPage = pathname?.startsWith('/search')

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full bg-white text-[#0d0d0d] transition-all duration-300",
        isScrolled ? "shadow-md" : ""
      )}
    >
      {/* ===== GREEN NOTIFICATION BAR (desktop header duplicate - removed, handled by NotificationBar component) ===== */}

      {/* ================= DESKTOP HEADER ================= */}
      <div className="hidden desktop:block relative w-full bg-white shadow-sm" style={{ height: isSearchPage ? '72px' : '88px' }}>
        {/* Red Logo Background - Curved Diagonal Edge (Top-Left to Bottom-Right) */}
        <Link href="/" className="absolute left-0 top-0 bottom-0 bg-white z-50 flex items-center justify-start cursor-pointer group transition-colors overflow-hidden"
          style={{
            width: isSearchPage ? '280px' : '320px'
          }}
        >
          {/* Red area with curved edge using SVG mask */}
          <div className="absolute inset-0 bg-[#ed1c24] group-hover:bg-[#d11820] transition-colors">
            <svg
              className="absolute right-0 top-0 h-full"
              style={{ width: '80px' }}
              preserveAspectRatio="none"
              viewBox="0 0 80 100"
            >
              <path d="M 0 0 Q 40 50, 0 100 L 80 100 L 80 0 Z" fill="white" />
            </svg>
          </div>

          <div className={`flex items-center h-full w-full relative z-10 ${isSearchPage ? 'pl-6 pr-16' : 'pl-8 pr-20'}`}>
            <img
              src="/kq-logo.svg"
              alt="Kenya Airways – The Pride of Africa"
              className={`${isSearchPage ? 'w-[210px]' : 'w-[240px]'} h-auto object-contain py-2`}
            />
          </div>
        </Link>

        {/* Main Content Container */}
        <div className={`max-w-[1440px] mx-auto w-full h-full relative z-20 flex flex-col justify-between ${isSearchPage ? 'pl-[270px]' : 'pl-[310px]'} pr-8`}>

          {/* Top Row: Utility links (or just English on search page) */}
          {isSearchPage ? (
            <div className="h-full flex items-center justify-end text-sm text-[#545352] font-medium">
              <button className="flex items-center gap-1.5 hover:text-[#ed1c24] transition-colors">
                <Globe className="w-4 h-4" /> English <ChevronDown className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <div className="h-9 border-b border-gray-100 flex items-center justify-end text-xs text-[#545352] gap-6 font-medium">
              <Link href="/kq-holidays" className="hover:text-[#ed1c24] uppercase transition-colors tracking-wide">KQ Holidays</Link>
              <Link href="/about-us" className="hover:text-[#ed1c24] uppercase transition-colors tracking-wide">About Us</Link>
              <a href="tel:+254711024747" className="hover:text-[#ed1c24] flex items-center gap-1 transition-colors">
                +254 711 024 747
              </a>
              <button className="flex items-center gap-1 hover:text-[#ed1c24] uppercase transition-colors tracking-wide">
                <Globe className="w-3.5 h-3.5" /> Kenya · English (Kenya)
              </button>
            </div>
          )}

          {/* Bottom Row: Nav links */}
          {!isSearchPage && (
            <div className="h-[calc(88px-36px)] flex items-center justify-between">
              {/* Desktop Navigation */}
              <nav className="flex items-center gap-7 text-sm font-semibold text-[#0d0d0d]">
                <Link href="/explore" className="hover:text-[#ed1c24] py-4 transition-colors">Explore</Link>

                {/* Plan Dropdown */}
                <div className="relative group">
                  <button className="flex items-center gap-1 py-4 hover:text-[#ed1c24] transition-colors">
                    Plan <ChevronDown className="w-4 h-4" />
                  </button>
                  <div className="absolute top-full left-0 w-56 bg-white text-[#0d0d0d] shadow-lg rounded-b-md opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all -translate-y-2 group-hover:translate-y-0 border border-gray-100 z-50">
                    <Link href="/book-manage/flight-schedule" className="block px-4 py-3 hover:bg-[#f5f5f5] hover:text-[#ed1c24] text-sm">Flight Schedule</Link>
                    <Link href="/book-manage/flight-status" className="block px-4 py-3 hover:bg-[#f5f5f5] hover:text-[#ed1c24] text-sm">Flight Status</Link>
                    <Link href="/plan/travel-information" className="block px-4 py-3 hover:bg-[#f5f5f5] hover:text-[#ed1c24] text-sm">Travel Requirements</Link>
                    <Link href="/plan/baggage-information" className="block px-4 py-3 hover:bg-[#f5f5f5] hover:text-[#ed1c24] text-sm">Baggage Information</Link>
                    <Link href="/plan/special-care" className="block px-4 py-3 hover:bg-[#f5f5f5] hover:text-[#ed1c24] text-sm">Special Care</Link>
                  </div>
                </div>

                {/* Book & Manage Dropdown */}
                <div className="relative group">
                  <button className="flex items-center gap-1 py-4 hover:text-[#ed1c24] transition-colors">
                    Book & Manage <ChevronDown className="w-4 h-4" />
                  </button>
                  <div className="absolute top-full left-0 w-56 bg-white text-[#0d0d0d] shadow-lg rounded-b-md opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all -translate-y-2 group-hover:translate-y-0 border border-gray-100 z-50">
                    <Link href="/" className="block px-4 py-3 hover:bg-[#f5f5f5] hover:text-[#ed1c24] text-sm font-semibold">Book a Flight</Link>
                    <Link href="/book-manage/manage-booking" className="block px-4 py-3 hover:bg-[#f5f5f5] hover:text-[#ed1c24] text-sm">Manage Booking</Link>
                    <Link href="/book-manage/check-in" className="block px-4 py-3 hover:bg-[#f5f5f5] hover:text-[#ed1c24] text-sm">Check-in Online</Link>
                    <Link href="/duty-free" className="block px-4 py-3 hover:bg-[#f5f5f5] hover:text-[#ed1c24] text-sm">KQ Duty Free</Link>
                  </div>
                </div>

                <Link href="/experience" className="hover:text-[#ed1c24] py-4 transition-colors">Experience</Link>
                <Link href="/asante-rewards" className="hover:text-[#ed1c24] py-4 transition-colors font-bold text-[#ed1c24]">Asante Rewards</Link>
                <Link href="/help" className="hover:text-[#ed1c24] py-4 transition-colors">Help</Link>
              </nav>

              {/* Right: Search */}
              <div className="flex items-center gap-3">
                <button className="p-2 hover:text-[#ed1c24] transition-colors" aria-label="Search">
                  <Search className="w-5 h-5 text-[#545352]" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ================= MOBILE HEADER ================= */}
      <div className="desktop:hidden h-14 flex items-center justify-between relative z-20 bg-white border-b border-gray-100 shadow-sm">
        {/* Red Logo Block - Curved Diagonal Edge (Top-Left to Bottom-Right) */}
        <Link href="/" className="flex items-center h-full relative overflow-hidden">
          <div className="bg-white h-full flex items-center relative overflow-hidden">
            {/* Red area with curved edge using SVG mask */}
            <div className="absolute inset-0 bg-[#ed1c24]">
              <svg
                className="absolute right-0 top-0 h-full"
                style={{ width: '40px' }}
                preserveAspectRatio="none"
                viewBox="0 0 40 56"
              >
                <path d="M 0 0 Q 20 28, 0 56 L 40 56 L 40 0 Z" fill="white" />
              </svg>
            </div>

            <img
              src="/kq-logo.svg"
              alt="Kenya Airways – The Pride of Africa"
              className="h-8 w-auto object-contain relative z-10 ml-4 mr-12"
            />
          </div>
        </Link>

        <div className="flex items-center gap-1 pr-2">
          <button className="p-2.5 hover:text-[#ed1c24] transition-colors rounded-full hover:bg-gray-50" aria-label="Search">
            <Search className="w-5 h-5 text-[#545352]" />
          </button>
          <button
            className="p-2.5 hover:bg-gray-50 rounded-full transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6 text-[#0d0d0d]" /> : <Menu className="w-6 h-6 text-[#0d0d0d]" />}
          </button>
        </div>
      </div>

      {/* ================= MOBILE MENU DRAWER ================= */}
      {mobileMenuOpen && (
        <div className="desktop:hidden fixed inset-x-0 bottom-0 z-30 bg-white text-[#0d0d0d] overflow-y-auto top-14 border-t border-gray-100 flex flex-col">
          <div className="flex flex-col divide-y divide-gray-100">
            <Link 
              href="/explore" 
              className="flex items-center justify-between px-5 py-4 text-[15px] font-semibold hover:bg-gray-50 active:bg-gray-100 transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              <span>Explore</span>
            </Link>

            <div>
              <button 
                className="w-full flex items-center justify-between px-5 py-4 text-[15px] font-semibold hover:bg-gray-50 active:bg-gray-100 transition-colors"
                onClick={() => setMobilePlanOpen(!mobilePlanOpen)}
              >
                <span>Plan</span>
                <ChevronDown className={cn("w-5 h-5 text-gray-400 transition-transform duration-200", mobilePlanOpen ? "rotate-180" : "")} />
              </button>
              {mobilePlanOpen && (
                <div className="bg-gray-50 border-t border-gray-100">
                  <Link href="/book-manage/flight-schedule" className="flex items-center px-8 py-3.5 text-sm text-[#545352] font-medium hover:text-[#ed1c24] hover:bg-white transition-colors" onClick={() => setMobileMenuOpen(false)}>Flight Schedule</Link>
                  <Link href="/book-manage/flight-status" className="flex items-center px-8 py-3.5 text-sm text-[#545352] font-medium hover:text-[#ed1c24] hover:bg-white transition-colors" onClick={() => setMobileMenuOpen(false)}>Flight Status</Link>
                  <Link href="/plan/travel-information" className="flex items-center px-8 py-3.5 text-sm text-[#545352] font-medium hover:text-[#ed1c24] hover:bg-white transition-colors" onClick={() => setMobileMenuOpen(false)}>Travel Requirements</Link>
                  <Link href="/plan/baggage-information" className="flex items-center px-8 py-3.5 text-sm text-[#545352] font-medium hover:text-[#ed1c24] hover:bg-white transition-colors" onClick={() => setMobileMenuOpen(false)}>Baggage Information</Link>
                  <Link href="/plan/special-care" className="flex items-center px-8 py-3.5 text-sm text-[#545352] font-medium hover:text-[#ed1c24] hover:bg-white transition-colors" onClick={() => setMobileMenuOpen(false)}>Special Care</Link>
                </div>
              )}
            </div>

            <div>
              <button 
                className="w-full flex items-center justify-between px-5 py-4 text-[15px] font-semibold hover:bg-gray-50 active:bg-gray-100 transition-colors"
                onClick={() => setMobileBookOpen(!mobileBookOpen)}
              >
                <span>Book & Manage</span>
                <ChevronDown className={cn("w-5 h-5 text-gray-400 transition-transform duration-200", mobileBookOpen ? "rotate-180" : "")} />
              </button>
              {mobileBookOpen && (
                <div className="bg-gray-50 border-t border-gray-100">
                  <Link href="/" className="flex items-center px-8 py-3.5 text-sm text-[#545352] font-medium hover:text-[#ed1c24] hover:bg-white transition-colors" onClick={() => setMobileMenuOpen(false)}>Book a Flight</Link>
                  <Link href="/book-manage/manage-booking" className="flex items-center px-8 py-3.5 text-sm text-[#545352] font-medium hover:text-[#ed1c24] hover:bg-white transition-colors" onClick={() => setMobileMenuOpen(false)}>Manage Booking</Link>
                  <Link href="/book-manage/check-in" className="flex items-center px-8 py-3.5 text-sm text-[#545352] font-medium hover:text-[#ed1c24] hover:bg-white transition-colors" onClick={() => setMobileMenuOpen(false)}>Check-in Online</Link>
                  <Link href="/duty-free" className="flex items-center px-8 py-3.5 text-sm text-[#545352] font-medium hover:text-[#ed1c24] hover:bg-white transition-colors" onClick={() => setMobileMenuOpen(false)}>KQ Duty Free</Link>
                </div>
              )}
            </div>

            <Link href="/experience" className="flex items-center justify-between px-5 py-4 text-[15px] font-semibold hover:bg-gray-50 active:bg-gray-100 transition-colors" onClick={() => setMobileMenuOpen(false)}>
              <span>Experience</span>
            </Link>
            
            <Link href="/asante-rewards" className="flex items-center justify-between px-5 py-4 text-[15px] font-bold text-[#ed1c24] hover:bg-red-50 active:bg-red-100 transition-colors" onClick={() => setMobileMenuOpen(false)}>
              <span>Asante Rewards</span>
            </Link>
            
            <Link href="/help" className="flex items-center justify-between px-5 py-4 text-[15px] font-semibold hover:bg-gray-50 active:bg-gray-100 transition-colors" onClick={() => setMobileMenuOpen(false)}>
              <span>Help</span>
            </Link>
          </div>

          {/* Bottom utility links */}
          <div className="mt-auto px-5 py-5 border-t border-gray-100 bg-gray-50">
            <div className="flex items-center gap-5 text-sm text-[#545352]">
              <button className="flex items-center gap-1.5 font-medium">
                <Globe className="w-4 h-4" /> Kenya · English
              </button>
              <a href="tel:+254711024747" className="font-medium hover:text-[#ed1c24]">+254 711 024 747</a>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
