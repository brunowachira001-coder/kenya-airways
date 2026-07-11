"use client"

import { QRCodeSVG } from "qrcode.react"

interface BoardingPassProps {
  passengerName: string
  title?: string
  flightNumber: string
  date: string
  origin: string
  originCity: string
  originAirport: string
  destination: string
  destinationCity: string
  destinationAirport: string
  departureTime: string
  arrivalTime?: string
  boardingTime: string
  gateClosingTime?: string
  gate?: string
  terminal?: string
  seat: string
  classType: string
  classCode: string
  bookingReference: string
  electronicTicket: string
  sequenceNumber?: string
  zone?: string
  skyPriority?: boolean
}

const airports: Record<string, { city: string; airport: string; terminal?: string }> = {
  NBO: { city: "Nairobi", airport: "Nairobi Jomo Kenyatta Intl", terminal: "1A" },
  MBA: { city: "Mombasa", airport: "Moi International", terminal: "1" },
  KIS: { city: "Kisumu", airport: "Kisumu International", terminal: "1" },
  EDL: { city: "Eldoret", airport: "Eldoret International", terminal: "1" },
  DAR: { city: "Dar es Salaam", airport: "Julius Nyerere Intl", terminal: "2" },
  EBB: { city: "Entebbe", airport: "Entebbe International", terminal: "1" },
  ADD: { city: "Addis Ababa", airport: "Bole International", terminal: "2" },
  LHR: { city: "London", airport: "London Heathrow", terminal: "4" },
  LGW: { city: "London", airport: "London Gatwick", terminal: "S" },
  CDG: { city: "Paris", airport: "Paris Charles de Gaulle", terminal: "2E" },
  AMS: { city: "Amsterdam", airport: "Amsterdam Schiphol", terminal: "3" },
  DXB: { city: "Dubai", airport: "Dubai International", terminal: "1" },
  BOM: { city: "Mumbai", airport: "Mumbai Chhatrapati Shivaji", terminal: "2" },
  JNB: { city: "Johannesburg", airport: "Johannesburg O.R. Tambo Intl", terminal: "A" },
  KGL: { city: "Kigali", airport: "Kigali International", terminal: "1" },
  LOS: { city: "Lagos", airport: "Lagos Murtala Muhammed", terminal: "1" },
  ACC: { city: "Accra", airport: "Accra Kotoka International", terminal: "3" },
}

function formatDisplayDate(dateStr: string): string {
  if (!dateStr) return new Date().toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })
  try {
    const d = new Date(dateStr)
    return d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })
  } catch {
    return dateStr
  }
}

function PlaneIcon({ className = "" }: { className?: string }) {
  return (
    <svg width="24" height="18" viewBox="0 0 28 20" className={className} fill="none">
      <path d="M2 16L26 10L2 4L6 10L2 16Z" fill="#888"/>
      <path d="M6 10L12 8L8 10L12 12L6 10Z" fill="#666"/>
    </svg>
  )
}

