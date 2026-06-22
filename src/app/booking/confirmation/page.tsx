"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { CheckCircle, Download, Mail, Printer, Calendar, MapPin, Clock, Users, CreditCard } from "lucide-react"
import { useBookingStore } from "@/store/booking-store"
import Link from "next/link"

export default function BookingConfirmation() {
  const router = useRouter()
  const store = useBookingStore()
  const [bookingReference, setBookingReference] = useState("")
  const [showSuccess, setShowSuccess] = useState(false)

  useEffect(() => {
    // Generate booking reference
    const ref = `KQ${Math.random().toString(36).substring(2, 9).toUpperCase()}`
    setBookingReference(ref)
    
    // Show success animation
    setTimeout(() => setShowSuccess(true), 300)
  }, [])

  const totalPassengers = store.passengers.adults + store.passengers.children + store.passengers.infants
  const baseFare = (store.selectedOutboundFlight?.price || 0) + (store.selectedReturnFlight?.price || 0)
  const totalPrice = store.extras.totalPrice || baseFare

  // Suppress unused variable warning - totalPassengers kept for future use
  void totalPassengers

  const formatDate = (dateStr: string | undefined) => {
    if (!dateStr) return "Not specified"
    const date = new Date(dateStr)
    return date.toLocaleDateString('en-GB', { 
      weekday: 'short', 
      day: 'numeric', 
      month: 'short', 
      year: 'numeric' 
    })
  }

  const handlePrint = () => {
    window.print()
  }

  const handleDownload = () => {
    // In a real app, this would generate a PDF
    alert("PDF download would be triggered here")
  }

  const handleEmailReceipt = () => {
    // In a real app, this would send an email
    alert(`Receipt would be sent to: ${store.contactDetails?.email}`)
  }

  const handleNewBooking = () => {
    store.resetAll()
    router.push("/")
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Success Banner */}
      <div className={`bg-gradient-to-r from-green-600 to-green-500 text-white transition-all duration-700 ${showSuccess ? 'py-16' : 'py-0 h-0 overflow-hidden'}`}>
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="flex justify-center mb-4">
            <CheckCircle className="w-20 h-20 animate-bounce" />
          </div>
          <h1 className="text-4xl font-bold mb-2">Booking Confirmed!</h1>
          <p className="text-xl text-green-50">Your flight has been successfully booked</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Booking Reference Card */}
        <div className="bg-white rounded-lg shadow-lg border-2 border-green-500 p-8 mb-6 text-center">
          <p className="text-gray-600 text-sm font-medium mb-2">Booking Reference</p>
          <p className="text-4xl font-bold text-[#ed1c24] tracking-wider mb-4">{bookingReference}</p>
          <p className="text-sm text-gray-600">Please save this reference number for your records</p>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          <button
            onClick={handlePrint}
            className="flex flex-col items-center gap-2 p-4 bg-white rounded-lg shadow hover:shadow-md transition-shadow border border-gray-200"
          >
            <Printer className="w-6 h-6 text-gray-600" />
            <span className="text-xs font-medium text-gray-700">Print</span>
          </button>
          <button
            onClick={handleDownload}
            className="flex flex-col items-center gap-2 p-4 bg-white rounded-lg shadow hover:shadow-md transition-shadow border border-gray-200"
          >
            <Download className="w-6 h-6 text-gray-600" />
            <span className="text-xs font-medium text-gray-700">Download</span>
          </button>
          <button
            onClick={handleEmailReceipt}
            className="flex flex-col items-center gap-2 p-4 bg-white rounded-lg shadow hover:shadow-md transition-shadow border border-gray-200"
          >
            <Mail className="w-6 h-6 text-gray-600" />
            <span className="text-xs font-medium text-gray-700">Email</span>
          </button>
          <button
            onClick={() => alert("Add to calendar functionality would be implemented here")}
            className="flex flex-col items-center gap-2 p-4 bg-white rounded-lg shadow hover:shadow-md transition-shadow border border-gray-200"
          >
            <Calendar className="w-6 h-6 text-gray-600" />
            <span className="text-xs font-medium text-gray-700">Calendar</span>
          </button>
        </div>

        {/* Flight Details */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-bold text-[#0d0d0d] mb-6 flex items-center gap-2">
            <MapPin className="w-5 h-5 text-[#ed1c24]" />
            Flight Details
          </h2>

          {/* Outbound Flight */}
          {store.selectedOutboundFlight && (
            <div className="mb-6 pb-6 border-b border-gray-200">
              <div className="flex items-center gap-2 mb-3">
                <div className="bg-[#ed1c24] text-white text-xs font-bold px-2 py-1 rounded">
                  OUTBOUND
                </div>
                <span className="text-sm text-gray-600">{formatDate(store.departureDate)}</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <p className="text-xs text-gray-500 mb-1">From</p>
                  <p className="font-semibold text-lg">{store.origin || "Nairobi"}</p>
                </div>
                <div className="flex items-center justify-center">
                  <div className="w-full h-0.5 bg-gray-300 relative">
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 bg-gray-400 rounded-full"></div>
                  </div>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">To</p>
                  <p className="font-semibold text-lg">{store.destination || "Dubai"}</p>
                </div>
              </div>
              <div className="mt-4 flex items-center gap-4 text-sm text-gray-600">
                <span className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  Flight: {store.selectedOutboundFlight.id}
                </span>
                <span>Class: {store.selectedOutboundFlight.class}</span>
              </div>
            </div>
          )}

          {/* Return Flight */}
          {store.selectedReturnFlight && store.tripType === "round-trip" && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded">
                  RETURN
                </div>
                <span className="text-sm text-gray-600">{formatDate(store.returnDate)}</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <p className="text-xs text-gray-500 mb-1">From</p>
                  <p className="font-semibold text-lg">{store.destination || "Dubai"}</p>
                </div>
                <div className="flex items-center justify-center">
                  <div className="w-full h-0.5 bg-gray-300 relative">
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 bg-gray-400 rounded-full"></div>
                  </div>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">To</p>
                  <p className="font-semibold text-lg">{store.origin || "Nairobi"}</p>
                </div>
              </div>
              <div className="mt-4 flex items-center gap-4 text-sm text-gray-600">
                <span className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  Flight: {store.selectedReturnFlight.id}
                </span>
                <span>Class: {store.selectedReturnFlight.class}</span>
              </div>
            </div>
          )}
        </div>

        {/* Passenger Information */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-bold text-[#0d0d0d] mb-4 flex items-center gap-2">
            <Users className="w-5 h-5 text-[#ed1c24]" />
            Passenger Information
          </h2>
          <div className="space-y-3">
            {store.passengerDetails.map((passenger, index) => (
              <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded">
                <div className="w-8 h-8 rounded-full bg-[#ed1c24] text-white flex items-center justify-center font-bold text-sm">
                  {index + 1}
                </div>
                <div>
                  <p className="font-semibold text-[#0d0d0d]">
                    {passenger.title} {passenger.firstName} {passenger.lastName}
                  </p>
                  <p className="text-xs text-gray-600">Passport: {passenger.passportNumber || "Not provided"}</p>
                </div>
              </div>
            ))}
            {store.passengerDetails.length === 0 && (
              <p className="text-gray-500 text-sm">No passenger details available</p>
            )}
          </div>
        </div>

        {/* Contact & Payment */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
          {/* Contact Details */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="font-bold text-[#0d0d0d] mb-3 flex items-center gap-2">
              <Mail className="w-4 h-4 text-[#ed1c24]" />
              Contact Details
            </h3>
            <div className="space-y-2 text-sm">
              <p className="text-gray-600">
                <span className="font-medium">Email:</span><br />
                {store.contactDetails?.email || "Not provided"}
              </p>
              <p className="text-gray-600">
                <span className="font-medium">Phone:</span><br />
                {store.contactDetails?.phone || "Not provided"}
              </p>
            </div>
          </div>

          {/* Payment Summary */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="font-bold text-[#0d0d0d] mb-3 flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-[#ed1c24]" />
              Payment Summary
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Base Fare:</span>
                <span className="font-medium">KES {baseFare.toLocaleString()}</span>
              </div>
              {(store.extras.selectedServices?.length || 0) > 0 && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Extra Services:</span>
                  <span className="font-medium">KES {((totalPrice - baseFare)).toLocaleString()}</span>
                </div>
              )}
              <div className="pt-2 border-t border-gray-200 flex justify-between font-bold text-base">
                <span>Total Paid:</span>
                <span className="text-[#ed1c24]">KES {totalPrice.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Important Information */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
          <h3 className="font-bold text-[#0d0d0d] mb-3">Important Information</h3>
          <ul className="space-y-2 text-sm text-gray-700">
            <li className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
              <span>Check-in opens 24 hours before departure</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
              <span>Please arrive at the airport at least 3 hours before international flights</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
              <span>Ensure all passengers have valid travel documents</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
              <span>Confirmation email has been sent to {store.contactDetails?.email}</span>
            </li>
          </ul>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Link
            href="/book-manage/manage-booking"
            className="flex-1 bg-[#0d0d0d] text-white py-4 px-6 rounded-md font-semibold text-center hover:bg-[#2d2d2d] transition-colors"
          >
            Manage My Booking
          </Link>
          <button
            onClick={handleNewBooking}
            className="flex-1 bg-white border-2 border-[#ed1c24] text-[#ed1c24] py-4 px-6 rounded-md font-semibold hover:bg-[#ed1c24] hover:text-white transition-colors"
          >
            Book Another Flight
          </button>
        </div>

        {/* Footer Note */}
        <div className="mt-8 text-center text-sm text-gray-500">
          <p>Thank you for choosing Kenya Airways - The Pride of Africa</p>
          <p className="mt-2">Need help? Contact us at <a href="tel:+254711024747" className="text-[#ed1c24] hover:underline">+254 711 024 747</a></p>
        </div>
      </div>
    </div>
  )
}
