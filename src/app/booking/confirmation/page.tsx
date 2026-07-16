"use client"

import { useEffect, useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { CheckCircle, Download, Mail, Printer, Calendar, Copy, Check, ArrowRight, Shield, Clock, CreditCard } from "lucide-react"
import { useBookingStore, calculateBookingTotal } from "@/store/booking-store"
import BoardingPass from "@/components/boarding-pass/boarding-pass"
import Link from "next/link"

const airportCities: Record<string, string> = {
  NBO: "Nairobi", MBA: "Mombasa", KIS: "Kisumu", EDL: "Eldoret",
  DAR: "Dar es Salaam", EBB: "Entebbe", ADD: "Addis Ababa",
  LHR: "London", CDG: "Paris", AMS: "Amsterdam", DXB: "Dubai",
  BOM: "Mumbai", MRU: "Mauritius", JNB: "Johannesburg",
  KGL: "Kigali", LOS: "Lagos", ACC: "Accra", LGW: "London",
}

export default function BookingConfirmation() {
  const router = useRouter()
  const store = useBookingStore()
  const [showSuccess, setShowSuccess] = useState(false)
  const [copied, setCopied] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [verifyingPayment, setVerifyingPayment] = useState(false)
  const ticketRef = useRef<HTMLDivElement>(null)

  const realReference = store.bookingReference
  const [fallbackReference, setFallbackReference] = useState("")
  const bookingReference = realReference || fallbackReference

  // Payment status from store - only "paid" shows the ticket
  const isPaymentConfirmed = store.paymentStatus === "paid"
  const transactionRef = store.transactionReference

  useEffect(() => {
    setMounted(true)
    if (!realReference) {
      setFallbackReference(`KQ${Math.random().toString(36).substring(2, 9).toUpperCase()}`)
    }
    setTimeout(() => setShowSuccess(true), 300)
  }, [realReference])

  // Verify payment status with Paynecta if we have a transaction reference
  useEffect(() => {
    if (!transactionRef || isPaymentConfirmed) {
      setVerifyingPayment(false)
      return
    }

    const verifyPayment = async () => {
      try {
        const response = await fetch(`/api/payment/paynecta/status?transactionReference=${encodeURIComponent(transactionRef)}`)
        const result = await response.json()

        if (result.success && result.status === "completed") {
          store.setPaymentStatus("paid")
          setVerifyingPayment(false)
        } else if (result.status === "failed" || result.status === "cancelled") {
          store.setPaymentStatus("failed")
          setVerifyingPayment(false)
        }
        // Continue verifying for pending/processing status
      } catch (err) {
        console.error("Payment verification error:", err)
      }
    }

    // Initial verification
    verifyPayment()

    // Poll every 5 seconds until confirmed or failed
    const interval = setInterval(verifyPayment, 5000)

    // Stop after 5 minutes
    const timeout = setTimeout(() => {
      clearInterval(interval)
      setVerifyingPayment(false)
    }, 5 * 60 * 1000)

    return () => {
      clearInterval(interval)
      clearTimeout(timeout)
    }
  }, [transactionRef, isPaymentConfirmed, store])

  // Prevent hydration mismatch by showing nothing until mounted
  if (!mounted) return <div className="min-h-screen bg-gray-50" />

  const totals = calculateBookingTotal({
    selectedOutboundFlight: store.selectedOutboundFlight,
    selectedReturnFlight: store.selectedReturnFlight,
    selectedFare: store.selectedFare,
    passengers: store.passengers,
    selectedSeat: store.selectedSeat,
    extras: store.extras,
  })
  const totalPrice = store.extras.totalPrice || totals.grandTotal

  const handleCopyRef = async () => {
    await navigator.clipboard.writeText(bookingReference)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handlePrint = () => {
    const printContent = document.getElementById("boarding-pass")
    if (!printContent) return window.print()
    const win = window.open("", "_blank")
    if (!win) return window.print()
    win.document.write(`<!DOCTYPE html><html><head><title>Boarding Pass - ${bookingReference}</title>
      <style>
        @page { size: landscape; margin: 10mm; }
        body { font-family: 'Segoe UI', system-ui, sans-serif; margin: 0; display: flex; justify-content: center; align-items: center; min-height: 100vh; background: white; }
        @media print { body { print-color-adjust: exact; -webkit-print-color-adjust: exact; } }
      </style></head><body>${printContent.outerHTML}</body></html>`)
    win.document.close()
    setTimeout(() => { win.print(); win.close() }, 500)
  }

  const handleDownload = () => {
    const ticketEl = document.getElementById("boarding-pass")
    if (!ticketEl) return

    const html = `<!DOCTYPE html>
<html><head><meta charset="utf-8"><title>Kenya Airways Boarding Pass - ${bookingReference}</title>
<style>
  @page { size: landscape; margin: 10mm; }
  body { font-family: 'Segoe UI', system-ui, sans-serif; margin: 20px; display: flex; justify-content: center; background: white; }
  @media print { body { margin: 0; print-color-adjust: exact; -webkit-print-color-adjust: exact; } }
  * { box-sizing: border-box; }
</style></head><body>${ticketEl.outerHTML}</body></html>`

    const blob = new Blob([html], { type: "text/html" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `boarding-pass-${bookingReference}.html`
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleEmailReceipt = () => {
    alert(`Boarding pass would be emailed to: ${store.contactDetails?.email}`)
  }

  const handleAddToCalendar = () => {
    const departDate = store.departureDate || new Date().toISOString().split("T")[0]
    const flightId = store.selectedOutboundFlight?.id || "KQ000"
    const origin = store.origin || "NBO"
    const destination = store.destination || "MBA"

    const ics = `BEGIN:VCALENDAR
VERSION:2.0
BEGIN:VEVENT
DTSTART:${departDate.replace(/-/g, "")}T000000Z
DTEND:${departDate.replace(/-/g, "")}T235959Z
SUMMARY:Flight ${flightId} ${origin} → ${destination}
DESCRIPTION:Booking Reference: ${bookingReference}\nPassenger: ${store.passengerDetails[0]?.firstName || ""} ${store.passengerDetails[0]?.lastName || ""}\nSeat: ${store.selectedSeat?.id || "TBD"}
LOCATION:${origin} Airport
END:VEVENT
END:VCALENDAR`

    const blob = new Blob([ics], { type: "text/calendar" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `flight-${bookingReference}.ics`
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleNewBooking = () => {
    store.resetAll()
    router.push("/")
  }

  const electronicTicket = `706${bookingReference.replace(/\D/g, "").padEnd(12, "0").slice(0, 12)}`

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Success Banner */}
      <div className={`bg-gradient-to-r ${isPaymentConfirmed ? 'from-green-600 to-green-500' : 'from-yellow-600 to-yellow-500'} text-white transition-all duration-700 ${showSuccess ? 'py-12' : 'py-0 h-0 overflow-hidden'}`}>
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="flex justify-center mb-3">
            <CheckCircle className="w-16 h-16 animate-bounce" />
          </div>
          <h1 className="text-3xl font-bold mb-1">{isPaymentConfirmed ? 'Booking Confirmed!' : 'Booking Pending Payment'}</h1>
          <p className="text-lg text-green-50">{isPaymentConfirmed ? 'Your flight has been successfully booked and paid' : 'Complete M-Pesa payment to receive your boarding pass'}</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Booking Reference + Actions Row */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            {/* Reference */}
            <div className="text-center sm:text-left">
              <p className="text-gray-500 text-xs uppercase tracking-wider mb-1">Booking Reference</p>
              <div className="flex items-center gap-2">
                <p className="text-3xl font-bold text-[#c8102e] tracking-wider">{bookingReference}</p>
                <button onClick={handleCopyRef} className="p-1.5 rounded-md hover:bg-gray-100 transition-colors" title="Copy">
                  {copied ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4 text-gray-400" />}
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-2">
              <button onClick={handlePrint} className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 sm:py-2.5 bg-[#c8102e] text-white rounded-lg hover:bg-[#a50d24] transition-colors text-xs sm:text-sm font-medium">
                <Printer className="w-4 h-4" />
                Print
              </button>
              <button onClick={handleDownload} className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 sm:py-2.5 bg-[#0d0d0d] text-white rounded-lg hover:bg-[#2d2d2d] transition-colors text-xs sm:text-sm font-medium">
                <Download className="w-4 h-4" />
                Download
              </button>
              <button onClick={handleEmailReceipt} className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 sm:py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-xs sm:text-sm font-medium">
                <Mail className="w-4 h-4" />
                Email
              </button>
              <button onClick={handleAddToCalendar} className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 sm:py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-xs sm:text-sm font-medium">
                <Calendar className="w-4 h-4" />
                Calendar
              </button>
            </div>
          </div>
        </div>

        {/* BOARDING PASS - Only shown when payment is confirmed */}
        {isPaymentConfirmed ? (
          <div className="mb-6" id="boarding-pass-wrapper">
            <div ref={ticketRef} id="boarding-pass">
              <BoardingPass
                passengerName={store.passengerDetails[0] ? `${store.passengerDetails[0].firstName} ${store.passengerDetails[0].lastName}` : "GUEST TRAVELLER"}
                title={store.passengerDetails[0]?.title || "MR"}
                flightNumber={store.selectedOutboundFlight?.id || "KQ000"}
                date={store.departureDate || new Date().toISOString()}
                origin={store.origin || "NBO"}
                originCity={airportCities[store.origin || "NBO"] || store.origin || "NAIROBI"}
                originAirport="Jomo Kenyatta Intl"
                destination={store.destination || "MBA"}
                destinationCity={airportCities[store.destination || "MBA"] || store.destination || "MOMBASA"}
                destinationAirport="Moi International"
                departureTime="09:20"
                arrivalTime="10:10"
                boardingTime="08:50"
                gateClosingTime="0850"
                gate="---"
                terminal="S"
                seat={store.selectedSeat?.id || "4J"}
                classType={store.selectedFare || "Economy"}
                classCode={store.selectedFare?.includes("Business") ? "C" : "N"}
                bookingReference={bookingReference}
                electronicTicket={electronicTicket}
                sequenceNumber="21"
                zone="A"
                skyPriority={store.selectedFare?.includes("Business") || store.selectedFare?.includes("Flex") ? true : false}
              />
            </div>
          </div>
        ) : (
          /* Payment Pending - No Ticket Shown */
          <div className="mb-6 bg-yellow-50 border border-yellow-200 rounded-xl p-6 text-center">
            <div className="flex justify-center mb-3">
              <Clock className="w-12 h-12 text-yellow-600 animate-pulse" />
            </div>
            <h2 className="text-xl font-bold text-yellow-800 mb-2">Payment Pending</h2>
            <p className="text-yellow-700 mb-4">
              Your boarding pass will be available once payment is confirmed via M-Pesa.
            </p>
            {verifyingPayment && (
              <div className="flex items-center justify-center gap-2 text-sm text-yellow-600">
                <div className="w-4 h-4 border-2 border-yellow-600 border-t-transparent rounded-full animate-spin"></div>
                <span>Verifying payment status...</span>
              </div>
            )}
            <p className="text-xs text-yellow-500 mt-4">
              Please complete the M-Pesa payment on your phone. Your ticket will appear here automatically.
            </p>
            <button
              onClick={() => router.push("/booking/payment/mobile")}
              className="mt-4 px-6 py-2 bg-[#c8102e] text-white rounded-lg hover:bg-[#a50d24] transition-colors text-sm font-medium"
            >
              Go to Payment
            </button>
          </div>
        )}

        {/* Info Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-6">
          <div className="bg-white rounded-xl shadow-sm p-4 sm:p-5 border border-gray-100">
            <div className="flex items-center gap-3 mb-2 sm:mb-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-green-100 rounded-full flex items-center justify-center">
                <Shield className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
              </div>
              <h3 className="font-semibold text-gray-900 text-xs sm:text-sm">Booking Confirmed</h3>
            </div>
            <p className="text-[10px] sm:text-xs text-gray-500">Your booking reference is <span className="font-bold text-gray-700">{bookingReference}</span>. Save it for check-in.</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-4 sm:p-5 border border-gray-100">
            <div className="flex items-center gap-3 mb-2 sm:mb-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900 text-xs sm:text-sm">Check-in Opens</h3>
            </div>
            <p className="text-[10px] sm:text-xs text-gray-500">Online check-in opens <span className="font-bold text-gray-700">24 hours</span> before departure.</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-4 sm:p-5 border border-gray-100">
            <div className="flex items-center gap-3 mb-2 sm:mb-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-purple-100 rounded-full flex items-center justify-center">
                <CreditCard className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600" />
              </div>
              <h3 className="font-semibold text-gray-900 text-xs sm:text-sm">Payment Received</h3>
            </div>
            <p className="text-[10px] sm:text-xs text-gray-500">Total paid: <span className="font-bold text-[#c8102e]">KES {totalPrice.toLocaleString()}</span></p>
          </div>
        </div>

        {/* What's Next */}
        <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6 mb-6 border border-gray-100">
          <h3 className="font-bold text-gray-900 mb-3 sm:mb-4 text-sm sm:text-base">What happens next?</h3>
          <div className="space-y-3 sm:space-y-4">
            {[
              { step: "1", title: "Check your email", desc: "A confirmation email with your booking details has been sent." },
              { step: "2", title: "Online check-in", desc: "Check in online 24 hours before your flight to select your seat." },
              { step: "3", title: "Arrive at airport", desc: "Arrive at least 2 hours before domestic, 3 hours before international flights." },
              { step: "4", title: "Board your flight", desc: "Present your boarding pass and valid ID at the gate." },
            ].map((item) => (
              <div key={item.step} className="flex items-start gap-2 sm:gap-3">
                <div className="w-6 h-6 sm:w-7 sm:h-7 bg-[#c8102e] text-white rounded-full flex items-center justify-center text-[10px] sm:text-xs font-bold flex-shrink-0">
                  {item.step}
                </div>
                <div>
                  <p className="font-semibold text-xs sm:text-sm text-gray-900">{item.title}</p>
                  <p className="text-[10px] sm:text-xs text-gray-500">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Link href="/book-manage/manage-booking" className="flex-1 bg-[#0d0d0d] text-white py-3 px-6 rounded-lg font-semibold text-center hover:bg-[#2d2d2d] transition-colors text-sm">
            Manage My Booking
          </Link>
          <button onClick={handleNewBooking} className="flex-1 bg-white border-2 border-[#c8102e] text-[#c8102e] py-3 px-6 rounded-lg font-semibold hover:bg-[#c8102e] hover:text-white transition-colors text-sm">
            Book Another Flight
          </button>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-xs text-gray-400">
          <p>Thank you for choosing Kenya Airways - The Pride of Africa</p>
          <p className="mt-1">Need help? Contact us at <a href="tel:+254711024747" className="text-[#c8102e] hover:underline">+254 711 024 747</a></p>
        </div>
      </div>
    </div>
  )
}
