// Input sanitization utilities to prevent XSS and injection attacks

/**
 * Strip HTML tags and dangerous characters from user input
 */
export function sanitizeString(input: string): string {
  if (typeof input !== "string") return ""

  return input
    // Remove HTML tags
    .replace(/<[^>]*>/g, "")
    // Remove javascript: protocol
    .replace(/javascript:/gi, "")
    // Remove data: protocol (except safe images)
    .replace(/data:(?!image\/)/gi, "")
    // Remove event handlers
    .replace(/on\w+\s*=/gi, "")
    // Remove common XSS characters
    .replace(/[<>'"]/g, "")
    // Trim whitespace
    .trim()
}

/**
 * Sanitize an email address
 */
export function sanitizeEmail(email: string): string {
  if (typeof email !== "string") return ""
  // Only allow valid email characters
  return email.replace(/[^a-zA-Z0-9@._-]/g, "").trim().toLowerCase()
}

/**
 * Sanitize a phone number
 */
export function sanitizePhone(phone: string): string {
  if (typeof phone !== "string") return ""
  // Only allow digits and +
  return phone.replace(/[^0-9+]/g, "").trim()
}

/**
 * Deep sanitize an object's string values
 */
export function sanitizeObject<T extends Record<string, unknown>>(obj: T): T {
  const sanitized = { ...obj }
  for (const key of Object.keys(sanitized)) {
    if (typeof sanitized[key] === "string") {
      ;(sanitized as Record<string, unknown>)[key] = sanitizeString(sanitized[key] as string)
    }
  }
  return sanitized
}
