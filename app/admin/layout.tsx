import type { ReactNode } from 'react'
import AdminSidebar from '@/components/admin/AdminSidebar'

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen w-full bg-shade-100 text-shade-900">
      <div className="mx-auto flex min-h-screen w-full max-w-400 flex-col lg:flex-row">
        <div className="sticky top-0 h-auto w-full shrink-0 overflow-hidden border-r border-shade-400 bg-white shadow-[0_18px_40px_rgba(26,44,80,0.28)] lg:h-screen lg:w-75">
          <AdminSidebar />
        </div>

        <main className="min-h-screen flex-1 px-4 py-4 sm:px-6 sm:py-6 lg:px-8 lg:py-8">
          <div className="h-full rounded-lg border border-shade-200 bg-white px-4 py-5 shadow-[0_14px_36px_rgba(51,51,51,0.08)] xl:px-8 xl:py-8">
          {children}
          </div>
        </main>
      </div>
    </div>
  )
}
