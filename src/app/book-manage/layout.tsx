import { TabBar } from "@/components/shared/tab-bar"

const BOOK_MANAGE_TABS = [
  { label: "Book a Flight", href: "/booking/select-flight" },
  { label: "Manage Booking", href: "/book-manage/manage-booking" },
  { label: "Check-in", href: "/book-manage/check-in" },
  { label: "Flight Status", href: "/book-manage/flight-status" },
  { label: "Flight Schedule", href: "/book-manage/flight-schedule" },
]

export default function BookManageLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-brand-light-grey">
      <TabBar tabs={BOOK_MANAGE_TABS} />
      <div className="py-8 md:py-12">
        {children}
      </div>
    </div>
  )
}
