import { TabBar } from "@/components/shared/tab-bar"

const PLAN_TABS = [
  { label: "Baggage Information", href: "/plan/baggage-information" },
  { label: "Travel Information", href: "/plan/travel-information" },
  { label: "Special Care & Assistance", href: "/plan/special-care" },
  { label: "Travel Services", href: "/plan/travel-services" },
]

export default function PlanLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-brand-light-grey">
      <TabBar tabs={PLAN_TABS} />
      <div>
        {children}
      </div>
    </div>
  )
}
