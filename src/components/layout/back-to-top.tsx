"use client"

import { useState, useEffect } from "react"
import { ChevronUp } from "lucide-react"

import { cn } from "@/lib/utils"

export function BackToTop() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    let ticking = false
    const toggleVisibility = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          if (window.scrollY > 300) {
            setIsVisible(true)
          } else {
            setIsVisible(false)
          }
          ticking = false
        })
        ticking = true
      }
    }

    window.addEventListener("scroll", toggleVisibility)
    return () => window.removeEventListener("scroll", toggleVisibility)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    })
  }

  return (
    <button
      data-back-to-top
      onClick={scrollToTop}
      className={cn(
        "fixed bottom-8 right-8 z-50 p-3 bg-brand-primary text-white rounded-full shadow-lg transition-all duration-300 hover:bg-brand-primary/90 hover:scale-110",
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10 pointer-events-none"
      )}
      aria-label="Back to top"
    >
      <ChevronUp className="w-6 h-6" />
    </button>
  )
}
