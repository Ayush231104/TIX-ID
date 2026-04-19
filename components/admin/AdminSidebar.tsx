'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import type { LucideIcon } from 'lucide-react'
import { Film, Clapperboard, Building2, CalendarPlus2, Newspaper, ArrowLeft, LayoutDashboard, TicketPercent } from 'lucide-react'
import Typography from '@/components/ui/Typography'
import { useGetAdminRoleQuery } from '@/lib/features/api/adminApi'

type SidebarLink = {
  href: string
  label: string
  icon: LucideIcon
}

const superAdminLinks: SidebarLink[] = [
  { href: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/movies', label: 'Movies', icon: Film },
  { href: '/admin/news', label: 'News', icon: Newspaper },
  { href: '/admin/discounts', label: 'Discounts', icon: TicketPercent },
]

const theaterAdminLinks: SidebarLink[] = [
  { href: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/theaters', label: 'Theaters', icon: Building2 },
  { href: '/admin/screens', label: 'Screens', icon: Clapperboard },
  { href: '/admin/showtimes', label: 'Showtimes', icon: CalendarPlus2 },
]

export default function AdminSidebar() {
  const pathname = usePathname()
  const { data: role, isLoading } = useGetAdminRoleQuery()

  const links = role === 'super_admin' ? superAdminLinks : theaterAdminLinks

  return (
    <aside className="flex h-full min-h-screen flex-col px-5 py-6 text-shade-900">
      <div className="rounded-lg border border-shade-300 bg-white/90 p-5">
        <div className="flex items-center gap-3">
          <div className="flex size-12 items-center justify-center rounded-xl bg-linear-to-r  from-xxi-gold to-xxi-gold-dark text-lg font-bold tracking-[0.15em] text-white">
            TIX
          </div>
          <div>
            <Typography as="h1" variant="h3" color="shade-900" className="font-bold tracking-[-0.02em]">
              Admin Panel
            </Typography>
            <Typography variant="body-small" color="shade-700" className="mt-1">
              Premium operations workspace
            </Typography>
          </div>
        </div>

        <div className="mt-4 inline-flex rounded-sm bg-xxi-gold/15 px-3 py-1 ring-1 ring-inset ring-xxi-gold-dark/30">
          <Typography variant="body-small" color="royal-blue" className="font-semibold uppercase tracking-[0.12em]">
            {isLoading ? 'Checking access' : role === 'super_admin' ? 'Super Admin' : 'Theater Admin'}
          </Typography>
        </div>
      </div>

      <nav className="mt-6 flex flex-1 flex-col gap-2">
        {links.map((item) => {
          const isActive = item.href === '/admin/dashboard'
            ? pathname === item.href
            : pathname === item.href || pathname.startsWith(`${item.href}/`)
          const Icon = item.icon

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`group flex items-center gap-3 rounded-lg px-4 py-3.5 transition-all ${
                isActive
                  ? 'bg-white text-royal-blue-default shadow-sm ring-1 ring-shade-300'
                  : 'bg-white/65 text-shade-800 hover:bg-white hover:translate-x-0.5'
              }`}
            >
              <Icon className={`h-4 w-4 ${isActive ? 'text-royal-blue-default' : 'text-shade-700'}`} aria-hidden="true" />
              <Typography variant="body-default" color={isActive ? 'royal-blue' : 'shade-800'} className="font-semibold">
                {item.label}
              </Typography>
            </Link>
          )
        })}
      </nav>

      <div className="mt-6 border-t border-shade-300 pt-5">
        <Link
          href="/"
          className="group flex items-center gap-3 rounded-lg bg-white/65 px-4 py-3 transition-all hover:bg-white hover:translate-x-0.5"
        >
          <ArrowLeft className="h-4 w-4 text-shade-700" aria-hidden="true" />
          <Typography variant="body-default" color="shade-800" className="font-semibold">
            Back To Home
          </Typography>
        </Link>
      </div>
    </aside>
  )
}
