/**
 * Date utility functions for generating dynamic date ranges
 */

/**
 * Format date to "DD MMM YY" format (e.g., "30 Jun 26")
 */
export function formatDateShort(date: Date): string {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  const day = date.getDate()
  const month = months[date.getMonth()]
  const year = date.getFullYear().toString().slice(-2)
  return `${day} ${month} ${year}`
}

/**
 * Generate a date range string (e.g., "30 Jun 26 to 05 Jul 26")
 */
export function generateDateRange(startDaysFromNow: number, durationDays: number): string {
  const startDate = new Date()
  startDate.setDate(startDate.getDate() + startDaysFromNow)
  
  const endDate = new Date(startDate)
  endDate.setDate(endDate.getDate() + durationDays)
  
  return `${formatDateShort(startDate)} to ${formatDateShort(endDate)}`
}

/**
 * Get current date for real-time display
 */
export function getCurrentDate(): Date {
  return new Date()
}

/**
 * Add days to a date
 */
export function addDays(date: Date, days: number): Date {
  const result = new Date(date)
  result.setDate(result.getDate() + days)
  return result
}
