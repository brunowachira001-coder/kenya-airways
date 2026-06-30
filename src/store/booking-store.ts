import { create } from "zustand"
import { persist } from "zustand/middleware"

export type TripType = "round-trip" | "one-way" | "multi-city"

// Pricing constants for extras — single source of truth across the booking flow.
// Used by /booking/extras (radio + per-passenger counts) and /booking/review (display only).
export const EXTRA_PRICING = {
  extraBaggagePerBag: 1125, // KES per extra 23kg bag (50% off)
  travelInsurancePerPax: 700, // KES per passenger (50% off)
  extraLegroomSeat: 625, // KES for rows 1–2 (50% off)
  holdBookingFee: 653, // KES flat (50% off)
} as const

/**
 * Calculate the total booking price as ONE sum, used by every page that
 * displays or submits the amount. Prevents per-page price drift (the old
 * bug where passengers/extras/payment each calculated a different total).
 *
 * Layout: flights × fare multiplier × passengers + extras + holdBooking.
 * Tax (15%) is added only when explicitly required (booking creation).
 */
export function calculateBookingTotal(state: {
  selectedOutboundFlight: SelectedFlight | null
  selectedReturnFlight: SelectedFlight | null
  selectedFare: string | null
  passengers: PassengerCounts
  selectedSeat: { price: number } | null
  extras: BookingExtras
}): {
  outboundBase: number
  returnBase: number
  fareMultiplier: number
  flightTotal: number
  baggageTotal: number
  insuranceTotal: number
  seatTotal: number
  mealsIncluded: boolean
  specialAssistanceIncluded: boolean
  holdBookingTotal: number
  extrasTotal: number
  grandTotal: number
} {
  const totalPassengers = state.passengers.adults + state.passengers.children
  const outboundBase = state.selectedOutboundFlight?.price ?? 0
  const returnBase = state.selectedReturnFlight?.price ?? 0

  let fareMultiplier = 1
  if (state.selectedFare === "Economy") fareMultiplier = 1.2
  if (state.selectedFare === "Business Lite" || state.selectedFare === "Business") fareMultiplier = 2.5

  const flightTotal = Math.round((outboundBase + returnBase) * fareMultiplier * totalPassengers)

  const baggageTotal = (state.extras.extraBaggage ?? 0) * EXTRA_PRICING.extraBaggagePerBag
  const insuranceTotal = state.extras.travelInsurance
    ? EXTRA_PRICING.travelInsurancePerPax * totalPassengers
    : 0
  const seatTotal = state.selectedSeat?.price ?? 0
  const holdBookingTotal = state.extras.holdBooking ? EXTRA_PRICING.holdBookingFee : 0

  const extrasTotal = baggageTotal + insuranceTotal + seatTotal + holdBookingTotal
  const grandTotal = flightTotal + extrasTotal

  return {
    outboundBase,
    returnBase,
    fareMultiplier,
    flightTotal,
    baggageTotal,
    insuranceTotal,
    seatTotal,
    mealsIncluded: true,
    specialAssistanceIncluded: true,
    holdBookingTotal,
    extrasTotal,
    grandTotal,
  }
}

export interface PassengerCounts {
  adults: number
  children: number
  infants: number
}

export interface SelectedFlight {
  id: string
  class: string
  price: number
}

export interface PassengerDetail {
  title: string
  firstName: string
  lastName: string
  dateOfBirth: string
  passportNumber: string
  gender: string
  nationality?: string
  passportExpiry?: string
  frequentFlyer?: string
}

export interface BookingExtras {
  seats: string[]
  extraBaggage: number
  travelInsurance: boolean
  meals: Record<string, string> // Passenger Index -> Meal Name
  specialRequests: string[]
  selectedServices?: string[] // IDs of selected extra services
  holdBooking?: boolean
  totalPrice?: number
}

interface BookingState {
  tripType: TripType
  origin: string
  destination: string
  departureDate: string | undefined // ISO string
  returnDate: string | undefined    // ISO string
  passengers: PassengerCounts
  cabinClass: string
  promoCode: string
  
  selectedOutboundFlight: SelectedFlight | null
  selectedReturnFlight: SelectedFlight | null
  selectedFare: string | null // "light" | "standard" | "business"
  passengerDetails: PassengerDetail[]
  contactDetails: {
    email: string
    phone: string
  } | null
  selectedSeat: { id: string, price: number } | null
  extras: BookingExtras
  currentStep: number
  bookingReference: string | null
  
