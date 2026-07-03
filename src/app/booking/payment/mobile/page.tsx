"use client"

import { useEffect, useState, useRef } from "react"
import { useBookingStore } from "@/store/booking-store"
import { calculateBookingTotal } from "@/store/booking-store"
import { useRouter } from "next/navigation"
import Image from "next/image"

export default function MobilePaymentPage() {
  const router = useRouter()
  const {
    setCurrentStep,
    selectedOutboundFlight,
    selectedReturnFlight,
    selectedFare,
    passengers,
    bookingReference,
    selectedSeat,
    extras,
  } = useBookingStore()

  useEffect(() => {
    setCurrentStep(6)
    if (!selectedOutboundFlight) {
      router.replace("/search")
    }
  }, [setCurrentStep, selectedOutboundFlight, router])

  const [paymentOption, setPaymentOption] = useState<"mobile" | "bank">("mobile")
  const [mobileNumber, setMobileNumber] = useState("")
  const [countdown, setCountdown] = useState(7 * 60 + 36)
  const [isProcessing, setIsProcessing] = useState(false)
  const [paymentStatus, setPaymentStatus] = useState<"idle" | "processing" | "success" | "failed">("idle")
  const [statusMessage, setStatusMessage] = useState("")
  const [mpesaReceipt, setMpesaReceipt] = useState("")
  const [transactionReference, setTransactionReference] = useState<string | null>(null)
  const [phoneError, setPhoneError] = useState("")
  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const pollAttemptsRef = useRef(0)

  // Single source of truth — the same calculator used by /booking/passengers and /booking/review.
  // The amount the user pays here equals the total they saw in review.
  const totals = calculateBookingTotal({
    selectedOutboundFlight,
    selectedReturnFlight,
    selectedFare,
    passengers,
    selectedSeat,
    extras,
  })
  const { flightTotal, extrasTotal, grandTotal: totalPrice } = totals

  // Format phone to 254XXXXXXXXX
  const formatPhoneNumber = (input: string): string => {
    const cleaned = input.replace(/[\s\-\+]/g, "")
    if (cleaned.startsWith("0")) {
      return "254" + cleaned.slice(1)
    }
    if (cleaned.startsWith("7") || cleaned.startsWith("1")) {
      return "254" + cleaned
    }
    return cleaned
  }

  // Validate phone format: 254[17]\d{8}
  const validatePhone = (phone: string): boolean => {
    return /^254[17]\d{8}$/.test(phone)
  }

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value
    setMobileNumber(input)
    setPhoneError("")

    const formatted = formatPhoneNumber(input)
    if (formatted.length >= 10 && !validatePhone(formatted)) {
      setPhoneError("Phone must start with 7 or 1 and be 9 digits after 254")
    }
  }

  const stopPolling = () => {
    if (pollingIntervalRef.current) {
      clearInterval(pollingIntervalRef.current)
      pollingIntervalRef.current = null
    }
  }

  const pollPaymentStatus = async (ref: string) => {
    try {
      const response = await fetch(`/api/payment/paynecta/status?transactionReference=${encodeURIComponent(ref)}`)
      const result = await response.json()

      if (result.success) {
        if (result.status === "completed") {
          stopPolling()
          setPaymentStatus("success")
          setStatusMessage("Payment successful!")
          setMpesaReceipt(result.mpesaReceiptNumber || "")
          
          // Update booking with M-Pesa receipt and paid status
          if (bookingReference && result.mpesaReceiptNumber) {
            try {
              await fetch(`/api/bookings/${bookingReference}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  paymentStatus: "paid",
                  mpesaReceipt: result.mpesaReceiptNumber
                })
              })
            } catch (err) {
              console.error("Failed to update booking with payment success:", err)
            }
          }
        } else if (result.status === "failed" || result.status === "cancelled") {
          stopPolling()
          setPaymentStatus("failed")
          setStatusMessage(`Payment ${result.status}. Please try again.`)
          
          // Update booking with failed status
          if (bookingReference) {
            try {
              await fetch(`/api/bookings/${bookingReference}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  paymentStatus: "failed"
                })
              })
            } catch (err) {
              console.error("Failed to update booking with payment failure:", err)
            }
          }
        }
        // For "pending" or "processing", continue polling
      }
    } catch (err) {
      console.error("Status poll error:", err)
    }

    pollAttemptsRef.current++
    if (pollAttemptsRef.current >= 30) {
      stopPolling()
      setPaymentStatus("failed")
      setStatusMessage("Payment timeout. Please check your phone and try again.")
    }
  }

  const handlePaynectaPayment = async () => {
    const formattedPhone = formatPhoneNumber(mobileNumber)

    if (!validatePhone(formattedPhone)) {
      setPhoneError("Please enter a valid phone number (e.g., 0712345678 or 012345678)")
      return
    }

    setIsProcessing(true)
    setPaymentStatus("processing")
    setStatusMessage("Initializing payment...")
    setPhoneError("")

    try {
      const response = await fetch("/api/payment/paynecta", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phoneNumber: formattedPhone,
          amount: totalPrice,
        }),
      })

      const result = await response.json()

      if (result.success) {
        setTransactionReference(result.transactionReference)
        setStatusMessage("Payment prompt sent! Please check your phone and enter M-Pesa PIN")
        
        // Update booking with payment reference and pending status
        if (bookingReference && result.transactionReference) {
          try {
            await fetch(`/api/bookings/${bookingReference}`, {
              method: "PATCH",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                paymentStatus: "processing",
                paymentReference: result.transactionReference
              })
            })
          } catch (err) {
            console.error("Failed to update booking payment status:", err)
          }
        }
        
        pollAttemptsRef.current = 0

        pollingIntervalRef.current = setInterval(() => {
          pollPaymentStatus(result.transactionReference)
        }, 3000)
      } else {
        setPaymentStatus("failed")
        setStatusMessage(result.error || "Payment initialization failed")
      }
    } catch (err) {
      console.error("Payment processing error:", err)
      setPaymentStatus("failed")
      setStatusMessage("Payment failed. Please try again.")
    } finally {
      setIsProcessing(false)
    }
  }

  // Navigate when payment is successful
  useEffect(() => {
    if (paymentStatus === "success") {
      const timer = setTimeout(() => {
        router.push("/booking/confirmation")
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [paymentStatus, router])

  // Cleanup polling on unmount
  useEffect(() => {
    return () => stopPolling()
  }, [])

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 0) {
          clearInterval(timer)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}m : ${secs.toString().padStart(2, '0')}s`
  }

  const isSubmitDisabled = isProcessing || !mobileNumber || !!phoneError

  return (
    <div className="min-h-screen bg-gray-50 overflow-x-hidden">
      {/* Warning Banner */}
      <div className="bg-red-50 border-b border-red-200 py-3 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto flex items-center gap-2 sm:gap-3">
          <span className="text-red-600 font-bold text-lg sm:text-xl flex-shrink-0">⛔</span>
          <p className="text-xs sm:text-sm">
            DO NOT <span className="font-bold">reload</span> or <span className="font-bold">exit</span> the payment page until you receive a ticket confirmation.
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          {/* Left Sidebar - Payment Options */}
          <div className="lg:col-span-1">
            <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">Pay With</h2>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <button
                onClick={() => setPaymentOption("mobile")}
                className={`w-full p-3 sm:p-4 text-left flex items-center gap-2 sm:gap-3 border-l-4 ${
                  paymentOption === "mobile"
                    ? "border-brand-primary bg-gray-50"
                    : "border-transparent hover:bg-gray-50"
                }`}
              >
                <input
                  type="radio"
                  checked={paymentOption === "mobile"}
                  onChange={() => setPaymentOption("mobile")}
                  className="w-4 h-4"
                />
                <span className="font-medium text-sm sm:text-base">Mobile Money</span>
              </button>

              <button
                onClick={() => setPaymentOption("bank")}
                className={`w-full p-3 sm:p-4 text-left flex items-center gap-2 sm:gap-3 border-l-4 border-t ${
                  paymentOption === "bank"
                    ? "border-brand-primary bg-gray-50"
                    : "border-transparent hover:bg-gray-50"
                }`}
              >
                <input
                  type="radio"
                  checked={paymentOption === "bank"}
                  onChange={() => setPaymentOption("bank")}
                  className="w-4 h-4"
                />
                <span className="font-medium text-sm sm:text-base">Bank Transfer</span>
              </button>
            </div>
          </div>

          {/* Center - Payment Form */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
              {/* Kenya Airways Logo */}
              <div className="flex justify-center mb-4 sm:mb-6">
                <Image src="/kq_logo.png" alt="Kenya Airways" width={120} height={40} className="h-8 sm:h-10 w-auto" />
              </div>

              {paymentOption === "mobile" && (
                <div>
                  {/* M-Pesa Logo */}
                  <div className="flex justify-center mb-4 sm:mb-6">
                    <div className="bg-green-600 text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded font-bold text-base sm:text-lg">
                      M-PESA
                    </div>
                  </div>

                  <h3 className="text-center font-semibold text-base sm:text-lg mb-4 sm:mb-6">Pay via M-Pesa Kenya</h3>

                  <form className="space-y-3 sm:space-y-4">
                    <div>
                      <label className="block text-xs sm:text-sm text-gray-600 mb-2">Mobile number</label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600 text-sm">+254</span>
                        <input
                          type="tel"
                          value={mobileNumber}
                          onChange={handlePhoneChange}
                          placeholder="7XX XXX XXX"
                          className={`w-full border rounded px-3 py-2 sm:py-3 pl-12 sm:pl-14 focus:ring-1 outline-none text-sm ${
                            phoneError ? "border-red-500 focus:border-red-500 focus:ring-red-500" : "border-gray-300 focus:border-brand-primary focus:ring-brand-primary"
                          }`}
                        />
                      </div>
                      {phoneError ? (
                        <p className="text-xs text-red-500 mt-1">{phoneError}</p>
                      ) : (
                        <p className="text-xs text-gray-500 mt-1">Enter phone number (7XX or 1XX format)</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs sm:text-sm text-gray-600 mb-2">Amount</label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600 text-sm">KES</span>
                        <input
                          type="text"
                          value={totalPrice.toLocaleString()}
                          readOnly
                          className="w-full border border-gray-300 rounded px-3 py-2 sm:py-3 pl-12 sm:pl-14 bg-gray-50 text-gray-700 text-sm"
                        />
                      </div>
                    </div>

                    <div className="text-xs text-gray-600 mt-4">
                      By proceeding, you agree to <a href="#" className="underline">Tingg terms and conditions</a>
                    </div>

                    <button
                      type="button"
                      onClick={handlePaynectaPayment}
                      disabled={isSubmitDisabled}
                      className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-300 text-white py-2.5 sm:py-3 rounded font-medium mt-4 sm:mt-6 transition-colors text-sm sm:text-base"
                    >
                      {isProcessing ? "Processing..." : "Pay with M-Pesa"}
                    </button>

                    {paymentStatus === "processing" && (
                      <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded text-xs sm:text-sm">
                        <p className="font-semibold text-yellow-800">⏳ Payment in progress</p>
                        <p className="text-yellow-700 mt-1">{statusMessage}</p>
                        {transactionReference && (
                          <p className="text-yellow-600 mt-1 text-[10px]">Ref: {transactionReference}</p>
                        )}
                      </div>
                    )}

                    {paymentStatus === "success" && (
                      <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded text-xs sm:text-sm">
                        <p className="font-semibold text-green-800">✓ Payment successful!</p>
                        {mpesaReceipt && (
                          <p className="text-green-700 mt-1">Receipt: {mpesaReceipt}</p>
                        )}
                        <p className="text-green-600 mt-1">Redirecting to confirmation...</p>
                      </div>
                    )}

                    {paymentStatus === "failed" && (
                      <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded text-xs sm:text-sm">
                        <p className="font-semibold text-red-800">Payment failed</p>
                        <p className="text-red-700 mt-1">{statusMessage}</p>
                      </div>
                    )}
                  </form>
                </div>
              )}

              {paymentOption === "bank" && (
                <div className="text-center py-6 sm:py-8">
                  <p className="text-gray-600 text-sm sm:text-base">Bank transfer option coming soon...</p>
                </div>
              )}
            </div>
          </div>

          {/* Right Sidebar - Transaction Details */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
              {/* Language Selector */}
              <div className="mb-4 sm:mb-6">
                <select className="w-full border border-gray-300 rounded px-3 py-2 text-xs sm:text-sm">
                  <option>🌐 English</option>
                  <option>Swahili</option>
                </select>
              </div>

              {/* Transaction Details */}
              <div className="mb-4 sm:mb-6">
                <h3 className="font-semibold mb-3 sm:mb-4 text-sm sm:text-base">Transaction</h3>
                <div className="space-y-2 sm:space-y-3 text-xs sm:text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Flights</span>
                    <span className="font-medium">KES {flightTotal.toLocaleString()}</span>
                  </div>
                  {extrasTotal > 0 && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Extras (baggage, seat, insurance, hold)</span>
                      <span className="font-medium">KES {extrasTotal.toLocaleString()}</span>
                    </div>
                  )}
                  <div className="flex justify-between border-t pt-2">
                    <span className="text-gray-600">Total Payable</span>
                    <span className="font-bold">KES {totalPrice.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Timer */}
              <div className="mb-4 sm:mb-6">
                <p className="text-xs sm:text-sm text-gray-600 mb-2">Please make your payment in</p>
                <div className="text-2xl sm:text-3xl font-bold text-brand-primary text-center">
                  {formatTime(countdown)}
                </div>
                <div className="mt-3 sm:mt-4 border-t pt-3 sm:pt-4 space-y-2 text-xs sm:text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">KES 1.00</span>
                    <span className="text-gray-600">KES 1.00</span>
                  </div>
                  <div className="flex justify-between font-semibold">
                    <span>Original</span>
                    <span>KES {totalPrice.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Converted</span>
                    <span className="text-gray-600">KES {totalPrice.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="border-t pt-3 sm:pt-4">
                <h4 className="font-semibold text-xs sm:text-sm mb-2">Description</h4>
                <p className="text-xs text-gray-600">Flight booking payment</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-white border-t mt-8 sm:mt-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 sm:py-6">
          <div className="flex flex-wrap justify-center gap-3 sm:gap-6 lg:gap-8 text-xs sm:text-sm mb-4 sm:mb-6">
            <a href="#" className="text-gray-600 hover:underline">Loyalty Program</a>
            <a href="#" className="text-gray-600 hover:underline">Travel Requirements</a>
            <a href="#" className="text-gray-600 hover:underline">Special Assistance</a>
            <a href="#" className="text-gray-600 hover:underline hidden sm:inline">Name Update Policy</a>
            <a href="#" className="text-gray-600 hover:underline">Contact Us</a>
          </div>

          <div className="text-center mb-4 sm:mb-6">
            <p className="text-[10px] sm:text-xs text-gray-500 mb-2 sm:mb-3">POWERED BY</p>
            <div className="flex justify-center items-center gap-2 sm:gap-3">
              <span className="text-green-600 font-bold text-lg sm:text-xl">tingg</span>
              <span className="text-gray-400 text-xs sm:text-sm">by</span>
              <span className="text-blue-600 font-bold text-sm sm:text-base">MFS AFRICA</span>
            </div>
          </div>

          <div className="flex flex-wrap justify-center gap-3 sm:gap-4 lg:gap-6 items-center">
            <img src="/visa.png" alt="Visa" className="h-6 sm:h-8 object-contain" />
            <img src="/mastercard.png" alt="Mastercard" className="h-6 sm:h-8 object-contain" />
            <img src="/amex.png" alt="Amex" className="h-6 sm:h-8 object-contain" />
            <div className="bg-green-600 text-white px-2 sm:px-3 py-0.5 sm:py-1 rounded text-[10px] sm:text-xs font-bold">M-PESA</div>
            <img src="/paypal.png" alt="PayPal" className="h-6 sm:h-8 object-contain" />
          </div>
        </div>
      </div>
    </div>
  )
}