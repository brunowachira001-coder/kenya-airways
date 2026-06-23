"use client"

import { useEffect, useState } from "react"
import { useBookingStore } from "@/store/booking-store"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { ExternalLink } from "lucide-react"

const EXTRA_SERVICES = [
  {
    id: "seats",
    name: "Seats",
    description: "Select your seat to experience comfort.",
    price: 2000,
    image: "/baggage_info.png",
    buttonText: "Select your seats"
  },
  {
    id: "baggage",
    name: "Baggage",
    description: "Ready to make your journey extraordinary with extra baggage? Shop at Kenya Airways will manage your additional luggage.",
    price: 16965,
    image: "/baggage_info.png",
    buttonText: "Add service"
  },
  {
    id: "meals",
    name: "Special Meals",
    description: "Would you like a meal customized for your health requirements, food allergies or religious practices? Please ensure to request it in advance for your journey.",
    price: 0,
    image: "/duty_free_luxury.png",
    buttonText: "Add meal",
    included: true
  },
  {
    id: "assistance",
    name: "Special assistance",
    description: "Kenya Airways cares, pre-book your wheelchair 48hrs before departure.",
    price: 0,
    image: "/special_care.png",
    buttonText: "Add service",
    included: true
  }
]

export default function ReviewPage() {
  const router = useRouter()
  const [selectedServices, setSelectedServices] = useState<Set<string>>(new Set())
  const [holdBooking, setHoldBooking] = useState(false)
  
  const { 
    setCurrentStep, 
    selectedOutboundFlight, 
    selectedReturnFlight,
    selectedFare,
    origin,
    destination,
    departureDate,
    returnDate,
    passengers,
    passengerDetails,
    contactDetails,
    setExtras,
    bookingReference
  } = useBookingStore()

  useEffect(() => {
    setCurrentStep(5)
  }, [setCurrentStep])

  const totalPassengers = passengers.adults + passengers.children + passengers.infants
  const basePrice = selectedOutboundFlight?.price || 45000
  const returnPrice = selectedReturnFlight?.price || 40000
  
  let fareMultiplier = 1
  if (selectedFare === "Economy") fareMultiplier = 1.2
  if (selectedFare === "Business Lite" || selectedFare === "Business") fareMultiplier = 2.5
  
  const outboundTotal = basePrice * fareMultiplier
  const returnTotal = returnPrice * fareMultiplier
  const flightTotal = Math.round((outboundTotal + returnTotal) * totalPassengers)
  
  // Calculate extra services total
  const servicesTotal = Array.from(selectedServices).reduce((sum, serviceId) => {
    const service = EXTRA_SERVICES.find(s => s.id === serviceId)
    return sum + (service?.price || 0) * totalPassengers
  }, 0)
  
  const holdBookingPrice = holdBooking ? 2610 : 0
  const totalPrice = flightTotal + servicesTotal + holdBookingPrice
  
  const toggleService = (serviceId: string) => {
    setSelectedServices(prev => {
      const newSet = new Set(prev)
      if (newSet.has(serviceId)) {
        newSet.delete(serviceId)
      } else {
        newSet.add(serviceId)
      }
      return newSet
    })
  }

  const handleCheckout = () => {
    // Save selected services and total price to store
    setExtras({
      selectedServices: Array.from(selectedServices),
      holdBooking: holdBooking,
      totalPrice: totalPrice
    })
    router.push("/booking/payment/mobile")
  }

  const formatDate = (dateStr: string | undefined) => {
    if (!dateStr) return ""
    const date = new Date(dateStr)
    return date.toLocaleDateString("en-US", { 
      weekday: "long", 
      day: "numeric",
      month: "long",
      year: "numeric"
    })
  }

  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      {/* Top Price Bar */}
      <div className="bg-gray-50 border-b border-gray-200 py-3 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto text-center sm:text-right">
          <span className="text-xs sm:text-sm font-medium block sm:inline">Total price for your flight: </span>
          <span className="text-lg sm:text-xl font-bold">KES {totalPrice.toLocaleString()}</span>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Your Selection */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-serif italic mb-2">Your selection</h1>
          <p className="text-base sm:text-lg">{origin === "NBO" ? "Nairobi" : origin} to {destination === "DAR" ? "Dar Es Salaam" : destination}</p>
        </div>

        {/* Booking Reference */}
        {bookingReference && (
          <div className="bg-green-50 border-l-4 border-green-500 p-3 sm:p-4 mb-6 sm:mb-8">
            <div className="flex items-start">
              <span className="text-green-600 mr-2 sm:mr-3 text-sm sm:text-base">✓</span>
              <div>
                <p className="font-semibold text-green-800 text-sm sm:text-base">Booking Created</p>
                <p className="text-xs sm:text-sm text-green-700">Reference: <span className="font-mono font-bold">{bookingReference}</span></p>
              </div>
            </div>
          </div>
        )}

        {/* Warning Message */}
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-3 sm:p-4 mb-6 sm:mb-8">
          <div className="flex items-start">
            <span className="text-yellow-600 mr-2 sm:mr-3 text-sm sm:text-base">⚠</span>
            <div>
              <p className="font-semibold text-yellow-800 text-sm sm:text-base">1 warning</p>
              <p className="text-xs sm:text-sm text-yellow-700">You&apos;re already subscribed to our newsletter.</p>
            </div>
          </div>
        </div>

        {/* Currency Selector */}
        <div className="flex justify-center sm:justify-end mb-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
            <label className="text-xs sm:text-sm">Select your preferred currency:</label>
            <select className="border border-gray-300 rounded px-3 py-1 text-xs sm:text-sm w-full sm:w-auto">
              <option>KES</option>
              <option>USD</option>
              <option>EUR</option>
              <option>GBP</option>
            </select>
          </div>
        </div>

        {/* Your Flights */}
        <div className="mb-6 sm:mb-8">
          <h2 className="text-xl sm:text-2xl font-semibold mb-4">Your flights</h2>
          
          {/* Outbound Flight */}
          <div className="bg-white border border-gray-200 rounded-lg p-4 sm:p-6 mb-4">
            <div className="flex flex-col sm:flex-row justify-between items-start mb-4 gap-3">
              <div>
                <h3 className="font-semibold text-base sm:text-lg">{origin === "NBO" ? "Nairobi" : origin} to {destination === "DAR" ? "Dar Es Salaam" : destination}</h3>
                <p className="text-xs sm:text-sm text-gray-600">{formatDate(departureDate)}</p>
              </div>
              <button className="flex items-center gap-1 text-xs sm:text-sm">
                <span>{selectedFare || "Business Lite"}</span>
                <span className="text-gray-400">▼</span>
              </button>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 sm:gap-6">
                  <div>
                    <p className="text-xl sm:text-2xl font-bold">18:45</p>
                    <p className="text-xs sm:text-sm text-gray-600">{origin}</p>
                    <p className="text-[10px] sm:text-xs text-gray-500">Terminal 1A</p>
                  </div>
                  
                  <div className="flex-1 flex flex-col items-center">
                    <p className="text-[10px] sm:text-xs text-gray-500 mb-1">nonstop</p>
                    <div className="w-full border-t-2 border-gray-300"></div>
                  </div>
                  
                  <div>
                    <p className="text-xl sm:text-2xl font-bold">20:10</p>
                    <p className="text-xs sm:text-sm text-gray-600">{destination}</p>
                    <p className="text-[10px] sm:text-xs text-gray-500">Terminal 3</p>
                  </div>
                </div>
              </div>

              <div className="text-left sm:text-right">
                <p className="text-xs sm:text-sm">Duration 1h 25min</p>
                <p className="text-xs sm:text-sm text-brand-secondary flex items-center gap-1">
                  Operated by Kenya Airways
                  <Image src="/kq_logo_transparent.png" alt="KQ" width={16} height={16} />
                </p>
              </div>
            </div>
          </div>

          {/* Return Flight */}
          <div className="bg-white border border-gray-200 rounded-lg p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row justify-between items-start mb-4 gap-3">
              <div>
                <h3 className="font-semibold text-base sm:text-lg">{destination === "DAR" ? "Dar Es Salaam" : destination} to {origin === "NBO" ? "Nairobi" : origin}</h3>
                <p className="text-xs sm:text-sm text-gray-600">{formatDate(returnDate)}</p>
              </div>
              <button className="flex items-center gap-1 text-xs sm:text-sm">
                <span>Economy Standard</span>
                <span className="text-gray-400">▼</span>
              </button>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 sm:gap-6">
                  <div>
                    <p className="text-xl sm:text-2xl font-bold">14:35</p>
                    <p className="text-xs sm:text-sm text-gray-600">{destination}</p>
                    <p className="text-[10px] sm:text-xs text-gray-500">Terminal 3</p>
                  </div>
                  
                  <div className="flex-1 flex flex-col items-center">
                    <p className="text-[10px] sm:text-xs text-gray-500 mb-1">nonstop</p>
                    <div className="w-full border-t-2 border-gray-300"></div>
                  </div>
                  
                  <div>
                    <p className="text-xl sm:text-2xl font-bold">15:55</p>
                    <p className="text-xs sm:text-sm text-gray-600">{origin}</p>
                    <p className="text-[10px] sm:text-xs text-gray-500">Terminal 1A</p>
                  </div>
                </div>
              </div>

              <div className="text-left sm:text-right">
                <p className="text-xs sm:text-sm">Duration 1h 20min</p>
                <p className="text-xs sm:text-sm text-brand-secondary flex items-center gap-1">
                  Operated by Kenya Airways
                  <Image src="/kq_logo_transparent.png" alt="KQ" width={16} height={16} />
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Passenger Details */}
        <div className="mb-6 sm:mb-8">
          <h2 className="text-xl sm:text-2xl font-semibold mb-4">Passenger Details</h2>
          
          {passengerDetails.map((passenger, idx) => (
            <div key={idx} className="bg-white border border-gray-200 rounded-lg p-4 sm:p-6 mb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3 sm:gap-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-xl sm:text-2xl">👤</span>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="w-4 h-4 sm:w-5 sm:h-5 bg-green-500 rounded-full flex items-center justify-center text-white text-xs">✓</span>
                      <h3 className="font-semibold text-sm sm:text-base">{passenger.firstName} {passenger.lastName}</h3>
                    </div>
                    <p className="text-xs sm:text-sm text-gray-600">{contactDetails?.email}</p>
                    <p className="text-xs sm:text-sm text-gray-600">{contactDetails?.phone}</p>
                    <p className="text-xs sm:text-sm text-gray-600">
                      {idx < passengers.adults ? "Adult" : idx < passengers.adults + passengers.children ? "Child" : "Infant"}
                    </p>
                  </div>
                </div>
                <button className="text-gray-400 flex-shrink-0">▼</button>
              </div>
            </div>
          ))}
        </div>

        {/* Extra Services */}
        <div className="mb-6 sm:mb-8">
          <h2 className="text-xl sm:text-2xl font-semibold mb-4">Extra services</h2>
          
          {/* Desktop: Grid layout */}
          <div className="hidden sm:grid sm:grid-cols-2 gap-4">
            {EXTRA_SERVICES.map(service => (
              <div key={service.id} className="bg-white border border-gray-200 rounded-lg p-4 sm:p-6 relative">
                <div className="flex gap-4 sm:gap-6">
                  <img src={service.image} alt={service.name} className="w-32 sm:w-48 h-32 object-cover rounded flex-shrink-0" />
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-semibold text-base sm:text-lg">{service.name}</h3>
                      {!service.included && (
                        <label className="flex items-center cursor-pointer ml-2">
                          <input
                            type="checkbox"
                            checked={selectedServices.has(service.id)}
                            onChange={() => toggleService(service.id)}
                            className="w-5 h-5 rounded border-gray-300 text-brand-primary focus:ring-brand-primary cursor-pointer"
                          />
                        </label>
                      )}
                    </div>
                    <p className="text-xs sm:text-sm text-gray-600 mb-3 line-clamp-3">{service.description}</p>
                    <p className="text-xs sm:text-sm font-medium mb-4">
                      {service.included ? "Included" : `From KES ${service.price.toLocaleString()}`}
                    </p>
                    {selectedServices.has(service.id) && !service.included && (
                      <p className="text-xs font-semibold text-green-600 mb-2">
                        Added: +KES {(service.price * totalPassengers).toLocaleString()}
                      </p>
                    )}
                    <button 
                      className={`border rounded px-4 sm:px-6 py-2 text-xs sm:text-sm font-medium transition-colors ${
                        selectedServices.has(service.id) 
                          ? 'border-brand-primary bg-brand-primary/5 text-brand-primary' 
                          : 'border-gray-300 hover:bg-gray-50'
                      }`}
                      onClick={() => !service.included && toggleService(service.id)}
                      disabled={service.included}
                    >
                      {service.buttonText}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Mobile: Horizontal carousel */}
          <div className="sm:hidden -mx-4 overflow-x-auto snap-x snap-mandatory hide-scrollbar">
            <div className="flex gap-4 px-4 pb-4">
              {EXTRA_SERVICES.map(service => (
                <div key={service.id} className="bg-white border border-gray-200 rounded-lg p-4 snap-center flex-shrink-0 w-[320px] relative">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="font-semibold text-base">{service.name}</h3>
                    {!service.included && (
                      <label className="flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={selectedServices.has(service.id)}
                          onChange={() => toggleService(service.id)}
                          className="w-5 h-5 rounded border-gray-300 text-brand-primary focus:ring-brand-primary cursor-pointer"
                        />
                      </label>
                    )}
                  </div>
                  <img src={service.image} alt={service.name} className="w-full h-40 object-cover rounded mb-3" />
                  <p className="text-xs text-gray-600 mb-3 line-clamp-2">{service.description}</p>
                  <p className="text-xs font-medium mb-3">
                    {service.included ? "Included" : `From KES ${service.price.toLocaleString()}`}
                  </p>
                  {selectedServices.has(service.id) && !service.included && (
                    <p className="text-xs font-semibold text-green-600 mb-2">
                      Added: +KES {(service.price * totalPassengers).toLocaleString()}
                    </p>
                  )}
                  <button 
                    className={`w-full border rounded px-4 py-2 text-xs font-medium transition-colors ${
                      selectedServices.has(service.id) 
                        ? 'border-brand-primary bg-brand-primary/5 text-brand-primary' 
                        : 'border-gray-300 hover:bg-gray-50'
                    }`}
                    onClick={() => !service.included && toggleService(service.id)}
                    disabled={service.included}
                  >
                    {service.buttonText}
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Pagination dots for mobile */}
          <div className="flex justify-center gap-2 mt-4 sm:hidden">
            {EXTRA_SERVICES.map((_, idx) => (
              <div key={idx} className={`w-2 h-2 rounded-full ${idx === 0 ? 'bg-brand-primary' : 'bg-gray-300'}`} />
            ))}
          </div>
        </div>

        {/* Hold Booking */}
        <div className="bg-white border border-gray-200 rounded-lg p-4 sm:p-6 mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3 flex-1">
              <input 
                type="checkbox" 
                checked={holdBooking}
                onChange={(e) => setHoldBooking(e.target.checked)}
                className="w-4 h-4 sm:w-5 sm:h-5 mt-1 rounded border-gray-300 text-brand-primary focus:ring-brand-primary cursor-pointer flex-shrink-0" 
              />
              <div>
                <h3 className="font-semibold text-sm sm:text-base mb-1">Need time to think?</h3>
                <p className="text-xs sm:text-sm text-gray-600">Hold my booking until Sunday, 14 June 23:43 GMT</p>
                <p className="text-xs sm:text-sm font-semibold">+KES 2,610</p>
              </div>
            </div>
            <div className="text-brand-primary flex-shrink-0">
              <svg className="w-10 h-10 sm:w-12 sm:h-12" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
        </div>

        {/* Total Price Section */}
        <div className="bg-white border border-gray-200 rounded-lg p-4 sm:p-6 mb-6 sm:mb-8">
          {/* Price Breakdown */}
          {(servicesTotal > 0 || holdBookingPrice > 0) && (
            <div className="mb-4 pb-4 border-b border-gray-200 text-sm">
              <div className="flex justify-between mb-2">
                <span className="text-gray-600">Flight total:</span>
                <span className="font-semibold">KES {flightTotal.toLocaleString()}</span>
              </div>
              {servicesTotal > 0 && (
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">Extra services:</span>
                  <span className="font-semibold text-green-600">+KES {servicesTotal.toLocaleString()}</span>
                </div>
              )}
              {holdBookingPrice > 0 && (
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">Hold booking:</span>
                  <span className="font-semibold text-green-600">+KES {holdBookingPrice.toLocaleString()}</span>
                </div>
              )}
            </div>
          )}
          
          <div className="text-center sm:text-right mb-4">
            <p className="text-base sm:text-lg mb-2">
              Total price: <span className="text-2xl sm:text-3xl font-bold">KES {totalPrice.toLocaleString()}</span>
            </p>
            <p className="text-xs sm:text-sm text-gray-600">
              Round trip price for all passengers (including taxes, fees and discounts). 
              <button className="text-brand-primary hover:underline ml-1 inline-flex items-center gap-1">
                See price details
                <ExternalLink className="w-3 h-3" />
              </button>
            </p>
          </div>

          <div className="flex flex-wrap gap-2 sm:gap-3 justify-center mb-6 text-xs sm:text-sm border-t pt-4">
            <button className="text-gray-600 hover:underline inline-flex items-center gap-1">
              Detailed baggage policy
              <ExternalLink className="w-3 h-3" />
            </button>
            <span className="text-gray-400 hidden sm:inline">|</span>
            <button className="text-gray-600 hover:underline inline-flex items-center gap-1">
              Fare conditions
              <ExternalLink className="w-3 h-3" />
            </button>
            <span className="text-gray-400 hidden sm:inline">|</span>
            <button className="text-gray-600 hover:underline inline-flex items-center gap-1">
              Dangerous goods policy
              <ExternalLink className="w-3 h-3" />
            </button>
          </div>

          <div className="flex justify-center">
            <button 
              onClick={handleCheckout}
              className="bg-brand-primary hover:bg-[#A00D25] text-white px-8 sm:px-12 py-2.5 sm:py-3 rounded font-semibold text-base sm:text-lg transition-colors w-full sm:w-auto"
            >
              Checkout
            </button>
          </div>
        </div>
      </div>

      {/* Promotional Footer */}
      <div className="bg-black -mx-4 sm:mx-0">
        <div className="bg-gray-200 py-8 sm:py-12 px-4 sm:px-8 text-center">
          <h2 className="text-2xl sm:text-4xl font-serif italic mb-4">
            Enrol now to enjoy<br/>
            <span className="text-3xl sm:text-5xl">10% discount on</span><br/>
            <span className="text-2xl sm:text-4xl">your flight</span>
          </h2>
          <button className="bg-brand-primary hover:bg-[#A00D25] text-white px-6 sm:px-8 py-2 sm:py-3 rounded font-bold mt-4 transition-colors text-sm sm:text-base">
            Enrol Now
          </button>
          <div className="flex justify-center gap-4 mt-6">
            <img src="/amex.png" alt="Cards" className="h-16 sm:h-24 object-contain" />
          </div>
        </div>

        <div className="bg-black py-4 sm:py-6">
          <div className="flex flex-wrap justify-center gap-4 sm:gap-8 text-white text-xs sm:text-sm px-4">
            <a href="#" className="hover:underline">Loyalty Program</a>
            <a href="#" className="hover:underline">Travel Requirements</a>
            <a href="#" className="hover:underline hidden sm:inline">Special Assistance</a>
            <a href="#" className="hover:underline hidden sm:inline">Name Update Policy</a>
            <a href="#" className="hover:underline">Contact Us</a>
          </div>
        </div>

        <div className="relative">
          <img 
            src="/where_we_fly.png" 
            alt="A Better Way to Holiday" 
            className="w-full h-32 sm:h-48 object-cover"
          />
          <div className="absolute inset-0 flex flex-col sm:flex-row items-center justify-between px-4 sm:px-12 py-4">
            <div className="text-white text-center sm:text-left mb-3 sm:mb-0">
              <p className="text-[10px] sm:text-sm mb-1 sm:mb-2">Featured Holidays - 06 of May</p>
              <h3 className="text-base sm:text-2xl font-bold">A Better Way to Holiday</h3>
            </div>
            <button className="bg-brand-primary hover:bg-[#A00D25] text-white px-4 sm:px-6 py-1.5 sm:py-2 rounded font-semibold transition-colors text-xs sm:text-base">
              BOOK NOW
            </button>
          </div>
          <p className="absolute bottom-2 left-4 sm:left-12 text-[9px] sm:text-xs text-white">*Terms & Conditions Apply*</p>
        </div>

        <div className="bg-black py-4 sm:py-6 flex flex-wrap justify-center gap-3 sm:gap-4 px-4">
          <img src="/visa.png" alt="Visa" className="h-6 sm:h-8 object-contain bg-white px-2 sm:px-3 py-1 rounded" />
          <img src="/mastercard.png" alt="Mastercard" className="h-6 sm:h-8 object-contain bg-white px-2 sm:px-3 py-1 rounded" />
          <img src="/amex.png" alt="Amex" className="h-6 sm:h-8 object-contain bg-white px-2 sm:px-3 py-1 rounded" />
          <img src="/paypal.png" alt="PayPal" className="h-6 sm:h-8 object-contain bg-white px-2 sm:px-3 py-1 rounded" />
        </div>
      </div>
    </div>
  )
}
