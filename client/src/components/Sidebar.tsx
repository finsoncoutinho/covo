'use client'

import React from 'react'
import Link from 'next/link'
import { LayoutDashboard, Users, LineChart, Briefcase, LucideIcon } from 'lucide-react'

interface SidebarItemProps {
  name: string
  url: string
  icon: LucideIcon
}

const mainNavItems: SidebarItemProps[] = [
  { name: 'Dashboard', url: '/dashboard', icon: LayoutDashboard },
  { name: 'Rooms', url: '/rooms', icon: Users },
  { name: 'Analytics', url: '/analytics', icon: LineChart },
  { name: 'Projects', url: '/projects', icon: Briefcase },
]

import { usePathname } from 'next/navigation'

const SidebarItem = ({ name, url, icon: Icon }: SidebarItemProps) => {
  const pathname = usePathname()
  const isActive = pathname === url || pathname?.startsWith(`${url}/`)

  return (
    <Link 
      href={url} 
      className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group hover:shadow-sm hover:ring-1 hover:ring-sidebar-border
        ${isActive 
          ? 'bg-sidebar-accent text-sidebar-accent-foreground font-medium shadow-sm ring-1 ring-sidebar-border' 
          : 'text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
        }
      `}
    >
      <Icon 
        className={`w-5 h-5 transition-transform duration-200 group-hover:scale-110 
          ${isActive 
            ? 'text-sidebar-primary' 
            : 'text-sidebar-foreground/50 group-hover:text-sidebar-primary'
          }
        `} 
      />
      <span className={`text-sm ${isActive ? 'font-medium' : 'font-normal'}`}>{name}</span>
    </Link>
  )
}

const Sidebar = () => {
  return (
    <aside className="w-64 h-screen bg-sidebar border-r border-border-default flex flex-col shadow-sm">
      <div className="h-16 flex items-center px-6 border-b border-border-default">
        <h1 className="logo text-2xl font-bold tracking-tighter text-sidebar-foreground">
          COVO
        </h1>
      </div>

      <nav className="flex-1 px-4 py-6 space-y-4">
        {mainNavItems.map((item) => (
          <SidebarItem key={item.url} {...item} />
        ))}
      </nav>
    </aside>
  )
}

export default Sidebar