  setTripType: (type: TripType) => void
  setOrigin: (origin: string) => void
  setDestination: (destination: string) => void
  setDepartureDate: (date: string | undefined) => void
  setReturnDate: (date: string | undefined) => void
  updatePassengers: (type: keyof PassengerCounts, count: number) => void
  setCabinClass: (cabin: string) => void
  setPromoCode: (code: string) => void
  
  setSelectedOutboundFlight: (flight: SelectedFlight | null) => void
  setSelectedReturnFlight: (flight: SelectedFlight | null) => void
  setSelectedFare: (fare: string | null) => void
  setPassengerDetails: (details: PassengerDetail[]) => void
  setContactDetails: (contact: { email: string; phone: string } | null) => void
  setSelectedSeat: (seat: { id: string; price: number } | null) => void
  setExtras: (extras: Partial<BookingExtras>) => void
  setCurrentStep: (step: number) => void
  setBookingReference: (reference: string | null) => void
  resetBooking: () => void
  resetAll: () => void
}

export const useBookingStore = create(
  persist<BookingState>(
    (set) => ({
      tripType: "round-trip",
      origin: "",
      destination: "",
      departureDate: undefined,
      returnDate: undefined,
      passengers: {
        adults: 1,
        children: 0,
        infants: 0
      },
      cabinClass: "Economy",
      promoCode: "",
      
      selectedOutboundFlight: null,
      selectedReturnFlight: null,
      selectedFare: null,
      passengerDetails: [],
      contactDetails: null,
      selectedSeat: null,
      extras: {
        seats: [],
        extraBaggage: 0,
        travelInsurance: false,
        meals: {},
        specialRequests: [],
        selectedServices: [],
        holdBooking: false,
        totalPrice: 0
      },
      currentStep: 1,
      bookingReference: null,

      setTripType: (type) => set({ tripType: type }),
      setOrigin: (origin) => set({ origin }),
      setDestination: (destination) => set({ destination }),
      setDepartureDate: (date) => set({ departureDate: date }),
      setReturnDate: (date) => set({ returnDate: date }),
      updatePassengers: (type, count) => set((state) => {
        const updated = {
          ...state.passengers,
          [type]: Math.max(0, count)
        }
        // Adults must be at least 1 if any children or infants are travelling
        if (type !== 'adults' && updated[type] > 0 && updated.adults < 1) {
          updated.adults = 1
        }
        return { passengers: updated }
      }),
      setCabinClass: (cabinClass) => set({ cabinClass }),
      setPromoCode: (code) => set({ promoCode: code }),
      
      setSelectedOutboundFlight: (flight) => set({ selectedOutboundFlight: flight }),
      setSelectedReturnFlight: (flight) => set({ selectedReturnFlight: flight }),
      setSelectedFare: (fare) => set({ selectedFare: fare }),
      setPassengerDetails: (passengerDetails) => set({ passengerDetails }),
      setContactDetails: (contact) => set({ contactDetails: contact }),
      setSelectedSeat: (seat: { id: string; price: number } | null) => set({ selectedSeat: seat }),
      setExtras: (extrasUpdate) => set((state) => ({ 
        extras: { ...state.extras, ...extrasUpdate } 
      })),
      setCurrentStep: (currentStep) => set({ currentStep }),
      setBookingReference: (bookingReference) => set({ bookingReference }),
      resetBooking: () => set({
        selectedOutboundFlight: null,
        selectedReturnFlight: null,
        selectedFare: null,
        passengerDetails: [],
        contactDetails: null,
        extras: {
          seats: [],
          extraBaggage: 0,
          travelInsurance: false,
          meals: {},
          specialRequests: [],
          selectedServices: [],
          holdBooking: false,
          totalPrice: 0
        },
        currentStep: 1,
        bookingReference: null
      }),
      resetAll: () => set({
        tripType: "round-trip",
        origin: "",
        destination: "",
        departureDate: undefined,
        returnDate: undefined,
        passengers: {
          adults: 1,
          children: 0,
          infants: 0
        },
        cabinClass: "Economy",
        promoCode: "",
        selectedOutboundFlight: null,
        selectedReturnFlight: null,
        selectedFare: null,
        passengerDetails: [],
        contactDetails: null,
        extras: {
          seats: [],
          extraBaggage: 0,
          travelInsurance: false,
          meals: {},
          specialRequests: [],
          selectedServices: [],
          holdBooking: false,
          totalPrice: 0
        },
        currentStep: 1,
        bookingReference: null
      })
    }),
    {
      name: "kq-booking-storage"
    }
  )
)