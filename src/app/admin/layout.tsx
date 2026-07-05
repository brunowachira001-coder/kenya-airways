export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-[#0d0d0d] text-white px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-[#ed1c24] font-bold text-xl">KQ</span>
            <h1 className="text-lg font-semibold">Admin Dashboard</h1>
          </div>
          <a href="/" className="text-sm text-gray-400 hover:text-white transition-colors">
            Back to Site
          </a>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        {children}
      </main>
    </div>
  )
}
