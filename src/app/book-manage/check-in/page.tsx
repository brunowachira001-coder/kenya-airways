"use client"

import { CheckCircle } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function CheckInPage() {
  return (
    <div className="max-w-content mx-auto px-4">
      <div className="max-w-3xl mx-auto bg-white rounded-card shadow-card overflow-hidden">
        <div className="p-8 md:p-10 border-b">
          <h1 className="font-sans text-3xl md:text-4xl font-medium mb-4">Web Check-in</h1>
          <p className="text-muted-foreground text-lg mb-8">
            Save time at the airport. Check in online between 48 hours and 90 minutes before your flight departs.
          </p>

          <form className="flex flex-col md:flex-row gap-4" onSubmit={(e) => e.preventDefault()}>
            <div className="flex-1">
              <label className="text-xs font-semibold text-gray-500 uppercase mb-2 block">Ticket Number / PNR</label>
              <Input 
                placeholder="e.g. 1234567890123" 
                className="h-14 text-lg bg-brand-light-grey focus-visible:ring-brand-primary" 
                required
              />
            </div>
            <div className="flex-1">
              <label className="text-xs font-semibold text-gray-500 uppercase mb-2 block">Last Name</label>
              <Input 
                placeholder="Passenger Last Name" 
                className="h-14 text-lg bg-brand-light-grey focus-visible:ring-brand-primary" 
                required
              />
            </div>
            <div className="flex items-end">
              <Button type="submit" className="w-full md:w-auto bg-brand-primary hover:bg-brand-primary/90 text-white h-14 px-8 text-lg font-medium rounded-button whitespace-nowrap">
                Check In
              </Button>
            </div>
          </form>
        </div>

        <div className="p-8 bg-brand-light-grey/50">
          <h3 className="font-sans text-xl font-medium mb-6">Online Check-in Benefits</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 text-brand-secondary">
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              <p>Skip the queues at the airport</p>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              <p>Choose your preferred seat</p>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              <p>Get your mobile boarding pass</p>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              <p>Drop your bags at the dedicated bag drop counter</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
