"use client"

import { useBookingStore } from "@/store/booking-store"
import { Plane, Users, Check } from "lucide-react"

export function TripSummary() {
  const { 
    origin, destination, departureDate, returnDate, tripType,
    passengers, cabinClass, selectedFare, extras, selectedOutboundFlight, selectedReturnFlight
  } = useBookingStore()

  const totalPassengers = passengers.adults + passengers.children + passengers.infants

  const outboundPrice = selectedOutboundFlight ? selectedOutboundFlight.price * totalPassengers : 0
  const returnPrice = selectedReturnFlight ? selectedReturnFlight.price * totalPassengers : 0
  const baseFare = outboundPrice + returnPrice
  
  const extrasPrice = extras.extraBaggage * 3000 + (extras.travelInsurance ? 1500 * totalPassengers : 0) // rough mock (40% discount applied)
  const total = baseFare + extrasPrice

  return (
    <div className="bg-white rounded-lg shadow-card border border-gray-100 p-6 sticky top-24">
      <h2 className="font-sans text-xl font-bold mb-6 border-b pb-4">Your Booking</h2>
      
      {/* Flight Info */}
      <div className="mb-6">
        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">Flight Details</h3>
        
        {/* Outbound */}
        <div className="flex items-start gap-4 mb-4">
          <div className="mt-1">
            <Plane className="w-5 h-5 text-brand-primary" />
          </div>
          <div>
            <p className="font-bold">{origin} <ArrowRight className="inline w-3 h-3 mx-1" /> {destination}</p>
            <p className="text-sm text-gray-600">{departureDate ? new Date(departureDate).toDateString() : "Date not selected"}</p>
            {selectedOutboundFlight && <p className="text-sm text-gray-500">Flight {selectedOutboundFlight.id}</p>}
          </div>
        </div>

        {/* Return */}
        {tripType === "round-trip" && (
          <div className="flex items-start gap-4">
            <div className="mt-1">
              <Plane className="w-5 h-5 text-brand-primary rotate-180" />
            </div>
            <div>
              <p className="font-bold">{destination} <ArrowRight className="inline w-3 h-3 mx-1" /> {origin}</p>
              <p className="text-sm text-gray-600">{returnDate ? new Date(returnDate).toDateString() : "Date not selected"}</p>
              {selectedReturnFlight && <p className="text-sm text-gray-500">Flight {selectedReturnFlight.id}</p>}
            </div>
          </div>
        )}
      </div>

      {/* Passengers */}
      <div className="mb-6 border-t pt-4">
        <div className="flex items-center gap-3 mb-2">
          <Users className="w-4 h-4 text-gray-500" />
          <p className="font-semibold">{totalPassengers} Passenger(s)</p>
        </div>
        <p className="text-sm text-gray-600 pl-7">{cabinClass} {selectedFare ? `(${selectedFare})` : ""}</p>
      </div>

      {/* Extras Summary */}
      {(extras.extraBaggage > 0 || extras.seats.length > 0 || extras.travelInsurance) && (
        <div className="mb-6 border-t pt-4">
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">Extras</h3>
          <ul className="space-y-2 text-sm">
            {extras.extraBaggage > 0 && (
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-green-500" /> {extras.extraBaggage} Extra Bag(s)
              </li>
            )}
            {extras.seats.length > 0 && (
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-green-500" /> {extras.seats.length} Seat(s) Selected
              </li>
            )}
            {extras.travelInsurance && (
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-green-500" /> Travel Insurance
              </li>
            )}
          </ul>
        </div>
      )}

      {/* Total Price */}
      <div className="border-t pt-4 mt-auto">
        <div className="flex justify-between items-center mb-2 text-gray-600">
          <span>Flights</span>
          <span>KES {baseFare.toLocaleString()}</span>
        </div>
        {extrasPrice > 0 && (
          <div className="flex justify-between items-center mb-2 text-gray-600">
            <span>Extras</span>
            <span>KES {extrasPrice.toLocaleString()}</span>
          </div>
        )}
        <div className="flex justify-between items-end mt-4">
          <span className="font-bold text-lg">Total</span>
          <span className="font-bold text-2xl text-brand-primary">KES {total.toLocaleString()}</span>
        </div>
      </div>
    </div>
  )
}

function ArrowRight(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
    </svg>
  )
}
