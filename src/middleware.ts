import { NextRequest, NextResponse } from "next/server"

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  // Protect /admin routes and /api/admin routes
  if (pathname.startsWith("/admin") || pathname.startsWith("/api/admin")) {
    // Check for basic auth header
    const authHeader = req.headers.get("authorization")

    if (!authHeader || !authHeader.startsWith("Basic ")) {
      return new NextResponse("Authentication required", {
        status: 401,
        headers: { "WWW-Authenticate": 'Basic realm="Admin"' },
      })
    }

    // Decode and verify credentials
    const base64 = authHeader.split(" ")[1]
    const decoded = atob(base64)
    const [username, password] = decoded.split(":")

    if (username !== "admin" || password !== ADMIN_PASSWORD) {
      return new NextResponse("Invalid credentials", {
        status: 401,
        headers: { "WWW-Authenticate": 'Basic realm="Admin"' },
      })
    }
  }

  // Block access to sensitive files
  const sensitivePatterns = [
    "/.env",
    "/.env.local",
    "/.env.production",
    "/.git",
    "/supabase-setup.sql",
    "/supabase-admin-migration.sql",
    "/supabase-flights-migration.sql",
    "/seed-flights.ts",
    "/fix-mru.ts",
  ]

  for (const pattern of sensitivePatterns) {
    if (pathname.startsWith(pattern)) {
      return new NextResponse("Not Found", { status: 404 })
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
}
