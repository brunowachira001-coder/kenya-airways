"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Check } from "lucide-react"

export function Newsletter() {
  const [email, setEmail] = useState("")
  const [agreed, setAgreed] = useState(false)
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!agreed) {
      alert("Please agree to receive news and offers.")
      return
    }
    setStatus("loading")
    
    try {
      const response = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, source: "website" })
      })
      
      if (response.ok) {
        setStatus("success")
        setEmail("")
        setAgreed(false)
      } else {
        const error = await response.json()
        alert(error.error || "Failed to subscribe. Please try again.")
        setStatus("idle")
      }
    } catch (err) {
      console.error("Newsletter subscription error:", err)
      alert("Failed to subscribe. Please try again.")
      setStatus("idle")
    }
  }

  return (
    <section className="w-full py-6 md:py-16 px-4 bg-white border-t border-gray-100">
      <div className="max-w-content mx-auto">
        {/* Container with proper mobile height */}
        <div className="rounded-2xl overflow-hidden relative h-[506px] md:h-[500px]">
          
          {/* Full background image covering entire area */}
          <img 
            src="/hero_slide_1.png" 
            alt="Newsletter" 
            className="absolute inset-0 w-full h-full object-cover"
          />

          {/* Semi-transparent dark overlay - bottom on mobile, right side on desktop */}
          <div className="absolute bottom-0 left-0 right-0 md:inset-y-0 md:right-0 md:left-auto md:w-1/2 lg:w-2/5 bg-[#1c2a38]/92 md:bg-[#1c2a38]/85 backdrop-blur-sm p-5 md:p-14 md:flex md:items-center">
            <div className="w-full">
              <h2 className="font-sans text-lg md:text-3xl font-bold mb-1.5 md:mb-3 text-white">Get the Latest Offers</h2>
              <p className="text-gray-300 text-xs md:text-base mb-3 md:mb-7">
                Subscribe and be the first to receive news and exclusive offers.
              </p>
            
            {status === "success" ? (
              <div className="bg-green-800/30 text-green-300 p-4 rounded-xl flex items-center gap-3 border border-green-700/40">
                <div className="w-8 h-8 bg-green-700/40 rounded-full flex items-center justify-center shrink-0">
                  <Check className="w-5 h-5 text-green-400" />
                </div>
                <div>
                  <p className="font-bold text-sm">Thank you for subscribing!</p>
                  <p className="text-xs opacity-80">You have been added to our mailing list.</p>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-2 md:gap-3">
                <Input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email address" 
                  className="h-10 md:h-12 text-xs md:text-sm bg-white/10 border-white/20 text-white placeholder:text-white/40 focus-visible:ring-[#ed1c24] focus-visible:border-[#ed1c24] rounded-md w-full"
                  required
                />
                
                <label className="flex items-start gap-3 cursor-pointer mt-1 group">
                  <div className="relative flex items-center justify-center mt-0.5 shrink-0">
                    <input type="checkbox" checked={agreed} onChange={(e) => setAgreed(e.target.checked)} className="peer sr-only" />
                    <div className="w-5 h-5 border-2 border-white/30 rounded-sm peer-checked:bg-[#ed1c24] peer-checked:border-[#ed1c24] transition-colors flex items-center justify-center bg-white/10">
                      <Check className="w-3 h-3 text-white opacity-0 peer-checked:opacity-100" strokeWidth={3} />
                    </div>
                  </div>
                  <span className="text-xs md:text-sm text-gray-300 group-hover:text-white transition-colors leading-relaxed">
                    I would like to receive news and offers from Kenya Airways
                  </span>
                </label>

                <button 
                  type="submit" 
                  disabled={status === "loading"}
                  className="mt-1 h-10 md:h-12 bg-[#ed1c24] hover:bg-[#c91520] text-white font-bold rounded-md w-full transition-colors disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center text-xs md:text-sm"
                >
                  {status === "loading" ? "Subscribing..." : "Subscribe"}
                </button>
              </form>
            )}
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
