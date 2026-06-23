"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Plane, ClipboardList, CalendarDays, MapPin, X } from "lucide-react"

export function QuickActions() {
  const router = useRouter()
  const [openDrawer, setOpenDrawer] = useState<'checkin' | 'manage' | null>(null)
  const [pnr, setPnr] = useState("")
  const [lastName, setLastName] = useState("")

  const actions = [
    {
      title: "Check in",
      icon: <Plane className="w-5 h-5" />,
      onClick: () => setOpenDrawer('checkin'),
    },
    {
      title: "Manage Booking",
      icon: <ClipboardList className="w-5 h-5" />,
      onClick: () => setOpenDrawer('manage'),
    },
    {
      title: "Flight schedule",
      icon: <CalendarDays className="w-5 h-5" />,
      href: "/book-manage/flight-schedule",
    },
    {
      title: "Flight status",
      icon: <MapPin className="w-5 h-5" />,
      href: "/book-manage/flight-status",
    }
  ]

  const handleCheckInSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (pnr && lastName) {
      router.push(`/checkin-result?pnr=${pnr}&name=${lastName}`)
      setOpenDrawer(null)
    }
  }

  const handleManageSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (pnr && lastName) {
      router.push(`/manage-booking?pnr=${pnr}&name=${lastName}`)
      setOpenDrawer(null)
    }
  }

  return (
    <>
      <section className="w-full bg-white border-b border-gray-100 relative z-10">
        <div className="max-w-content mx-auto">
          <div className="grid grid-cols-4 gap-0">
            {actions.map((action, index) => (
              action.href ? (
                <Link 
                  key={index} 
                  href={action.href}
                  className="flex flex-col items-center justify-center text-center py-3 px-2 hover:bg-gray-50 active:bg-gray-100 transition-colors group border-r border-gray-100 last:border-r-0"
                >
                  <div className="text-[#ed1c24] group-hover:scale-110 transition-transform mb-1">
                    {action.icon}
                  </div>
                  <span className="text-[11px] md:text-sm font-bold text-[#0d0d0d] group-hover:text-[#ed1c24] transition-colors leading-tight">
                    {action.title}
                  </span>
                </Link>
              ) : (
                <button 
                  key={index} 
                  onClick={action.onClick}
                  className="flex flex-col items-center justify-center text-center py-3 px-2 hover:bg-gray-50 active:bg-gray-100 transition-colors group border-r border-gray-100 last:border-r-0 cursor-pointer"
                >
                  <div className="text-[#ed1c24] group-hover:scale-110 transition-transform mb-1">
                    {action.icon}
                  </div>
                  <span className="text-[11px] md:text-sm font-bold text-[#0d0d0d] group-hover:text-[#ed1c24] transition-colors leading-tight">
                    {action.title}
                  </span>
                </button>
              )
            ))}
          </div>
        </div>
      </section>

      {/* Slide-in Drawer Overlay */}
      {openDrawer && (
        <div className="fixed inset-0 z-50 flex justify-end">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/50 transition-opacity"
            onClick={() => setOpenDrawer(null)}
          />
          
          {/* Drawer Content */}
          <div className="relative w-full max-w-md bg-white h-full shadow-xl flex flex-col animate-slide-in-right">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h2 className="text-2xl font-bold text-[#002147]">
                {openDrawer === 'checkin' ? 'Check in' : 'Manage Booking'}
              </h2>
              <button onClick={() => setOpenDrawer(null)} className="p-2 hover:bg-gray-100 rounded-full text-gray-500 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 flex-1 overflow-y-auto">
              <form onSubmit={openDrawer === 'checkin' ? handleCheckInSubmit : handleManageSubmit} className="flex flex-col gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Booking Reference
                  </label>
                  <input 
                    type="text" 
                    value={pnr}
                    onChange={(e) => setPnr(e.target.value.toUpperCase())}
                    placeholder="6-character number, e.g. AZ6E7G"
                    className="w-full h-12 px-4 border border-gray-300 rounded-md focus:border-[#c8102e] focus:outline-none"
                    maxLength={6}
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Lastname
                  </label>
                  <input 
                    type="text" 
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="As on ticket"
                    className="w-full h-12 px-4 border border-gray-300 rounded-md focus:border-[#c8102e] focus:outline-none"
                    required
                  />
                </div>

                <button 
                  type="submit"
                  disabled={!pnr || !lastName}
                  className="w-full h-12 bg-[#c8102e] text-white font-bold rounded-md hover:bg-[#a00c24] disabled:opacity-50 disabled:cursor-not-allowed transition-colors mt-2"
                >
                  {openDrawer === 'checkin' ? 'Check in' : 'Retrieve Booking'}
                </button>
              </form>

              {openDrawer === 'checkin' && (
                <div className="mt-8 flex flex-col gap-4 border-t border-gray-100 pt-6">
                  <button onClick={() => setOpenDrawer('manage')} className="text-[#002147] font-semibold hover:text-[#c8102e] transition-colors text-left flex items-center justify-between">
                    Manage Booking <span>→</span>
                  </button>
                  <Link href="/book-manage/flight-schedule" onClick={() => setOpenDrawer(null)} className="text-[#002147] font-semibold hover:text-[#c8102e] transition-colors text-left flex items-center justify-between">
                    Flight schedule <span>→</span>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}