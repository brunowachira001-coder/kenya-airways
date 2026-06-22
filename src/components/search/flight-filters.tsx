"use client"

import { useState } from "react"
import { SlidersHorizontal, X, Clock, Plane, DollarSign } from "lucide-react"

export interface FlightFilters {
  priceRange: [number, number]
  departureTime: string[]
  arrivalTime: string[]
  stops: string[]
  airlines: string[]
  duration: number
}

interface FlightFiltersProps {
  onFiltersChange: (filters: FlightFilters) => void
  onReset: () => void
}

export function FlightFiltersPanel({ onFiltersChange, onReset }: FlightFiltersProps) {
  const [showMobileFilters, setShowMobileFilters] = useState(false)
  const [filters, setFilters] = useState<FlightFilters>({
    priceRange: [0, 200000],
    departureTime: [],
    arrivalTime: [],
    stops: [],
    airlines: [],
    duration: 24
  })

  const updateFilter = <K extends keyof FlightFilters>(
    key: K,
    value: FlightFilters[K]
  ) => {
    const newFilters = { ...filters, [key]: value }
    setFilters(newFilters)
    onFiltersChange(newFilters)
  }

  const toggleArrayFilter = <K extends keyof Pick<FlightFilters, "departureTime" | "arrivalTime" | "stops" | "airlines">>(
    key: K,
    value: string
  ) => {
    const currentArray = filters[key] as string[]
    const newArray = currentArray.includes(value)
      ? currentArray.filter((item) => item !== value)
      : [...currentArray, value]
    updateFilter(key, newArray as FlightFilters[K])
  }

  const handleReset = () => {
    const resetFilters: FlightFilters = {
      priceRange: [0, 200000],
      departureTime: [],
      arrivalTime: [],
      stops: [],
      airlines: [],
      duration: 24
    }
    setFilters(resetFilters)
    onReset()
  }

  const activeFiltersCount = 
    (filters.departureTime.length > 0 ? 1 : 0) +
    (filters.arrivalTime.length > 0 ? 1 : 0) +
    (filters.stops.length > 0 ? 1 : 0) +
    (filters.airlines.length > 0 ? 1 : 0) +
    (filters.priceRange[0] > 0 || filters.priceRange[1] < 200000 ? 1 : 0) +
    (filters.duration < 24 ? 1 : 0)

  const FilterContent = () => (
    <div className="space-y-6">
      {/* Price Range */}
      <div>
        <h3 className="font-bold text-[#0d0d0d] mb-3 flex items-center gap-2">
          <DollarSign className="w-4 h-4 text-[#ed1c24]" />
          Price Range
        </h3>
        <div className="space-y-2">
          <input
            type="range"
            min="0"
            max="200000"
            step="5000"
            value={filters.priceRange[1]}
            onChange={(e) =>
              updateFilter("priceRange", [0, parseInt(e.target.value)])
            }
            className="w-full accent-[#ed1c24]"
          />
          <div className="flex justify-between text-sm text-gray-600">
            <span>KES 0</span>
            <span className="font-semibold text-[#ed1c24]">
              KES {filters.priceRange[1].toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      {/* Stops */}
      <div>
        <h3 className="font-bold text-[#0d0d0d] mb-3 flex items-center gap-2">
          <Plane className="w-4 h-4 text-[#ed1c24]" />
          Stops
        </h3>
        <div className="space-y-2">
          {["Direct", "1 Stop", "2+ Stops"].map((stop) => (
            <label key={stop} className="flex items-center gap-2 cursor-pointer group">
              <input
                type="checkbox"
                checked={filters.stops.includes(stop)}
                onChange={() => toggleArrayFilter("stops", stop)}
                className="w-4 h-4 accent-[#ed1c24] cursor-pointer"
              />
              <span className="text-sm text-gray-700 group-hover:text-[#ed1c24] transition-colors">
                {stop}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Departure Time */}
      <div>
        <h3 className="font-bold text-[#0d0d0d] mb-3 flex items-center gap-2">
          <Clock className="w-4 h-4 text-[#ed1c24]" />
          Departure Time
        </h3>
        <div className="space-y-2">
          {[
            { label: "Morning (00:00 - 11:59)", value: "morning" },
            { label: "Afternoon (12:00 - 17:59)", value: "afternoon" },
            { label: "Evening (18:00 - 23:59)", value: "evening" }
          ].map((time) => (
            <label key={time.value} className="flex items-center gap-2 cursor-pointer group">
              <input
                type="checkbox"
                checked={filters.departureTime.includes(time.value)}
                onChange={() => toggleArrayFilter("departureTime", time.value)}
                className="w-4 h-4 accent-[#ed1c24] cursor-pointer"
              />
              <span className="text-sm text-gray-700 group-hover:text-[#ed1c24] transition-colors">
                {time.label}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Airlines */}
      <div>
        <h3 className="font-bold text-[#0d0d0d] mb-3">Airlines</h3>
        <div className="space-y-2">
          {["Kenya Airways", "KLM", "Air France", "Emirates"].map((airline) => (
            <label key={airline} className="flex items-center gap-2 cursor-pointer group">
              <input
                type="checkbox"
                checked={filters.airlines.includes(airline)}
                onChange={() => toggleArrayFilter("airlines", airline)}
                className="w-4 h-4 accent-[#ed1c24] cursor-pointer"
              />
              <span className="text-sm text-gray-700 group-hover:text-[#ed1c24] transition-colors">
                {airline}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Max Duration */}
      <div>
        <h3 className="font-bold text-[#0d0d0d] mb-3">Maximum Duration</h3>
        <div className="space-y-2">
          <input
            type="range"
            min="1"
            max="24"
            step="1"
            value={filters.duration}
            onChange={(e) => updateFilter("duration", parseInt(e.target.value))}
            className="w-full accent-[#ed1c24]"
          />
          <div className="flex justify-between text-sm text-gray-600">
            <span>1 hour</span>
            <span className="font-semibold text-[#ed1c24]">
              {filters.duration}+ hours
            </span>
          </div>
        </div>
      </div>

      {/* Reset Button */}
      {activeFiltersCount > 0 && (
        <button
          onClick={handleReset}
          className="w-full py-2 px-4 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors text-sm font-medium"
        >
          Reset All Filters
        </button>
      )}
    </div>
  )

  return (
    <>
      {/* Desktop Filters */}
      <div className="hidden lg:block bg-white rounded-lg shadow-md p-6 sticky top-20">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-[#0d0d0d]">Filters</h2>
          {activeFiltersCount > 0 && (
            <span className="bg-[#ed1c24] text-white text-xs font-bold px-2 py-1 rounded-full">
              {activeFiltersCount}
            </span>
          )}
        </div>
        <FilterContent />
      </div>

      {/* Mobile Filter Button */}
      <button
        onClick={() => setShowMobileFilters(true)}
        className="lg:hidden fixed bottom-4 right-4 bg-[#ed1c24] text-white p-4 rounded-full shadow-lg hover:bg-[#d11820] transition-colors z-40 flex items-center gap-2"
      >
        <SlidersHorizontal className="w-5 h-5" />
        {activeFiltersCount > 0 && (
          <span className="bg-white text-[#ed1c24] text-xs font-bold px-2 py-0.5 rounded-full">
            {activeFiltersCount}
          </span>
        )}
      </button>

      {/* Mobile Filters Drawer */}
      {showMobileFilters && (
        <div className="lg:hidden fixed inset-0 z-50 bg-black/50" onClick={() => setShowMobileFilters(false)}>
          <div
            className="absolute right-0 top-0 bottom-0 w-full max-w-sm bg-white shadow-2xl overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex items-center justify-between z-10">
              <h2 className="text-lg font-bold text-[#0d0d0d] flex items-center gap-2">
                Filters
                {activeFiltersCount > 0 && (
                  <span className="bg-[#ed1c24] text-white text-xs font-bold px-2 py-1 rounded-full">
                    {activeFiltersCount}
                  </span>
                )}
              </h2>
              <button
                onClick={() => setShowMobileFilters(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6">
              <FilterContent />
            </div>
            <div className="sticky bottom-0 bg-white border-t border-gray-200 p-4">
              <button
                onClick={() => setShowMobileFilters(false)}
                className="w-full bg-[#ed1c24] text-white py-3 px-6 rounded-md font-semibold hover:bg-[#d11820] transition-colors"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
