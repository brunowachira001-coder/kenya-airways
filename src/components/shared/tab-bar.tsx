"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

import { cn } from "@/lib/utils"

interface TabBarProps {
  tabs: {
    label: string
    href: string
  }[]
  className?: string
}

export function TabBar({ tabs, className }: TabBarProps) {
  const pathname = usePathname()

  return (
    <div className={cn("w-full border-b bg-white", className)}>
      <div className="max-w-content mx-auto px-4 overflow-x-auto hide-scrollbar">
        <nav className="flex min-w-max">
          {tabs.map((tab, index) => {
            const isActive = pathname === tab.href || pathname.startsWith(`${tab.href}/`)
            
            return (
              <Link
                key={index}
                href={tab.href}
                className={cn(
                  "py-4 px-6 md:px-8 text-sm md:text-base font-medium transition-colors border-b-2 whitespace-nowrap",
                  isActive 
                    ? "border-brand-primary text-brand-primary" 
                    : "border-transparent text-gray-500 hover:text-brand-secondary hover:border-gray-300"
                )}
                aria-current={isActive ? "page" : undefined}
              >
                {tab.label}
              </Link>
            )
          })}
        </nav>
      </div>
    </div>
  )
}
