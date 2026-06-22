/**
 * Form validation utilities for Kenya Airways booking system
 */

export interface ValidationResult {
  isValid: boolean
  errors: Record<string, string>
}

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

/**
 * Validate phone number (supports various formats)
 */
export function isValidPhone(phone: string): boolean {
  // Remove spaces, dashes, and parentheses
  const cleaned = phone.replace(/[\s\-\(\)]/g, '')
  // Check if it's a valid phone number (8-15 digits, may start with +)
  const phoneRegex = /^\+?[0-9]{8,15}$/
  return phoneRegex.test(cleaned)
}

/**
 * Validate passport number
 */
export function isValidPassport(passport: string): boolean {
  // Basic validation: 6-9 alphanumeric characters
  const passportRegex = /^[A-Z0-9]{6,9}$/i
  return passportRegex.test(passport)
}

/**
 * Validate credit card number using Luhn algorithm
 */
export function isValidCreditCard(cardNumber: string): boolean {
  // Remove spaces and dashes
  const cleaned = cardNumber.replace(/[\s\-]/g, '')
  
  // Check if it's only digits and proper length
  if (!/^\d{13,19}$/.test(cleaned)) {
    return false
  }
  
  // Luhn algorithm
  let sum = 0
  let isEven = false
  
  for (let i = cleaned.length - 1; i >= 0; i--) {
    let digit = parseInt(cleaned[i], 10)
    
    if (isEven) {
      digit *= 2
      if (digit > 9) {
        digit -= 9
      }
    }
    
    sum += digit
    isEven = !isEven
  }
  
  return sum % 10 === 0
}

/**
 * Validate CVV (3-4 digits)
 */
export function isValidCVV(cvv: string): boolean {
  return /^\d{3,4}$/.test(cvv)
}

/**
 * Validate expiry date (MM/YY or MM/YYYY)
 */
export function isValidExpiryDate(month: string, year: string): boolean {
  const m = parseInt(month, 10)
  const y = parseInt(year, 10)
  
  if (isNaN(m) || isNaN(y)) return false
  if (m < 1 || m > 12) return false
  
  // Convert 2-digit year to 4-digit
  const fullYear = y < 100 ? 2000 + y : y
  
  // Check if card is expired
  const now = new Date()
  const currentYear = now.getFullYear()
  const currentMonth = now.getMonth() + 1
  
  if (fullYear < currentYear) return false
  if (fullYear === currentYear && m < currentMonth) return false
  
  return true
}

/**
 * Validate date of birth (must be at least 18 years ago for adults)
 */
export function isValidDateOfBirth(dob: string, minAge: number = 0): boolean {
  const date = new Date(dob)
  if (isNaN(date.getTime())) return false
  
  const now = new Date()
  const age = now.getFullYear() - date.getFullYear()
  const monthDiff = now.getMonth() - date.getMonth()
  
  if (monthDiff < 0 || (monthDiff === 0 && now.getDate() < date.getDate())) {
    return age - 1 >= minAge
  }
  
  return age >= minAge
}

/**
 * Validate passenger details form
 */
export function validatePassengerDetails(data: {
  firstName: string
  lastName: string
  dateOfBirth: string
  passportNumber?: string
  email?: string
  phone?: string
}): ValidationResult {
  const errors: Record<string, string> = {}
  
  if (!data.firstName || data.firstName.trim().length < 2) {
    errors.firstName = "First name must be at least 2 characters"
  }
  
  if (!data.lastName || data.lastName.trim().length < 2) {
    errors.lastName = "Last name must be at least 2 characters"
  }
  
  if (!data.dateOfBirth) {
    errors.dateOfBirth = "Date of birth is required"
  } else if (!isValidDateOfBirth(data.dateOfBirth, 0)) {
    errors.dateOfBirth = "Invalid date of birth"
  }
  
  if (data.passportNumber && !isValidPassport(data.passportNumber)) {
    errors.passportNumber = "Invalid passport number format"
  }
  
  if (data.email && !isValidEmail(data.email)) {
    errors.email = "Invalid email address"
  }
  
  if (data.phone && !isValidPhone(data.phone)) {
    errors.phone = "Invalid phone number"
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  }
}

/**
 * Validate payment form
 */
export function validatePaymentForm(data: {
  cardNumber: string
  expiryMonth: string
  expiryYear: string
  cvv: string
  cardholderName: string
}): ValidationResult {
  const errors: Record<string, string> = {}
  
  if (!data.cardholderName || data.cardholderName.trim().length < 3) {
    errors.cardholderName = "Cardholder name is required"
  }
  
  if (!isValidCreditCard(data.cardNumber)) {
    errors.cardNumber = "Invalid card number"
  }
  
  if (!isValidExpiryDate(data.expiryMonth, data.expiryYear)) {
    errors.expiry = "Invalid or expired card"
  }
  
  if (!isValidCVV(data.cvv)) {
    errors.cvv = "Invalid CVV (3-4 digits)"
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  }
}

/**
 * Format credit card number with spaces
 */
export function formatCardNumber(value: string): string {
  const cleaned = value.replace(/\D/g, '')
  const groups = cleaned.match(/.{1,4}/g) || []
  return groups.join(' ').substring(0, 19) // Max 16 digits + 3 spaces
}

/**
 * Format phone number
 */
export function formatPhoneNumber(value: string): string {
  const cleaned = value.replace(/\D/g, '')
  
  // Format as: +254 712 345 678
  if (cleaned.startsWith('254')) {
    return `+${cleaned.substring(0, 3)} ${cleaned.substring(3, 6)} ${cleaned.substring(6, 9)} ${cleaned.substring(9, 12)}`
  }
  
  // Format as: 0712 345 678
  if (cleaned.startsWith('0')) {
    return `${cleaned.substring(0, 4)} ${cleaned.substring(4, 7)} ${cleaned.substring(7, 10)}`
  }
  
  return value
}

/**
 * Sanitize input to prevent XSS
 */
export function sanitizeInput(input: string): string {
  return input
    .replace(/[<>]/g, '')
    .trim()
}
