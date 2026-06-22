import Link from "next/link"
import { ChevronRight, Home } from "lucide-react"

interface BreadcrumbProps {
  items: {
    label: string
    href?: string
  }[]
}

export function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <nav className="flex items-center text-sm text-gray-500 overflow-x-auto whitespace-nowrap hide-scrollbar py-2">
      <Link href="/" className="flex items-center hover:text-brand-primary transition-colors">
        <Home className="w-4 h-4" />
        <span className="sr-only">Home</span>
      </Link>
      
      {items.map((item, index) => (
        <div key={index} className="flex items-center">
          <ChevronRight className="w-4 h-4 mx-1" />
          {item.href ? (
            <Link 
              href={item.href}
              className="hover:text-brand-primary transition-colors"
            >
              {item.label}
            </Link>
          ) : (
            <span className="text-brand-secondary font-medium" aria-current="page">
              {item.label}
            </span>
          )}
        </div>
      ))}
    </nav>
  )
}
