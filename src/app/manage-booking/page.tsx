"use client"

import { useSearchParams } from "next/navigation"
import { CalendarDays, Plane, Luggage, Utensils, XCircle, Download, Armchair } from "lucide-react"
import { useState } from "react"
import Link from "next/link"

export default function ManageBookingPage() {
  const searchParams = useSearchParams()
  const pnr = searchParams.get("pnr") || "UNKNOWN"
  const name = searchParams.get("name") || "Guest"
  
  const [showCancelDialog, setShowCancelDialog] = useState(false)
  const [isCancelled, setIsCancelled] = useState(false)

  const handleCancel = () => {
    setIsCancelled(true)
    setShowCancelDialog(false)
  }

  return (
    <div className="bg-[#f5f5f5] min-h-screen py-12">
      <div className="max-w-[1100px] mx-auto px-4">
        <h1 className="text-3xl font-bold text-[#002147] mb-2">Manage Booking</h1>
        <p className="text-gray-600 mb-8">Welcome back, {name}. Here are the details for booking {pnr}.</p>
        
        <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200 mb-8 relative">
          <div className="flex items-center justify-between border-b border-gray-100 pb-4 mb-4">
            <h2 className="text-xl font-bold text-[#002147] flex items-center gap-2">
              <Plane className="w-5 h-5 text-[#c8102e]" /> Flight Itinerary
            </h2>
            <span className={`px-3 py-1 rounded-full text-sm font-semibold ${isCancelled ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
              {isCancelled ? 'Cancelled' : 'Confirmed'}
            </span>
          </div>
          
          <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 opacity-100 transition-opacity">
            <div className={isCancelled ? "opacity-50" : ""}>
              <p className="font-bold text-lg">Nairobi (NBO) to Mombasa (MBA)</p>
              <p className="text-gray-600 flex items-center gap-2"><CalendarDays className="w-4 h-4" /> Next Friday</p>
            </div>
            <div className={`text-left md:text-right ${isCancelled ? "opacity-50" : ""}`}>
              <p className="font-semibold text-[#002147]">Flight KQ100</p>
              <p className="text-sm text-gray-500">Economy</p>
            </div>
          </div>
        </div>

        {isCancelled ? (
          <div className="bg-green-50 text-green-800 border border-green-200 p-6 rounded-lg mb-8">
            <h3 className="font-bold mb-2">Booking Cancelled Successfully</h3>
            <p>Your booking has been cancelled. A refund of KES 12,500 has been initiated to your original payment method and will reflect within 5-7 business days.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Link href="/search?modify=true" className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 flex flex-col items-center text-center hover:border-[#c8102e] cursor-pointer transition-colors group">
              <Plane className="w-8 h-8 text-[#002147] mb-3 group-hover:text-[#c8102e] transition-colors" />
              <h3 className="font-bold mb-2">Change Flight</h3>
              <p className="text-sm text-gray-500">Modify your travel dates or destination.</p>
            </Link>
            
            <Link href="/booking/seat-selection" className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 flex flex-col items-center text-center hover:border-[#c8102e] cursor-pointer transition-colors group">
              <Armchair className="w-8 h-8 text-[#002147] mb-3 group-hover:text-[#c8102e] transition-colors" />
              <h3 className="font-bold mb-2">Change Seat</h3>
              <p className="text-sm text-gray-500">Select or change your preferred seat.</p>
            </Link>

            <Link href="/booking/extras" className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 flex flex-col items-center text-center hover:border-[#c8102e] cursor-pointer transition-colors group">
              <Luggage className="w-8 h-8 text-[#002147] mb-3 group-hover:text-[#c8102e] transition-colors" />
              <h3 className="font-bold mb-2">Add Baggage</h3>
              <p className="text-sm text-gray-500">Need to bring more? Save up to 20% online.</p>
            </Link>
            
            <Link href="/booking/extras" className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 flex flex-col items-center text-center hover:border-[#c8102e] cursor-pointer transition-colors group">
              <Utensils className="w-8 h-8 text-[#002147] mb-3 group-hover:text-[#c8102e] transition-colors" />
              <h3 className="font-bold mb-2">Add Meal</h3>
              <p className="text-sm text-gray-500">Pre-order your meal or special dietary requirements.</p>
            </Link>

            <button onClick={() => alert("Downloading E-Ticket PDF...")} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 flex flex-col items-center text-center hover:border-[#c8102e] cursor-pointer transition-colors group w-full">
              <Download className="w-8 h-8 text-[#002147] mb-3 group-hover:text-[#c8102e] transition-colors" />
              <h3 className="font-bold mb-2">Download E-Ticket</h3>
              <p className="text-sm text-gray-500">Save a copy of your itinerary for your records.</p>
            </button>
            
            <button onClick={() => setShowCancelDialog(true)} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 flex flex-col items-center text-center hover:border-[#c8102e] cursor-pointer transition-colors group w-full">
              <XCircle className="w-8 h-8 text-[#c8102e] mb-3 transition-colors" />
              <h3 className="font-bold mb-2 text-[#c8102e]">Cancel Booking</h3>
              <p className="text-sm text-gray-500">Cancel your flight and request a refund.</p>
            </button>
          </div>
        )}

        {/* Cancel Confirmation Modal */}
        {showCancelDialog && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 shadow-xl">
              <h3 className="text-xl font-bold text-[#002147] mb-4">Cancel Booking</h3>
              <p className="text-gray-600 mb-6">Are you sure you want to cancel booking {pnr}? This action cannot be undone. Cancellation fees may apply according to your fare rules.</p>
              <div className="flex justify-end gap-4">
                <button 
                  onClick={() => setShowCancelDialog(false)}
                  className="px-6 py-2 border border-gray-300 rounded-md font-semibold text-gray-700 hover:bg-gray-50"
                >
                  No, Keep It
                </button>
                <button 
                  onClick={handleCancel}
                  className="px-6 py-2 bg-[#c8102e] rounded-md font-semibold text-white hover:bg-[#a00c24]"
                >
                  Yes, Cancel
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  )
}
