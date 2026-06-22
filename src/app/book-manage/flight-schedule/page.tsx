"use client"

import { useState } from "react"
import { Search, ArrowRight, Plane } from "lucide-react"

const MOCK_SCHEDULES = [
  { flightNo: "KQ 600", dep: "06:30", arr: "07:30", origin: "NBO", dest: "MBA", days: "Daily", duration: "1h 00m" },
  { flightNo: "KQ 604", dep: "10:15", arr: "11:15", origin: "NBO", dest: "MBA", days: "Daily", duration: "1h 00m" },
  { flightNo: "KQ 100", dep: "08:15", arr: "16:15", origin: "NBO", dest: "LHR", days: "Mon, Wed, Fri, Sun", duration: "8h 00m" },
  { flightNo: "KQ 310", dep: "18:45", arr: "01:05", origin: "NBO", dest: "DXB", days: "Daily", duration: "5h 20m" },
  { flightNo: "KQ 202", dep: "13:00", arr: "21:30", origin: "NBO", dest: "BOM", days: "Tue, Thu, Sat", duration: "6h 00m" },
]

export default function FlightSchedulePage() {
  const [origin, setOrigin] = useState("")
  const [dest, setDest] = useState("")
  const [results, setResults] = useState(MOCK_SCHEDULES)

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (!origin && !dest) {
      setResults(MOCK_SCHEDULES)
      return
    }
    const filtered = MOCK_SCHEDULES.filter(s => {
      const matchOrigin = !origin || s.origin.toLowerCase().includes(origin.toLowerCase())
      const matchDest = !dest || s.dest.toLowerCase().includes(dest.toLowerCase())
      return matchOrigin && matchDest
    })
    setResults(filtered)
  }

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Header */}
      <div 
        className="relative h-[30vh] min-h-[200px] bg-cover bg-center flex items-end pb-8 text-white"
        style={{ backgroundImage: `url('/hero_slide_1.png')` }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
        <div className="max-w-content mx-auto px-4 w-full relative z-10">
          <h1 className="text-3xl md:text-4xl font-display font-bold tracking-tight mb-1">
            Flight Schedules
          </h1>
          <p className="text-sm opacity-90">
            Check operational timetables and frequency across the Kenya Airways network.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-content mx-auto px-4 py-10 w-full space-y-8">
        
        {/* Search form */}
        <form onSubmit={handleSearch} className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase mb-1 block">Origin City / Code</label>
            <input 
              type="text" 
              placeholder="e.g. NBO" 
              value={origin}
              onChange={(e) => setOrigin(e.target.value)}
              className="w-full h-11 px-3 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-[#ed1c24]"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase mb-1 block">Destination City / Code</label>
            <input 
              type="text" 
              placeholder="e.g. MBA" 
              value={dest}
              onChange={(e) => setDest(e.target.value)}
              className="w-full h-11 px-3 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-[#ed1c24]"
            />
          </div>
          <button 
            type="submit"
            className="bg-[#ed1c24] hover:bg-[#c11218] text-white font-bold h-11 px-6 rounded-md text-sm transition-colors flex items-center justify-center gap-2"
          >
            <Search className="w-4 h-4" /> Filter Schedule
          </button>
        </form>

        {/* Results table */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100 text-xs font-semibold uppercase text-gray-400">
                  <th className="p-4">Flight</th>
                  <th className="p-4">Route</th>
                  <th className="p-4">Departure</th>
                  <th className="p-4">Arrival</th>
                  <th className="p-4">Duration</th>
                  <th className="p-4">Frequency</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {results.length > 0 ? (
                  results.map((r, idx) => (
                    <tr key={idx} className="hover:bg-gray-50/50">
                      <td className="p-4 font-semibold text-[#0d0d0d] flex items-center gap-2">
                        <Plane className="w-4 h-4 text-[#ed1c24] rotate-90" /> {r.flightNo}
                      </td>
                      <td className="p-4 font-medium">
                        {r.origin} <ArrowRight className="w-3.5 h-3.5 inline mx-1 text-gray-400" /> {r.dest}
                      </td>
                      <td className="p-4 text-gray-600 font-medium">{r.dep}</td>
                      <td className="p-4 text-gray-600 font-medium">{r.arr}</td>
                      <td className="p-4 text-gray-500">{r.duration}</td>
                      <td className="p-4 text-xs font-semibold text-gray-500">{r.days}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-gray-400">
                      No operational flights found matching the search criteria.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  )
}
