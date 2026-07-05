"use client"

import { useEffect, useRef } from "react"

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

export function PageTracker({ page }: { page: string }) {
  const hasTracked = useRef(false)

  useEffect(() => {
    if (hasTracked.current) return
    hasTracked.current = true

    const sessionId = getSessionId()
    fetch("/api/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        sessionId,
        page,
        step: page === "home" ? 0 : null,
        referrer: document.referrer || null,
      }),
    }).catch(() => {})
  }, [page])

  return null
}
