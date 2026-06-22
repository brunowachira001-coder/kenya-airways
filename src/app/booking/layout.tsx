"use client"

import { ReactNode, useEffect } from "react"

export default function BookingLayout({ children }: { children: ReactNode }) {
  useEffect(() => {
    // Store original body overflow
    const originalOverflow = document.body.style.overflow
    
    // Prevent scrolling of background content
    document.body.style.overflow = 'hidden'
    
    // Hide all main site elements for booking pages
    const elements = [
      document.querySelector('header'),
      document.querySelector('footer'),
      document.querySelector('[data-back-to-top]'),
    ]
    
    // Store original display values
    const originalDisplays = elements.map(el => el ? (el as HTMLElement).style.display : '')
    
    // Hide all elements
    elements.forEach(el => {
      if (el) (el as HTMLElement).style.display = 'none'
    })
    
    // Hide the main element from root layout by finding it more specifically
    const bodyChildren = Array.from(document.body.children)
    const mainElement = bodyChildren.find(child => child.tagName === 'MAIN' && !child.querySelector('[data-booking-container]'))
    const originalMainDisplay = mainElement ? (mainElement as HTMLElement).style.display : ''
    if (mainElement) (mainElement as HTMLElement).style.display = 'none'
    
    return () => {
      // Restore original overflow
      document.body.style.overflow = originalOverflow
      
      // Restore original display values when leaving booking section
      elements.forEach((el, index) => {
        if (el) (el as HTMLElement).style.display = originalDisplays[index]
      })
      if (mainElement) (mainElement as HTMLElement).style.display = originalMainDisplay
    }
  }, [])

  return (
    <div className="fixed inset-0 bg-white overflow-auto z-50" data-booking-container>
      {children}
    </div>
  )
}
