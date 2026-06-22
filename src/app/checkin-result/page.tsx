'use client'

import { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { CheckCircle } from 'lucide-react'

function CheckinResultContent() {
  const searchParams = useSearchParams()
  const success = searchParams.get('success') === 'true'
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 bg-gray-50 py-12">
        <div className="max-w-2xl mx-auto px-4">
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold mb-4">
              {success ? 'Check-in Successful!' : 'Check-in Failed'}
            </h1>
            <p className="text-gray-600">
              {success 
                ? 'Your boarding pass has been sent to your email.' 
                : 'There was an error processing your check-in.'}
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default function CheckinResultPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CheckinResultContent />
    </Suspense>
  )
}
