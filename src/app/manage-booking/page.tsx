'use client'

import { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'

function ManageBookingContent() {
  const searchParams = useSearchParams()
  const bookingRef = searchParams.get('ref')
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="text-3xl font-bold mb-8">Manage Booking</h1>
          {bookingRef && (
            <p className="text-gray-600 mb-4">Booking Reference: {bookingRef}</p>
          )}
          <div className="bg-white rounded-lg shadow-lg p-8">
            <p className="text-gray-600">Manage your booking details here.</p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default function ManageBookingPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ManageBookingContent />
    </Suspense>
  )
}
