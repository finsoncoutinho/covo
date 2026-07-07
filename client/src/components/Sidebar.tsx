'use client'

import React, { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  Users,
  LineChart,
  Briefcase,
  LucideIcon,
  PanelLeftClose,
  PanelLeftOpen,
  Menu,
  X,
} from 'lucide-react'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'

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

const SidebarItem = ({
  name,
  url,
  icon: Icon,
  collapsed,
}: SidebarItemProps & { collapsed: boolean }) => {
  const pathname = usePathname()
  const isActive = pathname === url || pathname?.startsWith(`${url}/`)

  const linkContent = (
    <Link
      href={url}
      className={`flex items-center gap-3 rounded-xl transition-all duration-200 group hover:shadow-sm hover:ring-1 hover:ring-sidebar-border
        ${collapsed ? 'justify-center px-2.5 py-2.5' : 'px-3 py-2.5'}
        ${
          isActive
            ? 'bg-sidebar-accent text-sidebar-accent-foreground font-medium shadow-sm ring-1 ring-sidebar-border'
            : 'text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
        }
      `}
    >
      <Icon
        className={`w-5 h-5 flex-shrink-0 transition-transform duration-200 group-hover:scale-110 
          ${
            isActive
              ? 'text-sidebar-primary'
              : 'text-sidebar-foreground/50 group-hover:text-sidebar-primary'
          }
        `}
      />
      {!collapsed && (
        <span
          className={`text-sm whitespace-nowrap overflow-hidden ${
            isActive ? 'font-medium' : 'font-normal'
          }`}
        >
          {name}
        </span>
      )}
    </Link>
  )

  if (collapsed) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>{linkContent}</TooltipTrigger>
        <TooltipContent side="right" sideOffset={8}>
          <p>{name}</p>
        </TooltipContent>
      </Tooltip>
    )
  }

  return linkContent
}

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const pathname = usePathname()

  // Auto-collapse on medium screens, fully hide on small screens
  const handleResize = useCallback(() => {
    const width = window.innerWidth
    if (width < 1024 && width >= 768) {
      setCollapsed(true)
    } else if (width >= 1024) {
      setCollapsed(false)
    }
    // Close mobile menu on resize to desktop
    if (width >= 768) {
      setMobileOpen(false)
    }
  }, [])

  useEffect(() => {
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [handleResize])

  // Close mobile sidebar on route change
  useEffect(() => {
    setMobileOpen(false)
  }, [pathname])

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [mobileOpen])

  const sidebarContent = (
    <>
      {/* Header */}
      <div
        className={`h-16 flex items-center border-b border-border-default flex-shrink-0 ${
          collapsed ? 'justify-center px-2' : 'px-6'
        }`}
      >
        <h1 className="logo text-2xl font-bold tracking-tighter text-sidebar-foreground">
          {collapsed ? 'C' : 'COVO'}
        </h1>
      </div>

      {/* Nav items */}
      <nav className={`flex-1 py-6 space-y-2 ${collapsed ? 'px-2' : 'px-4'}`}>
        {mainNavItems.map((item) => (
          <SidebarItem key={item.url} {...item} collapsed={collapsed} />
        ))}
      </nav>

      {/* Collapse toggle - hidden on mobile overlay */}
      <div
        className={`hidden md:flex items-center border-t border-border-default p-3 flex-shrink-0 ${
          collapsed ? 'justify-center' : 'justify-end'
        }`}
      >
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              onClick={() => setCollapsed(!collapsed)}
              className="p-2 rounded-lg text-sidebar-foreground/50 hover:text-sidebar-foreground hover:bg-sidebar-accent transition-all duration-200"
              aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
              {collapsed ? (
                <PanelLeftOpen className="w-5 h-5" />
              ) : (
                <PanelLeftClose className="w-5 h-5" />
              )}
            </button>
          </TooltipTrigger>
          <TooltipContent side={collapsed ? 'right' : 'top'} sideOffset={8}>
            <p>{collapsed ? 'Expand sidebar' : 'Collapse sidebar'}</p>
          </TooltipContent>
        </Tooltip>
      </div>
    </>
  )

  return (
    <>
      {/* Mobile hamburger button */}
      <button
        onClick={() => setMobileOpen(true)}
        className="fixed top-4.5 left-4 z-50 md:hidden p-1 text-sidebar-foreground/70 hover:text-sidebar-foreground transition-colors duration-200"
        aria-label="Open sidebar"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Mobile overlay backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm md:hidden transition-opacity duration-300"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile sidebar drawer */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-sidebar border-r border-border-default flex flex-col shadow-xl md:hidden transition-transform duration-300 ease-in-out ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Close button for mobile */}
        <button
          onClick={() => setMobileOpen(false)}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-sidebar-foreground/50 hover:text-sidebar-foreground hover:bg-sidebar-accent transition-all duration-200"
          aria-label="Close sidebar"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="h-16 flex items-center px-6 border-b border-border-default flex-shrink-0">
          <h1 className="logo text-2xl font-bold tracking-tighter text-sidebar-foreground">
            COVO
          </h1>
        </div>

        {/* Nav items */}
        <nav className="flex-1 px-4 py-6 space-y-2">
          {mainNavItems.map((item) => (
            <SidebarItem key={item.url} {...item} collapsed={false} />
          ))}
        </nav>
      </aside>

      {/* Desktop sidebar */}
      <aside
        className={`hidden md:flex flex-col h-screen bg-sidebar border-r border-border-default shadow-sm flex-shrink-0 transition-all duration-300 ease-in-out ${
          collapsed ? 'w-[68px]' : 'w-64'
        }`}
      >
        {sidebarContent}
      </aside>
    </>
  )
}

export default Sidebar
