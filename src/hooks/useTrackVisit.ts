"use client"

import { useEffect, useRef } from "react"
import { usePathname } from "next/navigation"
import { useBookingStore } from "@/store/booking-store"

const SESSION_KEY = "kq-session-id"

function getSessionId(): string {
  if (typeof window === "undefined") return ""
  let id = localStorage.getItem(SESSION_KEY)
  if (!id) {
    id = crypto.randomUUID?.() || Math.random().toString(36).slice(2) + Date.now().toString(36)
    localStorage.setItem(SESSION_KEY, id)
  }
  return id
}

const STEP_MAP: Record<string, number> = {
  "/": 0,
  "/search": 1,
  "/booking/fare-select": 2,
  "/booking/extras": 3,
  "/booking/seat-selection": 3,
  "/booking/passengers": 4,
  "/booking/review": 5,
  "/booking/payment": 6,
  "/booking/payment/mobile": 6,
  "/booking/confirmation": 7,
}

const PAGE_NAMES: Record<string, string> = {
  "/": "home",
  "/search": "search",
  "/booking/fare-select": "fare-select",
  "/booking/extras": "extras",
  "/booking/seat-selection": "seat-selection",
  "/booking/passengers": "passengers",
  "/booking/review": "review",
  "/booking/payment": "payment",
  "/booking/payment/mobile": "payment-mobile",
  "/booking/confirmation": "confirmation",
}

export function useTrackVisit() {
  const pathname = usePathname()
  const hasTracked = useRef(false)
  const { contactDetails, selectedFare, origin, destination, cabinClass } = useBookingStore()

  useEffect(() => {
    if (!pathname || hasTracked.current) return
    hasTracked.current = true

    const sessionId = getSessionId()
    const page = PAGE_NAMES[pathname] || pathname
    const step = STEP_MAP[pathname] ?? null
    const email = contactDetails?.email ?? null

    const metadata: Record<string, unknown> = {}
    if (origin) metadata.origin = origin
    if (destination) metadata.destination = destination
    if (selectedFare) metadata.fare = selectedFare
    if (cabinClass) metadata.cabinClass = cabinClass

    fetch("/api/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        sessionId,
        page,
        step,
        email,
        referrer: document.referrer || null,
        metadata: Object.keys(metadata).length > 0 ? metadata : null,
      }),
    }).catch(() => {})
  }, [pathname])
}
