"use client"

import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"
import { AlertCircle, X, ChevronLeft, ChevronRight } from "lucide-react"

const NOTIFICATIONS = [
  {
    id: 1,
    text: "Important: Resumption of Daily Nairobi – Dubai Flights — ",
    linkText: "Read More",
    linkHref: "#",
  },
  {
    id: 2,
    text: "Travel Advisory: Updates on international travel requirements — ",
    linkText: "Read More",
    linkHref: "#",
  }
]

export function NotificationBar() {
  const [alerts, setAlerts] = useState<typeof NOTIFICATIONS>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isMounted, setIsMounted] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    setIsMounted(true)
    const dismissed = JSON.parse(sessionStorage.getItem("kq-dismissed-alerts") || "[]")
    const activeAlerts = NOTIFICATIONS.filter(a => !dismissed.includes(a.id))
    setAlerts(activeAlerts)
  }, [])

  if (!isMounted || alerts.length === 0 || pathname?.startsWith('/search')) return null

  const currentAlert = alerts[currentIndex]

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % alerts.length)
  }

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + alerts.length) % alerts.length)
  }

  const handleDismiss = () => {
    const alertId = currentAlert.id
    const dismissed = JSON.parse(sessionStorage.getItem("kq-dismissed-alerts") || "[]")
    sessionStorage.setItem("kq-dismissed-alerts", JSON.stringify([...dismissed, alertId]))

    const newAlerts = alerts.filter((a) => a.id !== alertId)
    setAlerts(newAlerts)
    if (currentIndex >= newAlerts.length && newAlerts.length > 0) {
      setCurrentIndex(newAlerts.length - 1)
    } else {
      setCurrentIndex(0)
    }
  }

  return (
    <div className="bg-brand-primary text-white px-3 py-2 text-xs flex items-center justify-between animate-fade-in relative z-50">
      <div className="flex items-center gap-2 flex-1 min-w-0">
        <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
        <p className="font-medium truncate">
          {currentAlert.text}
          <a href={currentAlert.linkHref} className="underline hover:text-white/80 transition-colors ml-1 whitespace-nowrap">
            {currentAlert.linkText}
          </a>
        </p>
      </div>

      <div className="flex items-center gap-2 ml-3 flex-shrink-0">
        {alerts.length > 1 && (
          <div className="hidden sm:flex items-center gap-1 text-xs opacity-80">
            <button onClick={handlePrev} className="p-0.5 hover:bg-black/20 rounded" aria-label="Previous">
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
            <span>{currentIndex + 1}/{alerts.length}</span>
            <button onClick={handleNext} className="p-0.5 hover:bg-black/20 rounded" aria-label="Next">
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
        <button 
          onClick={handleDismiss}
          className="p-1 hover:bg-black/20 rounded-full transition-colors"
          aria-label="Close notification"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  )
}
