"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useBookingStore } from "@/store/booking-store"
import { TripSummary } from "@/components/booking/trip-summary"

export default function SeatSelectionPage() {
  const router = useRouter()
  const { setCurrentStep, setSelectedSeat: saveSelectedSeat } = useBookingStore()
  const [selectedSeat, setSelectedSeat] = useState<{ id: string, price: number } | null>(null)

  // Use a simple seeded check to randomly assign occupied seats consistently
  const isOccupied = (row: number, col: string) => {
    const seed = row * col.charCodeAt(0)
    return (seed % 100) < 40 // ~40% occupied
  }

  const cols = ["A", "B", "C", "D", "E", "F"]
  
  const handleSeatClick = (row: number, col: string) => {
    if (isOccupied(row, col)) return
    
    const isExtraLegroom = row <= 2
    const price = isExtraLegroom ? 1250 : 0
    const seatId = `${row}${col}`

    if (selectedSeat?.id === seatId) {
      setSelectedSeat(null)
    } else {
      setSelectedSeat({ id: seatId, price })
    }
  }

  const getSeatColor = (row: number, col: string) => {
    const seatId = `${row}${col}`
    if (selectedSeat?.id === seatId) return "bg-[#ed1c24] border-[#ed1c24] text-white"
    if (isOccupied(row, col)) return "bg-gray-200 border-gray-300 text-gray-400 cursor-not-allowed"
    if (row <= 2) return "bg-blue-100 border-blue-300 text-blue-700 hover:bg-blue-200 cursor-pointer"
    return "bg-green-100 border-green-300 text-green-700 hover:bg-green-200 cursor-pointer"
  }

  return (
    <div className="max-w-content mx-auto px-4">
      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* Main Area */}
        <div className="flex-1 bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h1 className="text-2xl font-bold mb-6">Seat Selection</h1>
          
          <div className="flex flex-wrap gap-4 mb-8 text-sm">
            <div className="flex items-center gap-2"><div className="w-4 h-4 bg-green-100 border border-green-300 rounded"></div> Available</div>
            <div className="flex items-center gap-2"><div className="w-4 h-4 bg-gray-200 border border-gray-300 rounded"></div> Occupied</div>
            <div className="flex items-center gap-2"><div className="w-4 h-4 bg-[#ed1c24] border border-[#ed1c24] rounded"></div> Selected</div>
            <div className="flex items-center gap-2"><div className="w-4 h-4 bg-blue-100 border border-blue-300 rounded"></div> Extra Legroom (+KES 1,250)</div>
          </div>

          <div className="w-full max-w-[400px] mx-auto bg-gray-50 border border-gray-200 rounded-[40px] p-8 pb-16 shadow-inner relative">
            <div className="text-center font-bold text-gray-400 mb-8 tracking-widest text-sm">FRONT</div>
            
            {Array.from({ length: 30 }).map((_, rIdx) => {
              const row = rIdx + 1
              return (
                <div key={row} className="flex justify-center items-center gap-2 mb-3">
                  <div className="flex gap-2">
                    {cols.slice(0, 3).map(col => (
                      <button
                        key={`${row}${col}`}
                        onClick={() => handleSeatClick(row, col)}
                        title={isOccupied(row, col) ? "Occupied" : `Seat ${row}${col} - ${row <= 2 ? 'Extra Legroom (KES 1,250)' : 'Included'}`}
                        className={`w-10 h-10 rounded-t-lg rounded-b flex items-center justify-center text-xs font-semibold border ${getSeatColor(row, col)} transition-colors`}
                      >
                        {col}
                      </button>
                    ))}
                  </div>
                  
                  {/* Aisle */}
                  <div className="w-8 text-center text-xs font-bold text-gray-400">{row}</div>
                  
                  <div className="flex gap-2">
                    {cols.slice(3, 6).map(col => (
                      <button
                        key={`${row}${col}`}
                        onClick={() => handleSeatClick(row, col)}
                        title={isOccupied(row, col) ? "Occupied" : `Seat ${row}${col} - ${row <= 2 ? 'Extra Legroom (KES 1,250)' : 'Included'}`}
                        className={`w-10 h-10 rounded-t-lg rounded-b flex items-center justify-center text-xs font-semibold border ${getSeatColor(row, col)} transition-colors`}
                      >
                        {col}
                      </button>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="w-full lg:w-[380px]">
          <TripSummary />
        </div>
      </div>

      {/* Bottom Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] z-40">
        <div className="max-w-content mx-auto flex items-center justify-between">
          <div>
            <div className="text-sm text-gray-500">Selected Seat</div>
            <div className="font-bold text-xl">{selectedSeat ? `Seat ${selectedSeat.id}` : "None"}</div>
            {selectedSeat && <div className="text-sm font-semibold text-gray-700">{selectedSeat.price > 0 ? `+KES ${selectedSeat.price.toLocaleString()}` : 'Included'}</div>}
          </div>
          
          <div className="flex gap-4">
            <button 
              onClick={() => { setCurrentStep(5); router.push("/booking/extras") }}
              className="px-6 py-3 border border-[#002147] text-[#002147] font-bold rounded-md hover:bg-gray-50 transition-colors"
            >
              Skip seat selection
            </button>
            <button 
              onClick={() => {
                if (selectedSeat) {
                  saveSelectedSeat(selectedSeat)
                }
                setCurrentStep(5)
                router.push("/booking/extras")
              }}
              className="px-8 py-3 bg-[#c8102e] text-white font-bold rounded-md hover:bg-[#a00c24] transition-colors shadow-sm"
            >
              Confirm Seat
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
