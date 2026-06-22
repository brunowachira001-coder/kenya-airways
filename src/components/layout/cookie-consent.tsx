"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"

export function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Check if consent has already been given
    const consent = localStorage.getItem("kq-cookie-consent")
    if (!consent) {
      setIsVisible(true)
    }
  }, [])

  const handleAcceptAll = () => {
    localStorage.setItem("kq-cookie-consent", "all")
    setIsVisible(false)
  }

  const handleManageSettings = () => {
    localStorage.setItem("kq-cookie-consent", "managed")
    setIsVisible(false)
  }

  if (!isVisible) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[100] bg-[#0d0d0d] text-white p-4 md:p-6 border-t border-gray-800 shadow-2xl animate-slide-up">
      <div className="max-w-content mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex-1">
          <h3 className="font-sans text-lg font-bold mb-1 text-white">Your Privacy</h3>
          <p className="text-sm text-gray-300">
            We use cookies to improve your experience on our website, personalize content and ads, provide social media features and to analyze our traffic. By clicking &quot;Accept All&quot;, you consent to our use of cookies.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto shrink-0">
          <Button 
            variant="outline" 
            onClick={handleManageSettings}
            className="border-white text-[#0d0d0d] bg-white hover:bg-gray-200 w-full sm:w-auto font-medium"
          >
            Manage Settings
          </Button>
          <Button 
            onClick={handleAcceptAll}
            className="bg-brand-primary hover:bg-[#A00D25] text-white w-full sm:w-auto font-bold"
          >
            Accept All
          </Button>
        </div>
      </div>
    </div>
  )
}
