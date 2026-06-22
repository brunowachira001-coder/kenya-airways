"use client"

import { useState } from "react"
import { Phone, Mail, MessageSquare, ChevronDown, ChevronUp } from "lucide-react"

const FAQS = [
  {
    question: "How do I manage my booking online?",
    answer: "You can manage your booking by visiting the 'Book & Manage' tab, selecting 'Manage Booking', and entering your Booking Reference (PNR) and Last Name. From there, you can change flight dates, select seats, request meals, or add extra baggage.",
  },
  {
    question: "What is the baggage allowance for my flight?",
    answer: "Baggage allowance varies by cabin class and destination. Typically, Economy Class passengers are allowed 2 bags up to 23kg (50lbs) each, and Business Class passengers are allowed 2 bags up to 32kg (70lbs) each. Carry-on limits are 1 bag up to 12kg.",
  },
  {
    question: "How do I request a refund?",
    answer: "To request a refund, please contact our global support team at reservations@kenya-airways.com or visit the office where you purchased your ticket. If you booked through our website, you can submit a refund request form online.",
  },
  {
    question: "When does online check-in open?",
    answer: "Online check-in opens 30 hours before your scheduled departure time and closes 1 hour before departure. You can check-in on our website or mobile app to receive your digital boarding pass.",
  },
]

export default function HelpPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Header */}
      <div 
        className="relative h-[40vh] min-h-[300px] bg-cover bg-center flex items-end pb-12 text-white"
        style={{ backgroundImage: `url('/special_care.png')` }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
        <div className="max-w-content mx-auto px-4 w-full relative z-10">
          <div className="max-w-2xl">
            <span className="bg-[#ed1c24] text-xs uppercase px-2.5 py-1 rounded font-bold tracking-wider mb-3 inline-block">
              Support
            </span>
            <h1 className="text-4xl md:text-5xl font-display font-bold tracking-tight mb-2">
              Customer Support
            </h1>
            <p className="text-lg opacity-90">
              We are here to help you before, during, and after your journey.
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-content mx-auto px-4 py-12 md:py-16 w-full grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* FAQs */}
        <div className="lg:col-span-2">
          <h2 className="text-2xl font-bold mb-6 font-sans text-[#0d0d0d]">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {FAQS.map((faq, index) => (
              <div 
                key={index}
                className="border border-gray-100 rounded-lg overflow-hidden bg-white shadow-sm"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  className="w-full flex items-center justify-between p-5 text-left font-semibold text-[#0d0d0d] hover:text-[#ed1c24] transition-colors"
                >
                  <span>{faq.question}</span>
                  {openFaq === index ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                </button>
                {openFaq === index && (
                  <div className="p-5 pt-0 border-t border-gray-50 text-sm text-gray-600 leading-relaxed bg-gray-50/50">
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Contact Info */}
        <div className="space-y-8">
          <h2 className="text-2xl font-bold mb-6 font-sans text-[#0d0d0d]">Contact Us</h2>
          
          <div className="bg-[#0d0d0d] text-white p-6 md:p-8 rounded-xl shadow-md border border-white/10 space-y-6">
            <div className="flex items-start gap-4">
              <Phone className="w-5 h-5 text-[#ed1c24] mt-1 flex-shrink-0" />
              <div>
                <p className="font-bold text-sm uppercase text-gray-400 tracking-wider">Call Center (24/7)</p>
                <p className="text-lg font-bold mt-1">+254 711 024 747</p>
                <p className="text-xs text-gray-400 mt-0.5">International rates apply.</p>
              </div>
            </div>

            <div className="flex items-start gap-4 border-t border-white/10 pt-6">
              <Mail className="w-5 h-5 text-[#ed1c24] mt-1 flex-shrink-0" />
              <div>
                <p className="font-bold text-sm uppercase text-gray-400 tracking-wider">Email Reservations</p>
                <a href="mailto:reservations@kenya-airways.com" className="text-base font-bold mt-1 block hover:text-[#ed1c24] underline transition-colors">
                  reservations@kenya-airways.com
                </a>
              </div>
            </div>

            <div className="flex items-start gap-4 border-t border-white/10 pt-6">
              <MessageSquare className="w-5 h-5 text-[#ed1c24] mt-1 flex-shrink-0" />
              <div>
                <p className="font-bold text-sm uppercase text-gray-400 tracking-wider">Customer Relations</p>
                <a href="mailto:customer.relations@kenya-airways.com" className="text-base font-bold mt-1 block hover:text-[#ed1c24] underline transition-colors">
                  customer.relations@kenya-airways.com
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
