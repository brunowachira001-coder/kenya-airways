"use client"

import { useSearchParams } from "next/navigation"
import { CheckCircle, AlertCircle, Plane, Printer, Smartphone, Armchair } from "lucide-react"
import Link from "next/link"

export default function CheckinResultPage() {
  const searchParams = useSearchParams()
  const pnr = searchParams.get("pnr") || "UNKNOWN"
  const name = searchParams.get("name") || "Guest"

  // Simulate a check-in result
  const isEligible = pnr.length === 6

  return (
    <div className="bg-[#f5f5f5] min-h-screen py-12">
      <div className="max-w-[800px] mx-auto px-4 text-center">
        {isEligible ? (
          <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200 animate-slide-up text-left">
            <div className="flex items-center gap-4 mb-8 pb-6 border-b border-gray-100">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center shrink-0">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-[#002147]">You are checked in!</h1>
                <p className="text-gray-600">You&apos;re all set for your flight, {name}.</p>
              </div>
            </div>

            <div className="mb-8">
              <div className="flex justify-between items-center bg-gray-50 p-4 rounded-lg border border-gray-200">
                <div>
                  <p className="text-xs text-gray-500 uppercase font-semibold mb-1">Flight</p>
                  <p className="font-bold text-[#002147] flex items-center gap-2"><Plane className="w-4 h-4 text-[#c8102e]" /> KQ 100</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase font-semibold mb-1">Date</p>
                  <p className="font-bold text-[#002147]">Wed 24 Jun 2026</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase font-semibold mb-1">Status</p>
                  <p className="font-bold text-green-600">Checked In</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Link 
                href="/booking/seat-selection"
                className="flex flex-col items-center justify-center p-6 border border-gray-200 rounded-lg hover:border-[#c8102e] transition-colors group text-center"
              >
                <Armchair className="w-8 h-8 text-[#002147] mb-3 group-hover:text-[#c8102e] transition-colors" />
                <span className="font-bold text-[#002147] group-hover:text-[#c8102e]">Select Seat</span>
              </Link>
              
              <button 
                onClick={() => {
                  alert("Generating Boarding Pass with barcode...\n\n| | || ||| | ||| | || || | |\n| | || ||| | ||| | || || | |\nKQ100 NBO -> MBA")
                }}
                className="flex flex-col items-center justify-center p-6 border border-gray-200 rounded-lg hover:border-[#c8102e] transition-colors group text-center"
              >
                <Printer className="w-8 h-8 text-[#002147] mb-3 group-hover:text-[#c8102e] transition-colors" />
                <span className="font-bold text-[#002147] group-hover:text-[#c8102e]">Download Boarding Pass</span>
              </button>

              <button 
                onClick={() => alert("Added to Apple Wallet")}
                className="flex flex-col items-center justify-center p-6 border border-gray-200 rounded-lg hover:border-black transition-colors group text-center bg-black/5"
              >
                <Smartphone className="w-8 h-8 text-black mb-3 group-hover:scale-110 transition-transform" />
                <span className="font-bold text-black">Add to Apple Wallet</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200 animate-slide-up">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-8 h-8 text-red-600" />
            </div>
            <h1 className="text-2xl font-bold text-[#002147] mb-2">Check-in Unavailable</h1>
            <p className="text-gray-600 mb-6">Sorry {name}, we could not find a booking matching PNR <span className="font-bold">{pnr}</span> or check-in is not yet open for this flight.</p>
            <button 
              onClick={() => window.history.back()}
              className="px-8 py-3 border border-[#002147] text-[#002147] font-bold rounded-md hover:bg-gray-50 transition-colors"
            >
              Go Back
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
