"use client"

import { Check } from "lucide-react"

interface Step {
  number: number
  label: string
  path: string
}

const steps: Step[] = [
  { number: 1, label: "Search", path: "/search" },
  { number: 2, label: "Select Flight", path: "/booking/fare-select" },
  { number: 3, label: "Passengers", path: "/booking/passengers" },
  { number: 4, label: "Review", path: "/booking/review" },
  { number: 5, label: "Payment", path: "/booking/payment" },
  { number: 6, label: "Confirmation", path: "/booking/confirmation" }
]

export function BookingProgress({ currentStep }: { currentStep: number }) {
  return (
    <div className="w-full bg-white border-b border-gray-200 py-6 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">
        {/* Desktop Progress */}
        <div className="hidden md:block">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.number} className="flex items-center flex-1">
                {/* Step Circle */}
                <div className="flex flex-col items-center">
                  <div
                    className={`
                      w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300
                      ${
                        step.number < currentStep
                          ? "bg-green-600 text-white"
                          : step.number === currentStep
                          ? "bg-[#ed1c24] text-white ring-4 ring-red-100"
                          : "bg-gray-200 text-gray-500"
                      }
                    `}
                  >
                    {step.number < currentStep ? (
                      <Check className="w-5 h-5" />
                    ) : (
                      step.number
                    )}
                  </div>
                  <span
                    className={`
                      mt-2 text-xs font-medium transition-colors
                      ${
                        step.number <= currentStep
                          ? "text-[#0d0d0d]"
                          : "text-gray-400"
                      }
                    `}
                  >
                    {step.label}
                  </span>
                </div>

                {/* Connector Line */}
                {index < steps.length - 1 && (
                  <div className="flex-1 h-1 mx-4 relative">
                    <div className="absolute inset-0 bg-gray-200 rounded"></div>
                    <div
                      className={`
                        absolute inset-0 bg-green-600 rounded transition-all duration-500
                        ${step.number < currentStep ? "w-full" : "w-0"}
                      `}
                    ></div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Mobile Progress */}
        <div className="md:hidden">
          <div className="flex items-center gap-4">
            {/* Current Step Indicator */}
            <div className="flex items-center gap-3 flex-1">
              <div className="w-10 h-10 rounded-full bg-[#ed1c24] text-white flex items-center justify-center font-bold ring-4 ring-red-100">
                {currentStep}
              </div>
              <div>
                <p className="text-sm font-bold text-[#0d0d0d]">
                  Step {currentStep} of {steps.length}
                </p>
                <p className="text-xs text-gray-600">
                  {steps.find((s) => s.number === currentStep)?.label}
                </p>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="flex-1">
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#ed1c24] transition-all duration-500 rounded-full"
                  style={{ width: `${(currentStep / steps.length) * 100}%` }}
                ></div>
              </div>
              <p className="text-xs text-gray-500 mt-1 text-right">
                {Math.round((currentStep / steps.length) * 100)}% Complete
              </p>
            </div>
          </div>

          {/* Mini Step Indicators */}
          <div className="flex gap-1.5 mt-4">
            {steps.map((step) => (
              <div
                key={step.number}
                className={`
                  flex-1 h-1 rounded-full transition-all duration-300
                  ${
                    step.number < currentStep
                      ? "bg-green-600"
                      : step.number === currentStep
                      ? "bg-[#ed1c24]"
                      : "bg-gray-200"
                  }
                `}
              ></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

// Compact version for tight spaces
export function CompactBookingProgress({ currentStep }: { currentStep: number }) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-xs text-gray-600 font-medium">
        Step {currentStep}/{steps.length}
      </span>
      <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden max-w-[200px]">
        <div
          className="h-full bg-[#ed1c24] transition-all duration-500"
          style={{ width: `${(currentStep / steps.length) * 100}%` }}
        ></div>
      </div>
    </div>
  )
}
