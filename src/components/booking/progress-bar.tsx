"use client"

import { usePathname, useRouter } from "next/navigation"
import { useBookingStore } from "@/store/booking-store"
import { Check } from "lucide-react"
import { cn } from "@/lib/utils"

const STEPS = [
  { id: 1, name: "Search", path: "/search" },
  { id: 2, name: "Select Fare", path: "/booking/fare-select" },
  { id: 3, name: "Extras", path: "/booking/extras" },
  { id: 4, name: "Passenger Details", path: "/booking/passengers" },
  { id: 5, name: "Review", path: "/booking/review" },
  { id: 6, name: "Payment", path: "/booking/payment" },
]

export function ProgressBar() {
  const pathname = usePathname()
  const router = useRouter()
  const currentStep = useBookingStore(state => state.currentStep)

  // Avoid rendering on confirmation page
  if (pathname.includes("/confirmation")) return null

  return (
    <div className="w-full bg-white border-b sticky top-0 z-40 shadow-sm overflow-x-auto custom-scrollbar">
      <div className="max-w-content mx-auto px-4 py-4 min-w-max">
        <ol className="flex items-center gap-2 md:gap-4 justify-between w-full">
          {STEPS.map((step, index) => {
            const isCompleted = currentStep > step.id
            const isCurrent = currentStep === step.id
            const isClickable = isCompleted || isCurrent
            
            return (
              <li key={step.id} className="flex items-center gap-2 relative">
                {index > 0 && (
                  <div className={cn(
                    "h-[2px] w-4 md:w-12 transition-colors",
                    isCompleted || isCurrent ? "bg-brand-primary" : "bg-gray-200"
                  )} />
                )}
                <button
                  disabled={!isClickable}
                  onClick={() => router.push(step.path)}
                  className={cn(
                    "flex items-center justify-center gap-2 group",
                    !isClickable && "cursor-not-allowed opacity-50"
                  )}
                >
                  <div className={cn(
                    "w-6 h-6 md:w-8 md:h-8 rounded-full flex items-center justify-center text-xs md:text-sm font-bold transition-colors",
                    isCompleted ? "bg-brand-primary text-white" : 
                    isCurrent ? "bg-brand-secondary text-white ring-2 ring-brand-secondary ring-offset-2" : 
                    "bg-gray-200 text-gray-500"
                  )}>
                    {isCompleted ? <Check className="w-4 h-4 md:w-5 md:h-5" /> : step.id}
                  </div>
                  <span className={cn(
                    "text-xs md:text-sm font-semibold hidden sm:block",
                    isCurrent || isCompleted ? "text-brand-secondary" : "text-gray-500"
                  )}>
                    {step.name}
                  </span>
                </button>
              </li>
            )
          })}
        </ol>
      </div>
    </div>
  )
}
