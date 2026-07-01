"use client"

import { useEffect, useState } from "react"
import { useBookingStore } from "@/store/booking-store"
import { useRouter } from "next/navigation"
import { TripSummary } from "@/components/booking/trip-summary"
import { Check, ExternalLink } from "lucide-react"

const FARES = [
  {
    id: "economy-light",
    name: "Economy Light",
    priceMultiplier: 1,
    features: [
      { name: "Baggage", value: "0 checked", included: false },
      { name: "Seat selection", value: "Paid", included: false },
      { name: "Meals", value: "Paid", included: false },
      { name: "Flexibility", value: "Non-refundable", included: false },
      { name: "Lounge", value: "✗", included: false }
    ]
  },
  {
    id: "economy",
    name: "Economy",
    priceMultiplier: 1.2,
    features: [
      { name: "Baggage", value: "23kg", included: true },
      { name: "Seat selection", value: "Included", included: true },
      { name: "Meals", value: "Included", included: true },
      { name: "Flexibility", value: "Changeable fee", included: true },
      { name: "Lounge", value: "✗", included: false }
    ]
  },
  {
    id: "business",
    name: "Business",
    priceMultiplier: 2.5,
    features: [
      { name: "Baggage", value: "32kg", included: true },
      { name: "Seat selection", value: "Included", included: true },
      { name: "Meals", value: "Included", included: true },
      { name: "Flexibility", value: "Flexible", included: true },
      { name: "Lounge", value: "✓", included: true }
    ]
  }
]

