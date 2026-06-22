"use client"

import Link from "next/link"
import { Plane } from "lucide-react"

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 text-center">
      <div className="w-24 h-24 bg-red-50 rounded-full flex items-center justify-center mb-6">
        <Plane className="w-12 h-12 text-brand-primary" />
      </div>
      <h1 className="text-4xl md:text-5xl font-bold font-sans mb-4">404 - Page Not Found</h1>
      <p className="text-lg text-gray-600 max-w-xl mb-8">
        We couldn&apos;t find the page you were looking for. The flight may have departed or the link might be broken.
      </p>
      <Link 
        href="/"
        className="bg-brand-primary hover:bg-[#A00D25] text-white px-8 py-3 rounded-button font-bold transition-colors inline-flex items-center gap-2"
      >
        Return to Homepage
      </Link>
    </div>
  )
}
