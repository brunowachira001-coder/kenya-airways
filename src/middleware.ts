import { NextRequest, NextResponse } from "next/server"

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

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