export default function FareSelectPage() {
  const router = useRouter()
  const { 
    setCurrentStep, 
    selectedFare, 
    setSelectedFare, 
    selectedOutboundFlight, 
    passengers,
    origin,
    destination,
    departureDate,
    returnDate,
    cabinClass
  } = useBookingStore()
  const [showSummary, setShowSummary] = useState(false)
  const [showPriceDetails, setShowPriceDetails] = useState(false)

  useEffect(() => {
    setCurrentStep(2)
  }, [setCurrentStep])

  // Simple mock
  const basePrice = selectedOutboundFlight?.price || 22500
  
  // Calculate total passengers and price
  const totalPassengers = passengers.adults + passengers.children + passengers.infants
  const selectedFareData = FARES.find(f => f.name === selectedFare)
  const fareMultiplier = selectedFareData?.priceMultiplier || 1
  const totalPrice = Math.round(basePrice * fareMultiplier * 2 * totalPassengers) // *2 for round trip

  const handleContinue = () => {
    if (selectedFare) {
      setShowSummary(true)
    }
  }
  
  const handleAddPassengers = () => {
    router.push("/booking/passengers")
  }

  if (showSummary) {
    return (
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <div className="text-right mb-6">
            <p className="text-lg mb-2">
              Total price: <span className="text-3xl font-bold ml-2">KES {totalPrice.toLocaleString()}</span>
            </p>
            <p className="text-sm text-gray-600">
              Round trip price for all passengers (including taxes, fees and discounts). 
              <button 
                onClick={() => setShowPriceDetails(!showPriceDetails)}
                className="text-brand-primary hover:underline ml-1 inline-flex items-center gap-1"
              >
                See price details
                <ExternalLink className="w-3 h-3" />
              </button>
            </p>
          </div>

          {/* Price Details Breakdown */}
          {showPriceDetails && (
            <div className="mb-6 p-4 bg-gray-50 rounded border border-gray-200">
              <h3 className="font-semibold mb-3">Price Breakdown</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Base Fare (per passenger)</span>
                  <span className="font-medium">KES {basePrice.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Fare Type Multiplier ({selectedFare || "Standard"})</span>
                  <span className="font-medium">×{fareMultiplier}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Number of Passengers</span>
                  <span className="font-medium">×{totalPassengers}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Round Trip</span>
                  <span className="font-medium">×2</span>
                </div>
                <div className="border-t pt-2 flex justify-between font-semibold">
                  <span>Total Amount</span>
                  <span className="text-brand-primary">KES {totalPrice.toLocaleString()}</span>
                </div>
              </div>
            </div>
          )}

          <div className="flex flex-wrap gap-3 justify-center mb-6 text-sm">
            <button className="text-gray-600 hover:underline inline-flex items-center gap-1">
              Detailed baggage policy
              <ExternalLink className="w-3 h-3" />
            </button>
            <span className="text-gray-400">|</span>
            <button className="text-gray-600 hover:underline inline-flex items-center gap-1">
              Fare conditions
              <ExternalLink className="w-3 h-3" />
            </button>
            <span className="text-gray-400">|</span>
            <button className="text-gray-600 hover:underline inline-flex items-center gap-1">
              Dangerous goods policy
              <ExternalLink className="w-3 h-3" />
            </button>
          </div>

          <div className="flex justify-center">
            <button 
              onClick={handleAddPassengers}
              className="bg-brand-primary hover:bg-[#A00D25] text-white px-8 py-3 rounded-md font-semibold transition-colors"
            >
              Add your passenger details
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-content mx-auto px-4">
      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* Main Area */}
        <div className="flex-1">
          <h1 className="text-2xl font-bold mb-6">Select your fare</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {FARES.map(fare => {
              const isSelected = selectedFare === fare.name
              const price = basePrice * fare.priceMultiplier

              return (
                <div 
                  key={fare.id}
                  onClick={() => setSelectedFare(fare.name)}
                  className={`bg-white rounded-lg border-2 transition-all cursor-pointer overflow-hidden ${
                    isSelected ? "border-brand-primary ring-1 ring-brand-primary shadow-md" : "border-gray-200 hover:border-brand-primary"
                  }`}
                >
                  <div className={`p-4 text-center border-b ${isSelected ? "bg-brand-primary/5" : ""}`}>
                    <h3 className="font-bold text-lg">{fare.name}</h3>
                    <p className="text-2xl font-bold text-brand-secondary mt-2">KES {price.toLocaleString()}</p>
                  </div>
                  
                  <ul className="p-4 space-y-4">
                    {fare.features.map((feature, idx) => (
                      <li key={idx} className="flex flex-col items-center text-center">
                        <span className="text-xs text-gray-500 mb-1">{feature.name}</span>
                        <span className={`text-sm font-semibold flex items-center gap-1 ${feature.included ? "text-green-600" : "text-gray-600"}`}>
                          {feature.included ? <Check className="w-4 h-4" /> : null}
                          {feature.value}
                        </span>
                      </li>
                    ))}
                  </ul>

                  <div className="p-4 pt-0">
                    <button 
                      className={`w-full py-2 rounded-md font-semibold transition-colors ${
                        isSelected ? "bg-brand-primary text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      {isSelected ? "Selected" : "Select"}
                    </button>
                  </div>
                </div>
              )
            })}
          </div>

          <div className="mt-8 flex justify-between items-center">
            <button 
              onClick={() => {
                // Build search URL with original search parameters
                const params = new URLSearchParams()
                if (origin) params.set('from', origin)
                if (destination) params.set('to', destination)
                // Extract only the date part (YYYY-MM-DD) from ISO strings
                if (departureDate) {
                  const dateOnly = departureDate.split('T')[0]
                  params.set('depart', dateOnly)
                }
                if (returnDate) {
                  const dateOnly = returnDate.split('T')[0]
                  params.set('return', dateOnly)
                }
                params.set('adults', passengers.adults.toString())
                if (passengers.children > 0) params.set('children', passengers.children.toString())
                if (passengers.infants > 0) params.set('infants', passengers.infants.toString())
                if (cabinClass) params.set('cabin', cabinClass.toLowerCase())
                
                router.push(`/search?${params.toString()}`)
              }}
              className="text-gray-600 font-semibold hover:underline"
            >
              Back to flights
            </button>
            <button 
              onClick={handleContinue}
              disabled={!selectedFare}
              className="bg-brand-primary hover:bg-[#A00D25] disabled:bg-gray-300 text-white px-8 py-3 rounded-button font-bold transition-colors"
            >
              Continue
            </button>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="w-full lg:w-80 shrink-0">
          <TripSummary />
        </div>

      </div>
    </div>
  )
}
