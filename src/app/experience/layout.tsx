import { TabBar } from "@/components/shared/tab-bar"

const EXPERIENCE_TABS = [
  { label: "On Board", href: "/experience/on-board" },
  { label: "Dining", href: "/experience/on-board/dining" },
  { label: "Lounges", href: "/experience/lounges" },
  { label: "Entertainment", href: "/experience/entertainment" },
]

export default function ExperienceLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-brand-light-grey">
      <TabBar tabs={EXPERIENCE_TABS} />
      <div>
        {children}
      </div>
    </div>
  )
}
