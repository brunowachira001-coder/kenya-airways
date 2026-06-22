"use client"

import Link from "next/link"
import { ShieldCheck, Award, Users, ArrowRight } from "lucide-react"

export default function AboutUsPage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Header */}
      <div 
        className="relative h-[40vh] min-h-[300px] bg-cover bg-center flex items-end pb-12 text-white"
        style={{ backgroundImage: `url('/hero_slide_4.png')` }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
        <div className="max-w-content mx-auto px-4 w-full relative z-10">
          <div className="max-w-2xl">
            <span className="bg-[#ed1c24] text-xs uppercase px-2.5 py-1 rounded font-bold tracking-wider mb-3 inline-block">
              Corporate
            </span>
            <h1 className="text-4xl md:text-5xl font-display font-bold tracking-tight mb-2">
              About Kenya Airways
            </h1>
            <p className="text-lg opacity-90">
              The Pride of Africa — Connecting Africa to the World and the World to Africa.
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-content mx-auto px-4 py-12 md:py-16 w-full space-y-16">
        
        {/* Pitch section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold font-sans mb-6 text-[#0d0d0d]">Our Mission & Vision</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              Kenya Airways, a member of the SkyTeam Alliance, is a leading African airline flying to more than 40 destinations worldwide, including 34 in Africa. Our vision is to be the Pride of Africa by inspiring our people and delighting our guests.
            </p>
            <p className="text-gray-600 leading-relaxed mb-6">
              We operate a modern fleet, including our flagship Boeing 787 Dreamliners, connecting passengers and cargo from our hub at Jomo Kenyatta International Airport in Nairobi.
            </p>
            <Link 
              href="/"
              className="inline-flex items-center justify-center bg-[#ed1c24] hover:bg-[#c11218] text-white font-bold h-12 px-6 rounded-md text-sm transition-colors"
            >
              Book Your Flight <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </div>
          <div className="bg-[#f5f5f5] p-8 rounded-xl space-y-6">
            <div className="flex gap-4">
              <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center flex-shrink-0 text-[#ed1c24] shadow-sm">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-lg text-[#0d0d0d] mb-1">Safety First</h3>
                <p className="text-sm text-gray-500">Adhering to the highest global safety standards (IOSA) across all our flights.</p>
              </div>
            </div>
            
            <div className="flex gap-4">
              <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center flex-shrink-0 text-[#ed1c24] shadow-sm">
                <Award className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-lg text-[#0d0d0d] mb-1">Award Winning</h3>
                <p className="text-sm text-gray-500">Consistently recognized for leading service and guest satisfaction in Africa.</p>
              </div>
            </div>
            
            <div className="flex gap-4">
              <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center flex-shrink-0 text-[#ed1c24] shadow-sm">
                <Users className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-lg text-[#0d0d0d] mb-1">True Hospitality</h3>
                <p className="text-sm text-gray-500">Our crew delivers warm, professional service inspired by the diverse cultures of Africa.</p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}
