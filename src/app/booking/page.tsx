"use client"

import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function BookingPage() {
  const router = useRouter()
  
  useEffect(() => {
    router.push("/search")
  }, [router])
  
  return null
}
