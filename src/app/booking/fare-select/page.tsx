"use client"

import { useEffect, useState } from "react"
import { useBookingStore, calculateBookingTotal } from "@/store/booking-store"
import { useRouter } from "next/navigation"
import { TripSummary } from "@/components/booking/trip-summary"
import { Check, ExternalLink, Info, AlertTriangle } from "lucide-react"

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
    selectedReturnFlight,
    tripType,
    passengers,
    origin,
    destination,
    departureDate,
    returnDate,
    cabinClass
  } = useBookingStore()
  const [showSummary, setShowSummary] = useState(false)
  const [showPriceDetails, setShowPriceDetails] = useState(false)
  const [showFareConditions, setShowFareConditions] = useState(false)
  const [showDangerousGoods, setShowDangerousGoods] = useState(false)

  useEffect(() => {
    setCurrentStep(2)
  }, [setCurrentStep])

  const basePrice = selectedOutboundFlight?.price || 22500

  const totalPassengers = passengers.adults + passengers.children + passengers.infants

  const totals = calculateBookingTotal({
    selectedOutboundFlight,
    selectedReturnFlight,
    selectedFare,
    passengers,
    selectedSeat: null,
    extras: { seats: [], extraBaggage: 0, travelInsurance: false, meals: {}, specialRequests: [] },
  })
  const totalPrice = totals.flightTotal

  const handleContinue = () => {
    if (selectedFare) {
      setShowSummary(true)
    }
  }
  
  const handleAddPassengers = () => {
    router.push("/booking/passengers")
  }

  const modals = (
    <>
      {showFareConditions && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50" onClick={() => setShowFareConditions(false)}>
          <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full mx-4 max-h-[80vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Info className="w-5 h-5 text-brand-primary" />
                Fare Conditions
              </h3>
              <button onClick={() => setShowFareConditions(false)} className="text-gray-400 hover:text-gray-600 text-2xl leading-none">&times;</button>
            </div>
            <div className="p-4 space-y-4 text-sm text-gray-700">
              <div>
                <h4 className="font-semibold text-base mb-2">Fare Guidelines</h4>
                <p className="mb-3">
                  All Kenya Airways flight tickets are subject to availability and are governed by the Kenya Airways Conditions of Carriage and relevant ticket conditions stated during the booking process.
                </p>
                <p className="mb-3">
                  The fares may vary due to currency fluctuations and government tax regulations, depending on the booked itinerary. Please note the fare being displayed is for the selected flight(s).
                </p>
                <p>
                  It is essential to review the applicable fare rules and ticket conditions to understand the specific terms and guidelines. We recommend booking early to secure the best fare. Safe Travels!
                </p>
              </div>

              <div className="border-t pt-4">
                <h4 className="font-semibold mb-2">Economy Light</h4>
                <ul className="list-disc list-inside space-y-1 text-gray-600">
                  <li>Non-refundable fare</li>
                  <li>No free checked baggage included</li>
                  <li>Seat selection available for a fee</li>
                  <li>Changes subject to fee plus fare difference</li>
                </ul>
              </div>

              <div className="border-t pt-4">
                <h4 className="font-semibold mb-2">Economy Standard</h4>
                <ul className="list-disc list-inside space-y-1 text-gray-600">
                  <li>1 x 23kg checked baggage included</li>
                  <li>Free seat selection</li>
                  <li>Complimentary meals</li>
                  <li>Changeable with fee</li>
                </ul>
              </div>

              <div className="border-t pt-4">
                <h4 className="font-semibold mb-2">Business Class</h4>
                <ul className="list-disc list-inside space-y-1 text-gray-600">
                  <li>2 x 32kg checked baggage included</li>
                  <li>Premium seat selection included</li>
                  <li>Full meal service with premium beverages</li>
                  <li>Flexible — changes and refunds allowed</li>
                  <li>Lounge access included</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {showDangerousGoods && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50" onClick={() => setShowDangerousGoods(false)}>
          <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full mx-4 max-h-[80vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-amber-600" />
                Dangerous Goods Policy
              </h3>
              <button onClick={() => setShowDangerousGoods(false)} className="text-gray-400 hover:text-gray-600 text-2xl leading-none">&times;</button>
            </div>
            <div className="p-4 space-y-4 text-sm text-gray-700">
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                <p className="font-semibold text-amber-800">Important Safety Notice</p>
                <p className="text-amber-700 text-xs mt-1">
                  For safety reasons, certain items are restricted or prohibited in both cabin and checked baggage. Penalties may apply for non-compliance.
                </p>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Prohibited in ALL Baggage</h4>
                <ul className="list-disc list-inside space-y-1 text-gray-600">
                  <li>Explosives and incendiary devices</li>
                  <li>Compressed gases (scuba tanks, aerosols)</li>
                  <li>Flammable liquids (fuel, paint thinners)</li>
                  <li>Corrosive substances (acids, alkalis)</li>
                  <li>Radioactive materials</li>
                  <li>Vehicle airbags with gas generators</li>
                </ul>
              </div>

              <div className="border-t pt-4">
                <h4 className="font-semibold mb-2">Prohibited in Checked Baggage (Cabin OK)</h4>
                <ul className="list-disc list-inside space-y-1 text-gray-600">
                  <li>Lithium batteries and power banks</li>
                  <li>E-cigarettes and vapes</li>
                  <li>Portable electronic devices with lithium batteries</li>
                  <li>Strike-anywhere matches</li>
                  <li>Flammable solid substances</li>
                </ul>
              </div>

              <div className="border-t pt-4">
                <h4 className="font-semibold mb-2">Lithium Battery Restrictions</h4>
                <ul className="list-disc list-inside space-y-1 text-gray-600">
                  <li>Must be carried in cabin baggage only</li>
                  <li>Max 2 battery cells per device</li>
                  <li>Power banks: max 100Wh (up to 160Wh with airline approval)</li>
                  <li>Spare batteries must be individually protected</li>
                </ul>
              </div>

              <div className="border-t pt-4">
                <h4 className="font-semibold mb-2">Liquids in Cabin Baggage</h4>
                <ul className="list-disc list-inside space-y-1 text-gray-600">
                  <li>Containers must be 100ml or less</li>
                  <li>All containers in one clear, resealable bag (max 1 litre)</li>
                  <li>One bag per passenger</li>
                </ul>
              </div>

              <p className="text-xs text-gray-500 border-t pt-3">
                For the complete list of dangerous goods, please refer to IATA Dangerous Goods Regulations (DGR) or contact Kenya Airways customer service.
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  )

  if (showSummary) {
    return (
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <div className="text-right mb-6">
            <p className="text-lg mb-2">
              Total price: <span className="text-3xl font-bold ml-2">KES {totalPrice.toLocaleString()}</span>
            </p>
            <p className="text-sm text-gray-600">
              {tripType === "round-trip" ? "Round trip price" : "One-way price"} for all passengers (including taxes, fees and discounts).{" "}
              <button 
                onClick={() => setShowPriceDetails(!showPriceDetails)}
                className="text-brand-primary hover:underline ml-1 inline-flex items-center gap-1"
              >
                See price details
                <ExternalLink className="w-3 h-3" />
              </button>
            </p>
          </div>

          {showPriceDetails && (
            <div className="mb-6 p-4 bg-gray-50 rounded border border-gray-200">
              <h3 className="font-semibold mb-3">Price Breakdown</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Outbound Flight</span>
                  <span className="font-medium">KES {(totals.outboundBase * totals.fareMultiplier).toLocaleString()}</span>
                </div>
                {totals.returnBase > 0 && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Return Flight</span>
                    <span className="font-medium">KES {(totals.returnBase * totals.fareMultiplier).toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-gray-600">Fare ({selectedFare || "Economy Light"}) × {totalPassengers} passenger{totalPassengers !== 1 ? "s" : ""}</span>
                  <span className="font-medium">×{totals.fareMultiplier}</span>
                </div>
                <div className="border-t pt-2 flex justify-between font-semibold">
                  <span>Total Flight Cost</span>
                  <span className="text-brand-primary">KES {totals.flightTotal.toLocaleString()}</span>
                </div>
              </div>
            </div>
          )}

          <div className="flex flex-wrap gap-3 justify-center mb-6 text-sm">
            <a href="/plan/baggage-information" target="_blank" className="text-gray-600 hover:underline inline-flex items-center gap-1">
              Detailed baggage policy
              <ExternalLink className="w-3 h-3" />
            </a>
            <span className="text-gray-400">|</span>
            <button
              onClick={() => setShowFareConditions(true)}
              className="text-gray-600 hover:underline inline-flex items-center gap-1"
            >
              Fare conditions
              <ExternalLink className="w-3 h-3" />
            </button>
            <span className="text-gray-400">|</span>
            <button
              onClick={() => setShowDangerousGoods(true)}
              className="text-gray-600 hover:underline inline-flex items-center gap-1"
            >
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
        {modals}
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
                    <p className="text-xs text-gray-500 mt-0.5">per person, one way</p>
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
                const params = new URLSearchParams()
                if (origin) params.set('from', origin)
                if (destination) params.set('to', destination)
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
      {modals}
    </div>
  )
}
