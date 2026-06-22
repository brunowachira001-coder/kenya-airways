"use client"

import { useState } from "react"
import { Plane } from "lucide-react"

export default function FlightStatusPage() {
  const [tab, setTab] = useState<"flightNumber" | "route">("flightNumber")

  const [flightNo, setFlightNo] = useState("")
  const [origin, setOrigin] = useState("")
  const [destination, setDestination] = useState("")
  const [date, setDate] = useState("")
  const [hasSearched, setHasSearched] = useState(false)

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setHasSearched(true)
  }

  return (
    <div className="bg-[#f5f5f5] min-h-screen py-12">
      <div className="max-w-[800px] mx-auto px-4">
        <h1 className="text-3xl font-bold text-[#002147] mb-2">Flight Status</h1>
        <p className="text-gray-600 mb-8">Check the real-time status of your flight.</p>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden mb-8">
          <div className="flex border-b border-gray-200">
            <button 
              className={`flex-1 py-4 font-bold text-center transition-colors ${tab === "flightNumber" ? "border-b-2 border-[#c8102e] text-[#c8102e]" : "text-gray-500 hover:text-[#002147]"}`}
              onClick={() => setTab("flightNumber")}
            >
              By Flight Number
            </button>
            <button 
              className={`flex-1 py-4 font-bold text-center transition-colors ${tab === "route" ? "border-b-2 border-[#c8102e] text-[#c8102e]" : "text-gray-500 hover:text-[#002147]"}`}
              onClick={() => setTab("route")}
            >
              By Route
            </button>
          </div>
          
          <div className="p-6">
            {tab === "flightNumber" ? (
              <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4 items-end">
                <div className="flex-1 w-full">
                  <label className="text-xs font-semibold text-gray-500 uppercase mb-1 block">Flight Number</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-gray-500">KQ</span>
                    <input 
                      required
                      type="text" 
                      value={flightNo}
                      onChange={(e) => setFlightNo(e.target.value.replace(/\D/g, ''))}
                      className="w-full h-12 pl-12 pr-4 border border-gray-300 rounded-md focus:border-[#c8102e]"
                      placeholder="100"
                    />
                  </div>
                </div>
                <div className="flex-1 w-full">
                  <label className="text-xs font-semibold text-gray-500 uppercase mb-1 block">Date</label>
                  <input 
                    required
                    type="date" 
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full h-12 px-4 border border-gray-300 rounded-md focus:border-[#c8102e]"
                  />
                </div>
                <button type="submit" className="h-12 px-8 bg-[#c8102e] text-white font-bold rounded-md hover:bg-[#a00c24] transition-colors w-full md:w-auto">
                  Search
                </button>
              </form>
            ) : (
              <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4 items-end">
                <div className="flex-1 w-full">
                  <label className="text-xs font-semibold text-gray-500 uppercase mb-1 block">From</label>
                  <input 
                    required
                    type="text" 
                    value={origin}
                    onChange={(e) => setOrigin(e.target.value)}
                    className="w-full h-12 px-4 border border-gray-300 rounded-md focus:border-[#c8102e]"
                    placeholder="e.g. NBO"
                  />
                </div>
                <div className="flex-1 w-full">
                  <label className="text-xs font-semibold text-gray-500 uppercase mb-1 block">To</label>
                  <input 
                    required
                    type="text" 
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    className="w-full h-12 px-4 border border-gray-300 rounded-md focus:border-[#c8102e]"
                    placeholder="e.g. MBA"
                  />
                </div>
                <div className="flex-1 w-full">
                  <label className="text-xs font-semibold text-gray-500 uppercase mb-1 block">Date</label>
                  <input 
                    required
                    type="date" 
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full h-12 px-4 border border-gray-300 rounded-md focus:border-[#c8102e]"
                  />
                </div>
                <button type="submit" className="h-12 px-8 bg-[#c8102e] text-white font-bold rounded-md hover:bg-[#a00c24] transition-colors w-full md:w-auto">
                  Search
                </button>
              </form>
            )}
          </div>
        </div>

        {hasSearched && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 animate-slide-up">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-[#002147] flex items-center gap-2">
                <Plane className="w-5 h-5 text-[#c8102e]" /> Flight KQ{flightNo || "100"}
              </h2>
              <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-semibold border border-green-200">On Time</span>
            </div>
            
            <div className="flex items-center justify-between relative">
              {/* Origin */}
              <div className="text-center w-1/3 z-10 bg-white">
                <div className="text-2xl font-bold text-[#002147]">{origin || "NBO"}</div>
                <div className="text-sm text-gray-500 mb-2">Nairobi</div>
                <div className="font-bold text-lg">08:00 AM</div>
                <div className="text-xs text-gray-400">Scheduled: 08:00 AM</div>
              </div>

              {/* Line */}
              <div className="absolute left-1/4 right-1/4 top-4 h-[2px] bg-gray-200 -z-0"></div>
              <div className="absolute left-1/2 -translate-x-1/2 top-1 text-gray-300 bg-white px-2">
                <Plane className="w-6 h-6" />
              </div>

              {/* Destination */}
              <div className="text-center w-1/3 z-10 bg-white">
                <div className="text-2xl font-bold text-[#002147]">{destination || "MBA"}</div>
                <div className="text-sm text-gray-500 mb-2">Mombasa</div>
                <div className="font-bold text-lg">09:00 AM</div>
                <div className="text-xs text-gray-400">Scheduled: 09:00 AM</div>
              </div>
            </div>

            <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4 pt-6 border-t border-gray-100">
              <div>
                <p className="text-xs text-gray-500 uppercase">Terminal</p>
                <p className="font-bold text-[#002147]">1A (NBO)</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase">Gate</p>
                <p className="font-bold text-[#002147]">14</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase">Baggage Claim</p>
                <p className="font-bold text-[#002147]">Belt 2</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase">Aircraft</p>
                <p className="font-bold text-[#002147]">Boeing 737-800</p>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  )
}