export default function BoardingPass({
  passengerName,
  title = "MR",
  flightNumber,
  date,
  origin,
  originCity,
  originAirport,
  destination,
  destinationCity,
  destinationAirport,
  departureTime,
  arrivalTime,
  boardingTime,
  gateClosingTime,
  gate = "---",
  terminal,
  seat,
  classType,
  classCode,
  bookingReference,
  electronicTicket,
  sequenceNumber = "21",
  zone = "A",
  skyPriority = false,
}: BoardingPassProps) {
  const originData = airports[origin] || { city: originCity || origin, airport: originAirport || origin, terminal: "1" }
  const destData = airports[destination] || { city: destinationCity || destination, airport: destinationAirport || destination, terminal: "1" }
  const displayTerminal = terminal || originData.terminal || "1"

  // Format passenger name as "LASTNAME /Firstname Title"
  const nameParts = passengerName.trim().split(" ")
  const lastName = nameParts.length > 1 ? nameParts.slice(0, -1).join(" ") : passengerName
  const firstName = nameParts.length > 1 ? nameParts[nameParts.length - 1] : ""
  const displayName = `${lastName.toUpperCase()} /${firstName} ${title}`

  // QR code data
  const qrData = JSON.stringify({
    type: "BOARDING_PASS",
    ref: bookingReference,
    flt: flightNumber,
    date: date,
    pax: displayName,
    seat: seat,
    from: origin,
    to: destination,
    tk: electronicTicket,
  })

  return (
    <div className="w-full max-w-[700px] mx-auto bg-white rounded-lg overflow-hidden shadow-lg border border-gray-200" style={{ fontFamily: "'Segoe UI', Arial, sans-serif" }}>
      {/* Header with Logo and QR Code */}
      <div className="flex items-start justify-between px-3 sm:px-5 pt-3 sm:pt-4 pb-2">
        {/* KQ Logo */}
        <div className="flex items-center gap-2">
          <img src="/kq-logo.svg" alt="Kenya Airways" className="h-8 sm:h-10 w-auto" />
        </div>
        {/* QR Code */}
        <div className="flex flex-col items-center">
          <QRCodeSVG
            value={qrData}
            size={55}
            level="M"
            includeMargin={false}
            bgColor="white"
            fgColor="black"
          />
          <div className="text-[6px] sm:text-[7px] text-gray-400 mt-0.5">Scan at gate</div>
        </div>
      </div>

      {/* Boarding Pass + Sky Priority */}
      <div className="px-3 sm:px-5 pb-2 flex justify-between items-start">
        <div className="min-w-0">
          <h1 className="text-lg sm:text-2xl font-bold text-[#c8102e]" style={{ fontFamily: "Georgia, serif" }}>
            Boarding Pass
          </h1>
          <div className="text-sm sm:text-lg font-bold text-gray-900 mt-1 truncate">
            {displayName}
          </div>
        </div>
        {skyPriority && (
          <div className="text-right flex-shrink-0 ml-2">
            <div className="text-[#c8102e] font-bold text-xs sm:text-sm">SKY PRIORITY</div>
            <div className="text-[#c8102e] font-bold text-sm sm:text-lg">ZONE: {zone}</div>
          </div>
        )}
      </div>

      {/* Flight Information Box */}
      <div className="mx-3 sm:mx-5 mb-3 sm:mb-4 bg-gray-100 rounded-lg p-3 sm:p-4">
        <div className="text-[8px] sm:text-[10px] text-gray-500 uppercase tracking-wider mb-2">Flight Information</div>
        <div className="grid grid-cols-5 gap-1.5 sm:gap-3">
          <div>
            <div className="text-[7px] sm:text-[9px] text-[#c8102e] font-bold uppercase">Flight</div>
            <div className="text-sm sm:text-xl font-bold text-gray-900">{flightNumber}</div>
          </div>
          <div>
            <div className="text-[7px] sm:text-[9px] text-[#c8102e] font-bold uppercase">Seat</div>
            <div className="text-sm sm:text-xl font-bold text-gray-900">{seat}</div>
          </div>
          <div>
            <div className="text-[7px] sm:text-[9px] text-[#c8102e] font-bold uppercase">Boarding Time</div>
            <div className="text-sm sm:text-xl font-bold text-gray-900">{boardingTime}</div>
          </div>
          <div>
            <div className="text-[7px] sm:text-[9px] text-[#c8102e] font-bold uppercase">Gate</div>
            <div className="text-sm sm:text-xl font-bold text-gray-900">{gate}</div>
            <div className="text-[6px] sm:text-[8px] text-gray-400 hidden sm:block">CHECK airport screens</div>
          </div>
          <div>
            <div className="text-[7px] sm:text-[9px] text-[#c8102e] font-bold uppercase">Gate Closing</div>
            <div className="text-sm sm:text-xl font-bold text-gray-900">{gateClosingTime || boardingTime?.replace(":", "")}</div>
            <div className="text-[6px] sm:text-[8px] text-gray-400 hidden sm:block">CHECK airport screens</div>
          </div>
        </div>
      </div>

      {/* Route Section */}
      <div className="px-3 sm:px-5 py-2 sm:py-3 border-t border-gray-200">
        <div className="flex items-center justify-between mb-2">
          <div className="flex-1 min-w-0">
            <span className="text-[8px] sm:text-[10px] text-[#c8102e] font-bold uppercase">From </span>
            <span className="text-xs sm:text-sm font-bold text-gray-900 truncate block">{originData.airport}</span>
          </div>
          <div className="flex-1 text-right min-w-0">
            <span className="text-[8px] sm:text-[10px] text-[#c8102e] font-bold uppercase">To </span>
            <span className="text-xs sm:text-sm font-bold text-gray-900 truncate block">{destData.airport}</span>
          </div>
        </div>

        {/* Terminal and Times */}
        <div className="flex items-center justify-between">
          <div className="text-[8px] sm:text-[10px] text-gray-500">Terminal {displayTerminal}</div>
          <div className="flex items-center gap-3 sm:gap-6">
            {/* Departure */}
            <div className="text-center">
              <PlaneIcon className="mx-auto" />
              <div className="text-[8px] sm:text-[10px] font-bold text-gray-900 mt-0.5">{formatDisplayDate(date)}</div>
              <div className="text-xs sm:text-sm font-bold text-gray-900">{departureTime}</div>
            </div>
            {/* Arrival */}
            <div className="text-center">
              <PlaneIcon className="mx-auto" />
              <div className="text-[8px] sm:text-[10px] font-bold text-gray-900 mt-0.5">{formatDisplayDate(date)}</div>
              <div className="text-xs sm:text-sm font-bold text-gray-900">{arrivalTime || "--:--"}</div>
            </div>
          </div>
          <div className="w-10 sm:w-16"></div>
        </div>
      </div>
    </div>
  )
}
