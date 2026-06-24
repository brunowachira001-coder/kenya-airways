import { createClient, SupabaseClient } from '@supabase/supabase-js'

function isValidSupabaseUrl(url: string | undefined): boolean {
  return typeof url === 'string' && /^https?:\/\//.test(url) && !url.includes('your_')
}

function isValidKey(key: string | undefined): boolean {
  return typeof key === 'string' && key.length > 0 && !key.includes('your_')
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

export const supabase: SupabaseClient | null =
  isValidSupabaseUrl(supabaseUrl) && isValidKey(supabaseAnonKey)
    ? createClient(supabaseUrl!, supabaseAnonKey!)
    : null

export const supabaseAdmin: SupabaseClient | null =
  isValidSupabaseUrl(supabaseUrl) && isValidKey(supabaseServiceRoleKey)
    ? createClient(supabaseUrl!, supabaseServiceRoleKey!, { auth: { persistSession: false } })
    : null

export const isSupabaseConfigured = supabase !== null

// Types matching the SQL schema
export interface Booking {
  id?: string
  booking_reference: string
  passenger_name: string
  email: string
  phone?: string
  origin: string
  destination: string
  departure_date: string
  return_date?: string
  cabin_class: string
  trip_type: string
  passengers: PassengerData[]
  base_fare: number
  taxes: number
  total_amount: number
  currency: string
  payment_status?: string
  booking_status?: string
  payment_reference?: string
  mpesa_receipt?: string
  extras?: Record<string, unknown> // JSONB — baggage, insurance, seat, meals, holdBooking, services
  created_at?: string
  updated_at?: string
}

export interface Passenger {
  id?: string
  booking_id: string
  title: string
  first_name: string
  last_name: string
  date_of_birth: string
  gender?: string
  email?: string
  phone?: string
  passport_number?: string
  passport_expiry?: string
  nationality?: string
  special_meal?: string
  special_assistance?: string
  created_at?: string
}

export interface NewsletterSubscriber {
  id?: string
  email: string
  subscribed_at?: string
  is_active?: boolean
  unsubscribed_at?: string
  source?: string
}

export interface ContactMessage {
  id?: string
  name: string
  email: string
  phone?: string
  subject?: string
  message: string
  status?: string
  created_at?: string
  updated_at?: string
}

interface PassengerData {
  title?: string
  firstName?: string
  lastName?: string
  dateOfBirth?: string
  gender?: string
  nationality?: string
  passportNumber?: string
  passportExpiry?: string
}

/**
 * Helper: save a booking to localStorage (fallback when Supabase is unavailable).
 */
export function saveBookingLocally(booking: Record<string, unknown>): void {
  const key = `kq-booking-${Date.now()}`;
  localStorage.setItem(key, JSON.stringify(booking));
}

/**
 * Helper: retrieve all locally-stored bookings.
 */
export function getLocalBookings(): Record<string, unknown>[] {
  if (typeof window === 'undefined') return [];
  const bookings: Record<string, unknown>[] = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key?.startsWith("kq-booking-")) {
      const item = localStorage.getItem(key);
      if (item) {
        try {
          bookings.push(JSON.parse(item));
        } catch {
          // ignore parse errors
        }
      }
    }
  }
  return bookings;
}