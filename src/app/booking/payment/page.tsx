"use client"

import { useEffect, useState } from "react"
import { useBookingStore } from "@/store/booking-store"
import { useRouter } from "next/navigation"

export default function PaymentPage() {
  const router = useRouter()
  const { 
    setCurrentStep,
    origin,
    destination,
    departureDate,
    returnDate,
    passengers,
    selectedOutboundFlight,
    selectedReturnFlight,
    selectedFare,
    extras
  } = useBookingStore()

  useEffect(() => {
    setCurrentStep(6)
  }, [setCurrentStep])

  const [paymentMethod, setPaymentMethod] = useState<"card" | "paypal" | "mobile" | null>(null)
  const [showPromoCode, setShowPromoCode] = useState(false)
  const [termsAccepted, setTermsAccepted] = useState(false)
  
  // Card form fields
  const [cardNumber, setCardNumber] = useState("")
  const [expiryMonth, setExpiryMonth] = useState("")
  const [expiryYear, setExpiryYear] = useState("")
  const [cvv, setCvv] = useState("")
  const [cardholderName, setCardholderName] = useState("")
  const [streetAddress, setStreetAddress] = useState("")
  const [apartment, setApartment] = useState("")
  const [postcode, setPostcode] = useState("")
  const [city, setCity] = useState("")
  const [country, setCountry] = useState("")

  const handlePayment = () => {
    if (!termsAccepted) {
      alert("Please accept the terms and conditions")
      return
    }
    
    // Redirect to mobile payment gateway for mobile payments
    if (paymentMethod === "mobile") {
      router.push("/booking/payment/mobile")
      return
    }
    
    // For card and PayPal, go to confirmation
    router.push("/booking/confirmation")
  }

  const totalPassengers = passengers.adults + passengers.children + passengers.infants
  
  // Use the total price from the store if available, otherwise calculate it
  const totalPrice = extras.totalPrice || (() => {
    const basePrice = selectedOutboundFlight?.price || 11250
    const returnPrice = selectedReturnFlight?.price || 10000
    
    let fareMultiplier = 1
    if (selectedFare === "Economy") fareMultiplier = 1.2
    if (selectedFare === "Business Lite" || selectedFare === "Business") fareMultiplier = 2.5
    
    const outboundTotal = basePrice * fareMultiplier
    const returnTotal = returnPrice * fareMultiplier
    return Math.round((outboundTotal + returnTotal) * totalPassengers)
  })()

  const formatDate = (dateStr: string | undefined) => {
    if (!dateStr) return ""
    const date = new Date(dateStr)
    return date.toLocaleDateString("en-US", { 
      weekday: "short", 
      day: "numeric",
      month: "short"
    })
  }

  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      {/* Trip Summary Header */}
      <div className="bg-gray-100 border-b border-gray-300 py-3 px-3 sm:px-6 -mx-4 sm:mx-0">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0">
            <div className="flex items-center gap-2 sm:gap-4 overflow-x-auto w-full sm:w-auto">
              <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
                <div className="text-center">
                  <div className="font-bold text-base sm:text-lg">{origin}</div>
                  <div className="text-[10px] sm:text-xs text-gray-600">{origin === "NBO" ? "Nairobi" : origin}</div>
                </div>
                <div className="flex flex-col items-center px-1 sm:px-2">
                  <div className="text-gray-400 text-xs hidden sm:block">.....................</div>
                  <div className="text-gray-400 text-sm sm:text-base">✈</div>
                </div>
                <div className="text-center">
                  <div className="font-bold text-base sm:text-lg">{destination}</div>
                  <div className="text-[10px] sm:text-xs text-gray-600">{destination === "DAR" ? "Dar Es Salaam" : destination}</div>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-3 sm:gap-6 text-xs sm:text-sm">
              <div>
                <span className="font-medium">{formatDate(departureDate)}</span>
              </div>
              <div>
                <span className="font-medium">{formatDate(returnDate)}</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="font-medium">Passenger</span>
                <span className="font-medium">{totalPassengers}</span>
                <span>👤</span>
              </div>
              <button className="flex items-center gap-1">
                <span>🛒</span>
                <span className="font-medium text-xs sm:text-sm">KES {totalPrice.toLocaleString()}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Checkout Title */}
        <h1 className="text-2xl sm:text-3xl font-serif italic mb-6 sm:mb-8">Checkout</h1>

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

        {/* Total Price */}
        <div className="bg-white border border-gray-200 rounded-lg p-4 sm:p-6 mb-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-3">
            <div>
              <p className="text-base sm:text-lg font-semibold">Total price: <span className="text-xl sm:text-2xl font-bold">KES {totalPrice.toLocaleString()}</span></p>
              <p className="text-xs sm:text-sm text-gray-600">Round trip price for all passengers.</p>
            </div>
            <button className="text-gray-400">▼</button>
          </div>
          
          <div className="flex flex-wrap gap-2 sm:gap-3 text-xs sm:text-sm border-t pt-4">
            <button className="text-gray-600 hover:underline inline-flex items-center gap-1">
              Detailed baggage policy
              <span className="text-xs">🔗</span>
            </button>
            <span className="text-gray-400 hidden sm:inline">|</span>
            <button className="text-gray-600 hover:underline inline-flex items-center gap-1">
              Fare conditions
              <span className="text-xs">🔗</span>
            </button>
            <span className="text-gray-400 hidden sm:inline">|</span>
            <button className="text-gray-600 hover:underline inline-flex items-center gap-1">
              Dangerous goods policy
              <span className="text-xs">🔗</span>
            </button>
          </div>
        </div>

        {/* Promo Code */}
        <div className="text-center mb-6 sm:mb-8">
          <button 
            onClick={() => setShowPromoCode(!showPromoCode)}
            className="text-xs sm:text-sm hover:underline flex items-center gap-2 mx-auto"
          >
            <span className="text-base sm:text-lg">⚙️</span>
            <span>Do you want to add promo codes ?</span>
          </button>
          {showPromoCode && (
            <div className="mt-4 flex flex-col sm:flex-row gap-2 max-w-md mx-auto px-4 sm:px-0">
              <input 
                type="text" 
                placeholder="Enter promo code"
                className="flex-1 border border-gray-300 rounded px-3 py-2 text-sm"
              />
              <button className="bg-gray-200 hover:bg-gray-300 px-6 py-2 rounded text-sm font-medium">
                Apply
              </button>
            </div>
          )}
        </div>

        {/* Payment Methods */}
        <div className="mb-6 sm:mb-8">
          <h2 className="text-xl sm:text-2xl font-semibold mb-4 sm:mb-6 text-center">Select your payment method</h2>
          
          <div className="space-y-4">
            {/* Credit Card */}
            <div className="bg-white border-2 border-gray-200 rounded-lg overflow-hidden">
              <div 
                className={`p-4 sm:p-6 cursor-pointer ${paymentMethod === "card" ? "bg-gray-50" : ""}`}
                onClick={() => setPaymentMethod(paymentMethod === "card" ? null : "card")}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 sm:gap-4">
                    <span className="text-xl sm:text-2xl">💳</span>
                    <div>
                      <h3 className="font-semibold text-base sm:text-lg">Credit Card</h3>
                      <div className="flex gap-1 sm:gap-2 mt-2">
                        <img src="/visa.png" alt="Visa" className="h-5 sm:h-6" />
                        <img src="/mastercard.png" alt="Mastercard" className="h-5 sm:h-6" />
                        <img src="/amex.png" alt="Amex" className="h-5 sm:h-6" />
                        <span className="text-xs sm:text-sm text-gray-500 flex items-center">+4 more</span>
                      </div>
                    </div>
                  </div>
                  <button className="text-gray-400">
                    {paymentMethod === "card" ? "▲" : "▼"}
                  </button>
                </div>
              </div>
              
              {paymentMethod === "card" && (
                <div className="px-4 sm:px-6 pb-4 sm:pb-6 border-t border-gray-200 pt-4 sm:pt-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                    {/* Card Image */}
                    <div className="bg-gradient-to-br from-indigo-400 to-indigo-600 rounded-lg p-4 sm:p-6 text-white h-40 sm:h-48 flex flex-col justify-between">
                      <div className="text-lg sm:text-2xl tracking-widest">XXXX XXXX XXXX XXXX</div>
                      <div className="flex justify-between text-xs sm:text-sm">
                        <div>
                          <div className="text-[10px] sm:text-xs opacity-75">Cardholder name</div>
                          <div>XXX</div>
                        </div>
                        <div>
                          <div className="text-[10px] sm:text-xs opacity-75">Expiration date</div>
                          <div>XXX</div>
                        </div>
                      </div>
                    </div>

                    {/* Card Form */}
                    <div className="space-y-3 sm:space-y-4">
                      <input
                        type="text"
                        placeholder="Card number*"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        className="w-full border border-gray-300 rounded px-3 py-2 text-sm placeholder-gray-400"
                      />
                      <div className="grid grid-cols-3 gap-2">
                        <select
                          value={expiryMonth}
                          onChange={(e) => setExpiryMonth(e.target.value)}
                          className="border border-gray-300 rounded px-2 py-2 text-sm"
                        >
                          <option value="">Month</option>
                          {Array.from({length: 12}, (_, i) => i + 1).map(m => (
                            <option key={m} value={m}>{m}</option>
                          ))}
                        </select>
                        <select
                          value={expiryYear}
                          onChange={(e) => setExpiryYear(e.target.value)}
                          className="border border-gray-300 rounded px-2 py-2 text-sm"
                        >
                          <option value="">Year</option>
                          {Array.from({length: 10}, (_, i) => 2026 + i).map(y => (
                            <option key={y} value={y}>{y}</option>
                          ))}
                        </select>
                        <input
                          type="text"
                          placeholder="CVV"
                          value={cvv}
                          onChange={(e) => setCvv(e.target.value.slice(0, 4))}
                          className="border border-gray-300 rounded px-2 sm:px-3 py-2 text-sm placeholder-gray-400"
                        />
                      </div>
                      <input
                        type="text"
                        placeholder="Cardholder's full name*"
                        value={cardholderName}
                        onChange={(e) => setCardholderName(e.target.value)}
                        className="w-full border border-gray-300 rounded px-3 py-2 text-sm placeholder-gray-400"
                      />
                    </div>
                  </div>

                  {/* Billing Address */}
                  <div className="mt-4 sm:mt-6">
                    <h4 className="font-semibold mb-3 sm:mb-4 text-sm sm:text-base">Billing Address</h4>
                    <div className="space-y-3">
                      <input
                        type="text"
                        placeholder="Street name and Number or Residential Area*"
                        value={streetAddress}
                        onChange={(e) => setStreetAddress(e.target.value)}
                        className="w-full border border-gray-300 rounded px-3 py-2 text-sm placeholder-gray-400"
                      />
                      <input
                        type="text"
                        placeholder="Apartment, building, floor, etc."
                        value={apartment}
                        onChange={(e) => setApartment(e.target.value)}
                        className="w-full border border-gray-300 rounded px-3 py-2 text-sm placeholder-gray-400"
                      />
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <input
                          type="text"
                          placeholder="Postcode / Zip*"
                          value={postcode}
                          onChange={(e) => setPostcode(e.target.value)}
                          className="w-full border border-gray-300 rounded px-3 py-2 text-sm placeholder-gray-400"
                        />
                        <input
                          type="text"
                          placeholder="City*"
                          value={city}
                          onChange={(e) => setCity(e.target.value)}
                          className="w-full border border-gray-300 rounded px-3 py-2 text-sm placeholder-gray-400"
                        />
                      </div>
                      <input
                        type="text"
                        placeholder="Country*"
                        value={country}
                        onChange={(e) => setCountry(e.target.value)}
                        className="w-full border border-gray-300 rounded px-3 py-2 text-sm placeholder-gray-400"
                      />
                    </div>
                  </div>

                  {/* Terms */}
                  <div className="mt-4 sm:mt-6">
                    <label className="flex items-start gap-3">
                      <input
                        type="checkbox"
                        checked={termsAccepted}
                        onChange={(e) => setTermsAccepted(e.target.checked)}
                        className="w-4 h-4 mt-1 border-gray-300 rounded flex-shrink-0"
                      />
                      <span className="text-xs sm:text-sm text-gray-700">
                        I understand and accept the <a href="#" className="underline">terms and conditions of carriage</a>, the <a href="#" className="underline">terms and conditions of seat selection</a>, the <a href="#" className="underline">privacy policy</a>, <a href="#" className="underline">KRA conditions</a> and the fare rules of Kenya Airways.*
                      </span>
                    </label>
                  </div>

                  {/* Pay Button */}
                  <button
                    onClick={handlePayment}
                    className="w-full bg-brand-primary hover:bg-[#A00D25] text-white py-3 rounded font-semibold mt-4 sm:mt-6 transition-colors text-sm sm:text-base"
                  >
                    Pay KES {totalPrice.toLocaleString()}
                  </button>
                </div>
              )}
            </div>

            {/* PayPal */}
            <div className="bg-white border-2 border-gray-200 rounded-lg overflow-hidden">
              <div 
                className={`p-4 sm:p-6 cursor-pointer ${paymentMethod === "paypal" ? "bg-gray-50" : ""}`}
                onClick={() => setPaymentMethod(paymentMethod === "paypal" ? null : "paypal")}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 sm:gap-4">
                    <img src="/paypal.png" alt="PayPal" className="h-6 sm:h-8" />
                    <h3 className="font-semibold text-base sm:text-lg">PayPal</h3>
                  </div>
                  <button className="text-gray-400">
                    {paymentMethod === "paypal" ? "▲" : "▼"}
                  </button>
                </div>
              </div>
              
              {paymentMethod === "paypal" && (
                <div className="px-4 sm:px-6 pb-4 sm:pb-6 border-t border-gray-200 pt-4 sm:pt-6">
                  <p className="text-center text-gray-700 mb-6 text-sm sm:text-base">
                    You will be redirected to PayPal portal to securely complete the payment.
                  </p>

                  {/* Terms */}
                  <div className="mb-6">
                    <label className="flex items-start gap-3">
                      <input
                        type="checkbox"
                        checked={termsAccepted}
                        onChange={(e) => setTermsAccepted(e.target.checked)}
                        className="w-4 h-4 mt-1 border-gray-300 rounded flex-shrink-0"
                      />
                      <span className="text-xs sm:text-sm text-gray-700">
                        I understand and accept the <a href="#" className="underline">terms and conditions of carriage</a>, the <a href="#" className="underline">terms and conditions of seat selection</a>, the <a href="#" className="underline">privacy policy</a>, <a href="#" className="underline">KRA conditions</a> and the fare rules of Kenya Airways.*
                      </span>
                    </label>
                  </div>

                  {/* Pay Button */}
                  <button
                    onClick={handlePayment}
                    className="w-full bg-brand-primary hover:bg-[#A00D25] text-white py-3 rounded font-semibold transition-colors text-sm sm:text-base"
                  >
                    Pay KES {totalPrice.toLocaleString()}
                  </button>
                </div>
              )}
            </div>

            {/* Mobile Payments */}
            <div className="bg-white border-2 border-gray-200 rounded-lg overflow-hidden">
              <div 
                className={`p-4 sm:p-6 cursor-pointer ${paymentMethod === "mobile" ? "bg-gray-50" : ""}`}
                onClick={() => setPaymentMethod(paymentMethod === "mobile" ? null : "mobile")}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 sm:gap-4 flex-wrap">
                    <div className="flex gap-2">
                      <div className="flex items-center gap-1 text-[10px] sm:text-xs border border-gray-300 px-2 py-1 rounded">
                        <span>📱</span>
                        <span className="hidden sm:inline">Mobile Banking</span>
                        <span className="sm:hidden">MB</span>
                      </div>
                      <div className="flex items-center gap-1 text-[10px] sm:text-xs border border-gray-300 px-2 py-1 rounded">
                        <span>💳</span>
                        <span className="hidden sm:inline">Mobile Wallet</span>
                        <span className="sm:hidden">MW</span>
                      </div>
                    </div>
                    <h3 className="font-semibold text-base sm:text-lg">Mobile Payments</h3>
                  </div>
                  <button className="text-gray-400 flex-shrink-0">
                    {paymentMethod === "mobile" ? "▲" : "▼"}
                  </button>
                </div>
              </div>
              
              {paymentMethod === "mobile" && (
                <div className="px-4 sm:px-6 pb-4 sm:pb-6 border-t border-gray-200 pt-4 sm:pt-6">
                  <p className="text-xs sm:text-sm text-gray-700 mb-4">
                    Select your preferred payment method on the next page. Available options include mobile money, mobile banking, and bank transfer (e.g., M&apos;Pesa, Airtel Money, Tigo, ABSA, Equity, DTB, etc.)
                  </p>

                  <div className="bg-yellow-50 border border-yellow-200 rounded p-3 mb-6">
                    <p className="text-xs sm:text-sm text-gray-700">
                      <strong>Notice:</strong> Please avoid refreshing the payment page during processing until you receive your ticket confirmation
                    </p>
                  </div>

                  {/* Terms */}
                  <div className="mb-6">
                    <label className="flex items-start gap-3">
                      <input
                        type="checkbox"
                        checked={termsAccepted}
                        onChange={(e) => setTermsAccepted(e.target.checked)}
                        className="w-4 h-4 mt-1 border-gray-300 rounded flex-shrink-0"
                      />
                      <span className="text-xs sm:text-sm text-gray-700">
                        I understand and accept the <a href="#" className="underline">terms and conditions of carriage</a>, the <a href="#" className="underline">terms and conditions of seat selection</a>, the <a href="#" className="underline">privacy policy</a>, KRA conditions and the fare rules of Kenya Airways.*
                      </span>
                    </label>
                  </div>

                  {/* Pay Button */}
                  <button
                    onClick={handlePayment}
                    className="w-full bg-brand-primary hover:bg-[#A00D25] text-white py-3 rounded font-semibold transition-colors text-sm sm:text-base"
                  >
                    Pay KES {totalPrice.toLocaleString()}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Total Price Summary */}
        <div className="bg-white border border-gray-200 rounded-lg p-4 sm:p-6 mb-6 sm:mb-8">
          <div className="text-center mb-4">
            <p className="text-base sm:text-lg font-semibold mb-2">
              Total price: <span className="text-2xl sm:text-3xl font-bold">KES {totalPrice.toLocaleString()}</span>
            </p>
            <p className="text-xs sm:text-sm text-gray-600">Round trip price for all passengers.</p>
          </div>
        </div>
      </div>

      {/* Promotional Footer */}
      <div className="bg-black mt-8 sm:mt-12 -mx-4 sm:mx-0">
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
