"use client"

import { Search } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function ManageBookingPage() {
  return (
    <div className="max-w-content mx-auto px-4">
      <div className="max-w-3xl mx-auto bg-white rounded-card shadow-card overflow-hidden">
        <div className="p-8 md:p-10 border-b">
          <h1 className="font-sans text-3xl md:text-4xl font-medium mb-4">Manage Booking</h1>
          <p className="text-muted-foreground text-lg mb-8">
            View your itinerary, change your flight, upgrade your seat, or request special services.
          </p>

          <form className="flex flex-col md:flex-row gap-4" onSubmit={(e) => e.preventDefault()}>
            <div className="flex-1">
              <label className="text-xs font-semibold text-gray-500 uppercase mb-2 block">Booking Reference / PNR</label>
              <Input 
                placeholder="e.g. ABCDEF" 
                className="h-14 text-lg uppercase bg-brand-light-grey focus-visible:ring-brand-primary" 
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
                <Search className="w-5 h-5 mr-2" /> Retrieve
              </Button>
            </div>
          </form>
        </div>

        <div className="p-8 bg-brand-light-grey/50">
          <h3 className="font-sans text-xl font-medium mb-6">What can you do in Manage Booking?</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 text-brand-secondary">
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 rounded-full bg-brand-primary mt-2 flex-shrink-0" />
              <p>Change your flight dates or times</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 rounded-full bg-brand-primary mt-2 flex-shrink-0" />
              <p>Upgrade to Premium Economy or Business Class</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 rounded-full bg-brand-primary mt-2 flex-shrink-0" />
              <p>Select or change your seat</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 rounded-full bg-brand-primary mt-2 flex-shrink-0" />
              <p>Add extra baggage</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 rounded-full bg-brand-primary mt-2 flex-shrink-0" />
              <p>Request special meals or assistance</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 rounded-full bg-brand-primary mt-2 flex-shrink-0" />
              <p>Update contact information</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
