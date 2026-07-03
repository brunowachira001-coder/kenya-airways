"use client"

import { useEffect, useState } from "react"
import { useBookingStore } from "@/store/booking-store"
import { useRouter } from "next/navigation"
import { TripSummary } from "@/components/booking/trip-summary"
import { ShieldCheck, Luggage, Utensils, Accessibility, Tag } from "lucide-react"

export default function ExtrasPage() {
  const router = useRouter()
  const { setCurrentStep, passengers, extras, setExtras } = useBookingStore()

  const [promoCode, setPromoCode] = useState("")
  const [promoSuccess, setPromoSuccess] = useState("")

  useEffect(() => {
    setCurrentStep(4) // Seat is optional, Passengers=3, Extras=4, Review=5, Payment=6
  }, [setCurrentStep])

  const totalPassengers = passengers.adults + passengers.children

  const handleApplyPromo = () => {
    if (promoCode.trim()) {
      setPromoSuccess("Promo code applied successfully!")
      useBookingStore.setState({ promoCode: promoCode.toUpperCase() })
    } else {
      setPromoSuccess("Please enter a promo code.")
    }
  }

  const handleContinue = () => {
    router.push("/booking/payment/mobile")
  }

  const toggleSpecialRequest = (request: string) => {
    const currentReqs = extras.specialRequests || []
    if (currentReqs.includes(request)) {
      setExtras({ specialRequests: currentReqs.filter(r => r !== request) })
    } else {
      setExtras({ specialRequests: [...currentReqs, request] })
    }
  }

  return (
    <div className="max-w-content mx-auto px-4">
      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* Main Area */}
        <div className="flex-1 flex flex-col gap-6 mb-12">
          <h1 className="text-2xl font-bold text-[#002147]">Add Extras</h1>
          
          {/* Baggage */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="bg-[#f5f5f5] p-4 border-b flex items-center gap-2">
              <Luggage className="w-5 h-5 text-gray-500" />
              <h2 className="font-bold text-[#002147]">Checked Baggage — Outbound flight</h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <label className="flex items-center gap-4 p-4 border border-gray-200 rounded-md cursor-pointer hover:bg-gray-50">
                  <input 
                    type="radio" 
                    name="baggage" 
                    checked={extras.extraBaggage === 0}
                    onChange={() => setExtras({ extraBaggage: 0 })}
                    className="w-4 h-4 text-[#c8102e]"
                  />
                  <div className="flex-1 font-semibold text-[#002147]">0 extra bags (included in fare)</div>
                  <div className="font-bold text-gray-500">Included</div>
                </label>
                <label className="flex items-center gap-4 p-4 border border-gray-200 rounded-md cursor-pointer hover:bg-gray-50">
                  <input 
                    type="radio" 
                    name="baggage" 
                    checked={extras.extraBaggage === 1}
                    onChange={() => setExtras({ extraBaggage: 1 })}
                    className="w-4 h-4 text-[#c8102e]"
                  />
                  <div className="flex-1 font-semibold text-[#002147]">+1 bag 23kg</div>
                  <div className="font-bold text-[#c8102e]">KES 4,500</div>
                </label>
                <label className="flex items-center gap-4 p-4 border border-gray-200 rounded-md cursor-pointer hover:bg-gray-50">
                  <input 
                    type="radio" 
                    name="baggage" 
                    checked={extras.extraBaggage === 2}
                    onChange={() => setExtras({ extraBaggage: 2 })}
                    className="w-4 h-4 text-[#c8102e]"
                  />
                  <div className="flex-1 font-semibold text-[#002147]">+2 bags 23kg</div>
                  <div className="font-bold text-[#c8102e]">KES 8,500</div>
                </label>
              </div>
            </div>
          </div>

          {/* Meals */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="bg-[#f5f5f5] p-4 border-b flex items-center gap-2">
              <Utensils className="w-5 h-5 text-gray-500" />
              <h2 className="font-bold text-[#002147]">Meals</h2>
            </div>
            <div className="p-6">
              {Array.from({ length: totalPassengers }).map((_, idx) => (
                <div key={idx} className="mb-4 last:mb-0">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Passenger {idx + 1}</label>
                  <select 
                    className="w-full h-12 px-4 border border-gray-300 rounded-md"
                    value={extras.meals?.[idx] || "Standard"}
                    onChange={(e) => {
                      const newMeals = { ...extras.meals }
                      newMeals[idx] = e.target.value
                      setExtras({ meals: newMeals })
                    }}
                  >
                    <option value="Standard">Standard</option>
                    <option value="Vegetarian">Vegetarian</option>
                    <option value="Vegan">Vegan</option>
                    <option value="Halal">Halal</option>
                    <option value="Kosher">Kosher</option>
                    <option value="Child Meal">Child Meal</option>
                    <option value="Diabetic">Diabetic</option>
                  </select>
                </div>
              ))}
            </div>
          </div>

          {/* Special Assistance */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="bg-[#f5f5f5] p-4 border-b flex items-center gap-2">
              <Accessibility className="w-5 h-5 text-gray-500" />
              <h2 className="font-bold text-[#002147]">Special Assistance</h2>
            </div>
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              {['Wheelchair', 'Unaccompanied minor', 'Extra oxygen', 'Visual impairment'].map(req => (
                <label key={req} className="flex items-center gap-3 cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={(extras.specialRequests || []).includes(req)}
                    onChange={() => toggleSpecialRequest(req)}
                    className="w-4 h-4 rounded text-[#c8102e]"
                  />
                  <span className="text-gray-700">{req}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Travel Insurance */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="bg-[#f5f5f5] p-4 border-b flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-gray-500" />
              <h2 className="font-bold text-[#002147]">Travel Insurance</h2>
            </div>
            <div className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 border border-[#1a7a4c] bg-green-50/30 rounded-lg m-6">
              <div>
                <h3 className="font-bold text-[#002147] text-lg">Protect your trip</h3>
                <p className="text-gray-600 text-sm">KES 2,800 per person</p>
              </div>
              <button 
                onClick={() => setExtras({ travelInsurance: !extras.travelInsurance })}
                className={`px-6 py-2 rounded-md font-bold transition-colors ${extras.travelInsurance ? 'bg-white border border-[#c8102e] text-[#c8102e]' : 'bg-[#c8102e] text-white'}`}
              >
                {extras.travelInsurance ? 'Remove' : 'Add Insurance'}
              </button>
            </div>
          </div>

          {/* Promo Code */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="bg-[#f5f5f5] p-4 border-b flex items-center gap-2">
              <Tag className="w-5 h-5 text-gray-500" />
              <h2 className="font-bold text-[#002147]">Promo Code</h2>
            </div>
            <div className="p-6">
              <div className="flex gap-4">
                <input 
                  type="text" 
                  placeholder="Enter promo code"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  className="flex-1 h-12 px-4 border border-gray-300 rounded-md focus:border-[#c8102e]"
                />
                <button 
                  onClick={handleApplyPromo}
                  className="h-12 px-6 bg-[#002147] text-white font-bold rounded-md hover:bg-[#001530] transition-colors"
                >
                  Apply
                </button>
              </div>
              {promoSuccess && (
                <p className={`mt-3 text-sm font-semibold ${promoSuccess.includes('Invalid') ? 'text-[#c8102e]' : 'text-[#1a7a4c]'}`}>
                  {promoSuccess}
                </p>
              )}
            </div>
          </div>

        </div>

        {/* Right Sidebar */}
        <div className="w-full lg:w-[380px]">
          <TripSummary />
          
          <button 
            onClick={handleContinue}
            className="w-full mt-6 py-4 bg-[#c8102e] text-white font-bold rounded-md hover:bg-[#a00c24] shadow-md transition-colors text-lg"
          >
            Continue to Payment
          </button>
        </div>
      </div>
    </div>
  )
}
