"use client"

import { useEffect, useState } from "react"
import { useBookingStore } from "@/store/booking-store"
import { calculateBookingTotal } from "@/store/booking-store"
import { useRouter } from "next/navigation"
import { PassengerDetail } from "@/store/booking-store"
import { Input } from "@/components/ui/input"

export default function PassengersPage() {
  const router = useRouter()
  const { 
    setCurrentStep, 
    passengers, 
    contactDetails, 
    setContactDetails, 
    setPassengerDetails, 
    origin, 
    destination, 
    departureDate, 
    returnDate,
    selectedFare,
    selectedOutboundFlight,
    selectedReturnFlight,
    setBookingReference,
    selectedSeat,
    extras,
  } = useBookingStore()

  useEffect(() => {
    setCurrentStep(4)
  }, [setCurrentStep])

  const [email, setEmail] = useState(contactDetails?.email || "")
  const [phone, setPhone] = useState(contactDetails?.phone || "")
  const [countryCode, setCountryCode] = useState("+254")
  const [frequentFlyerProgram, setFrequentFlyerProgram] = useState("")
  const [frequentFlyerNumber, setFrequentFlyerNumber] = useState("")
  const [emergencyContact, setEmergencyContact] = useState("")
  const [newsletter, setNewsletter] = useState(false)
  const [privacyAccepted, setPrivacyAccepted] = useState(false)
  const [submitError, setSubmitError] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const totalPassengers = passengers.adults + passengers.children + passengers.infants
  
  const [paxDetails, setPaxDetails] = useState<PassengerDetail[]>(Array(totalPassengers).fill({
    title: "",
    firstName: "",
    lastName: "",
    dateOfBirth: "",
    gender: "M",
    nationality: "",
    passportNumber: "",
    passportExpiry: "",
    frequentFlyer: ""
  }))

  const updatePaxDetail = (index: number, field: string, value: string) => {
    const updated = [...paxDetails]
    updated[index] = { ...updated[index], [field]: value }
    setPaxDetails(updated)
  }

  const handleContinue = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitError("")
    
    if (!privacyAccepted) {
      setSubmitError("Please accept the privacy policy to continue.")
      return
    }
    
    setIsSubmitting(true)
    
    try {
      // Save contact details and passenger details to store
      setContactDetails({ email, phone: countryCode + phone })
      setPassengerDetails(paxDetails)
      
      // Use the single source-of-truth price calculator so passengers + extras + seat
      // all flow into one total. (Previously each page recalculated and produced
      // different numbers — see /home/bruno/.kimchi/docs/booking-audit.md.)
      const totals = calculateBookingTotal({
        selectedOutboundFlight,
        selectedReturnFlight,
        selectedFare,
        passengers,
        selectedSeat,
        extras,
      })
      const { flightTotal, extrasTotal, grandTotal } = totals
      const taxes = Math.round(flightTotal * 0.15)
      const totalAmount = grandTotal + taxes
      
      // Create primary passenger name for the booking
      const primaryPassengerName = paxDetails.length > 0 
        ? `${paxDetails[0].title} ${paxDetails[0].firstName} ${paxDetails[0].lastName}`
        : email
      
      // Call booking API — payload now includes extras so a single payment covers
      // baggage + insurance + seat + meals + holdBooking.
      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          passengerName: primaryPassengerName,
          email,
          phone: countryCode + phone,
          origin,
          destination,
          departureDate,
          returnDate,
          cabinClass: selectedFare || "Economy",
          tripType: returnDate ? "return" : "oneway",
          passengers: paxDetails.map(p => ({
            title: p.title,
            firstName: p.firstName,
            lastName: p.lastName,
            dateOfBirth: p.dateOfBirth,
            gender: p.gender,
            nationality: p.nationality,
            passportNumber: p.passportNumber,
            passportExpiry: p.passportExpiry,
            specialMeal: paxDetails.indexOf(p) !== undefined ? extras.meals?.[paxDetails.indexOf(p)] : undefined,
            specialAssistance: extras.specialRequests ?? [],
          })),
          baseFare: flightTotal,
          taxes,
          totalAmount,
          flightTotal,
          extrasTotal,
          extras: {
            extraBaggage: extras.extraBaggage,
            travelInsurance: extras.travelInsurance,
            seat: selectedSeat,
            meals: extras.meals,
            specialRequests: extras.specialRequests,
            selectedServices: extras.selectedServices,
            holdBooking: extras.holdBooking,
          },
          currency: "KES",
          paymentStatus: "pending",
          bookingStatus: "confirmed"
        })
      })
      
      const result = await response.json()
      
      if (result.success && result.bookingReference) {
        // Store booking reference in Zustand
        setBookingReference(result.bookingReference)
        
        // If newsletter subscription is checked, call newsletter API
        if (newsletter) {
          try {
            await fetch("/api/newsletter", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ email, source: "website" })
            })
          } catch (err) {
            console.error("Newsletter subscription failed:", err)
          }
        }
        
        router.push("/booking/review")
      } else {
        setSubmitError(result.error || "Failed to create booking. Please try again.")
      }
    } catch (err) {
      console.error("Booking error:", err)
      setSubmitError("An error occurred. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const formatDate = (dateStr: string | undefined) => {
    if (!dateStr) return ""
    const date = new Date(dateStr)
    return date.toLocaleDateString("en-US", { 
      weekday: "short", 
      day: "numeric",
      month: "short"
    })
  }

  const passengerLabels: string[] = []
  for (let i = 0; i < passengers.adults; i++) passengerLabels.push(`Adult ${i + 1}`)
  for (let i = 0; i < passengers.children; i++) passengerLabels.push(`Child ${i + 1}`)
  for (let i = 0; i < passengers.infants; i++) passengerLabels.push(`Infant ${i + 1}`)

  return (
    <div className="min-h-screen bg-white w-full overflow-x-hidden">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Trip Summary Header */}
      <div className="bg-gray-100 border-b border-gray-300 py-3 px-3 sm:px-6 mb-6 sm:mb-8 -mx-4 sm:mx-0">
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
            <button className="text-gray-700 hover:underline flex items-center gap-1">
              <span>🛒</span>
              <span className="underline">Your booking</span>
            </button>
          </div>
        </div>
      </div>

      <h1 className="text-2xl sm:text-3xl font-serif italic mb-6 sm:mb-8">Enter your information</h1>

      <form onSubmit={handleContinue} className="space-y-6">
        {/* Passenger Information */}
        {passengerLabels.map((label, idx) => (
          <div key={idx} className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
            <h2 className="text-lg sm:text-xl font-semibold mb-4">Passenger information</h2>
            <p className="text-xs sm:text-sm text-gray-600 mb-6">
              * = mandatory fields<br/>
              Please fill in your personal information as shown in your passport.<br/>
              Select passenger type based on age at the time of travel.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
              <div className="sm:col-span-1">
                <label className="text-sm mb-2 block">Title*</label>
                <select 
                  required 
                  value={paxDetails[idx].title}
                  onChange={(e) => updatePaxDetail(idx, 'title', e.target.value)}
                  className="w-full h-11 px-3 border border-gray-300 rounded bg-white text-sm"
                >
                  <option value="">Select</option>
                  <option value="Mr">Mr</option>
                  <option value="Mrs">Mrs</option>
                  <option value="Ms">Ms</option>
                  <option value="Dr">Dr</option>
                </select>
              </div>
              <div>
                <label className="text-sm mb-2 block">First Name / Given Names*</label>
                <Input 
                  required 
                  value={paxDetails[idx].firstName}
                  onChange={(e) => updatePaxDetail(idx, 'firstName', e.target.value)}
                  className="h-11 text-sm" 
                />
              </div>
              <div>
                <label className="text-sm mb-2 block">Last Name / Surname*</label>
                <Input 
                  required 
                  value={paxDetails[idx].lastName}
                  onChange={(e) => updatePaxDetail(idx, 'lastName', e.target.value)}
                  className="h-11 text-sm" 
                />
              </div>
            </div>

            <div className="mb-4">
              <label className="text-sm mb-2 block">Gender*</label>
              <div className="flex gap-6">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input 
                    type="radio" 
                    name={`gender-${idx}`}
                    value="M"
                    checked={paxDetails[idx].gender === "M"}
                    onChange={(e) => updatePaxDetail(idx, 'gender', e.target.value)}
                    className="w-4 h-4"
                  />
                  <span className="text-sm">Male</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input 
                    type="radio" 
                    name={`gender-${idx}`}
                    value="F"
                    checked={paxDetails[idx].gender === "F"}
                    onChange={(e) => updatePaxDetail(idx, 'gender', e.target.value)}
                    className="w-4 h-4"
                  />
                  <span className="text-sm">Female</span>
                </label>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-sm mb-2 block">Date of birth</label>
                <Input 
                  type="date" 
                  value={paxDetails[idx].dateOfBirth}
                  onChange={(e) => updatePaxDetail(idx, 'dateOfBirth', e.target.value)}
                  className="h-11 text-sm" 
                />
              </div>
              <div>
                <label className="text-sm mb-2 block">Nationality</label>
                <select 
                  value={paxDetails[idx].nationality}
                  onChange={(e) => updatePaxDetail(idx, 'nationality', e.target.value)}
                  className="w-full h-11 px-3 border border-gray-300 rounded bg-white"
                >
                  <option value="">Select</option>
                  <option value="KE">Kenya</option>
                  <option value="US">United States</option>
                  <option value="UK">United Kingdom</option>
                  <option value="UG">Uganda</option>
                  <option value="TZ">Tanzania</option>
                </select>
              </div>
            </div>
          </div>
        ))}

        {/* Frequent Flyer Cards */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Frequent flyer cards</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm mb-2 block">Frequent flyer program</label>
              <select 
                value={frequentFlyerProgram}
                onChange={(e) => setFrequentFlyerProgram(e.target.value)}
                className="w-full h-11 px-3 border border-gray-300 rounded bg-white"
              >
                <option value="">Select program</option>
                <option value="asante">Asante Rewards</option>
                <option value="skyteam">SkyTeam</option>
              </select>
            </div>
            <div>
              <label className="text-sm mb-2 block">Frequent flyer number</label>
              <Input 
                value={frequentFlyerNumber}
                onChange={(e) => setFrequentFlyerNumber(e.target.value)}
                className="h-11" 
                placeholder="Enter number"
              />
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
          <h2 className="text-lg sm:text-xl font-semibold mb-2">Contact information</h2>
          <p className="text-xs sm:text-sm text-gray-600 mb-6">
            Please provide the contact details of the traveler to enable us send timely updates and notifications, in case of disruptions.
          </p>

          <div className="mb-4">
            <label className="text-sm mb-2 block">Email*</label>
            <Input 
              required 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-11 w-full text-sm" 
              placeholder="Email address"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="text-sm mb-2 block">Country calling code*</label>
              <select 
                required
                value={countryCode}
                onChange={(e) => setCountryCode(e.target.value)}
                className="w-full h-11 px-3 border border-gray-300 rounded bg-white text-sm"
              >
                <option value="+254">+254 (Kenya)</option>
                <option value="+1">+1 (USA)</option>
                <option value="+44">+44 (UK)</option>
                <option value="+256">+256 (Uganda)</option>
                <option value="+255">+255 (Tanzania)</option>
              </select>
            </div>
            <div>
              <label className="text-sm mb-2 block">Phone number*</label>
              <Input 
                required 
                type="tel" 
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="h-11 text-sm" 
                placeholder="712345678"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 mb-4">
            <input 
              type="checkbox"
              id="emergency-contact"
              checked={!!emergencyContact}
              onChange={(e) => setEmergencyContact(e.target.checked ? "enabled" : "")}
              className="w-4 h-4 rounded border-gray-300"
            />
            <label htmlFor="emergency-contact" className="text-sm text-gray-700">
              Add your emergency contact
            </label>
          </div>
        </div>

        {/* Newsletter & Privacy */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <input 
                type="checkbox"
                id="newsletter"
                checked={newsletter}
                onChange={(e) => setNewsletter(e.target.checked)}
                className="w-4 h-4 mt-1 rounded border-gray-300"
              />
              <label htmlFor="newsletter" className="text-sm text-gray-700">
                I would like to receive the Newsletter and special offers via e-mail by using the address entered in the contact information.
              </label>
            </div>

            <div className="flex items-start gap-3">
              <input 
                type="checkbox"
                id="privacy"
                required
                checked={privacyAccepted}
                onChange={(e) => setPrivacyAccepted(e.target.checked)}
                className="w-4 h-4 mt-1 rounded border-gray-300"
              />
              <label htmlFor="privacy" className="text-sm text-gray-700">
                I understand and accept that my personal data will be processed in accordance with the applicable carrier&apos;s privacy policy.
              </label>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {submitError && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
            {submitError}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex justify-end gap-4 mb-8">
          <button 
            type="button"
            onClick={() => router.back()}
            className="px-6 py-3 border border-gray-300 rounded text-gray-700 font-medium hover:bg-gray-50 transition-colors"
          >
            Back
          </button>
          <button 
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-3 bg-brand-primary hover:bg-[#A00D25] text-white rounded font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Creating Booking..." : "Confirm"}
          </button>
        </div>
      </form>

      {/* Promotional Footer */}
      <div className="mt-8 sm:mt-12 bg-black -mx-4 sm:mx-0">
        {/* Enrol Banner */}
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

        {/* Footer Links */}
        <div className="bg-black py-4 sm:py-6">
          <div className="flex flex-wrap justify-center gap-4 sm:gap-8 text-white text-xs sm:text-sm px-4">
            <a href="#" className="hover:underline">Loyalty Program</a>
            <a href="#" className="hover:underline">Travel Requirements</a>
            <a href="#" className="hover:underline hidden sm:inline">Special Assistance</a>
            <a href="#" className="hover:underline hidden sm:inline">Name Update Policy</a>
            <a href="#" className="hover:underline">Contact Us</a>
          </div>
        </div>

        {/* Holiday Banner */}
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

        {/* Payment Methods */}
        <div className="bg-black py-4 sm:py-6 flex flex-wrap justify-center gap-3 sm:gap-4 px-4">
          <img src="/visa.png" alt="Visa" className="h-6 sm:h-8 object-contain bg-white px-2 sm:px-3 py-1 rounded" />
          <img src="/mastercard.png" alt="Mastercard" className="h-6 sm:h-8 object-contain bg-white px-2 sm:px-3 py-1 rounded" />
          <img src="/amex.png" alt="Amex" className="h-6 sm:h-8 object-contain bg-white px-2 sm:px-3 py-1 rounded" />
          <img src="/paypal.png" alt="PayPal" className="h-6 sm:h-8 object-contain bg-white px-2 sm:px-3 py-1 rounded" />
        </div>
      </div>
    </div>
    </div>
  )
}
