'use client'

import React, { useEffect, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import Link from 'next/link'
import { User as UserIcon, Settings, Moon, Sun, LogOut } from 'lucide-react'
import { useTheme } from 'next-themes'
import { useCurrentUser } from '@/features/auth/hooks/useCurrentUser'
import { useLogout } from '@/features/auth/hooks/useLogout'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

const getInitials = (name?: string, email?: string) => {
  if (name) {
    const parts = name.trim().split(' ')
    if (parts.length > 1) {
      return (parts[0][0] + parts[1][0]).toUpperCase()
    }
    return parts[0][0].toUpperCase()
  }
  if (email) {
    return email[0].toUpperCase()
  }
  return 'U'
}

const Navbar = () => {
  const pathname = usePathname()
  const router = useRouter()
  const { theme, setTheme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  const { user } = useCurrentUser()
  const { logout } = useLogout()

  const getPageTitle = () => {
    if (!pathname) return 'Dashboard'
    const segment = pathname.split('/')[1]
    if (!segment) return 'Dashboard'
    return segment.charAt(0).toUpperCase() + segment.slice(1)
  }

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleLogout = async () => {
    try {
      await logout()
      router.push('/login')
    } catch (e) {
      console.error('Logout failed', e)
    }
  }

  const isDark = mounted ? resolvedTheme === 'dark' : false

  return (
    <header className='h-16 flex items-center justify-between px-8 bg-background z-10 sticky top-0'>
      <h2 className='page-title text-[22px] font-semibold text-foreground'>
        {getPageTitle()}
      </h2>

      <DropdownMenu>
        <DropdownMenuTrigger className='flex items-center justify-center rounded-full hover:ring-2 hover:ring-primary hover:ring-offset-2 hover:ring-offset-background transition-all focus:outline-none'>
          <Avatar className='w-9 h-9'>
            <AvatarImage src={user?.avatarUrl} alt={user?.name || 'User'} />
            <AvatarFallback className='bg-primary/15 text-primary font-semibold text-sm'>
              {user ? getInitials(user.name, user.email) : 'U'}
            </AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent className='w-64' align='end' forceMount>
          <DropdownMenuLabel className='font-normal p-5'>
            <div className='flex items-center gap-4'>
              <Avatar className='w-10 h-10'>
                <AvatarImage src={user?.avatarUrl} alt={user?.name || 'User'} />
                <AvatarFallback className='bg-primary/15 text-primary font-bold text-sm'>
                  {user ? getInitials(user.name, user.email) : 'U'}
                </AvatarFallback>
              </Avatar>
              <div className='flex flex-col space-y-1 min-w-0'>
                <p className='text-sm font-medium leading-none truncate'>
                  {user?.name || 'User'}
                </p>
                <p className='text-xs leading-none text-slate-500 dark:text-slate-400 truncate'>
                  {user?.email || 'user@example.com'}
                </p>
              </div>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem asChild>
              <Link
                href='/profile'
                className='flex items-center cursor-pointer py-2'
              >
                <UserIcon className='mr-2 h-4 w-4' />
                <span>Profile</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link
                href='/settings'
                className='flex items-center cursor-pointer py-2'
              >
                <Settings className='mr-2 h-4 w-4' />
                <span>Settings</span>
              </Link>
            </DropdownMenuItem>
            {mounted && (
              <DropdownMenuItem
                className='flex items-center cursor-pointer py-2'
                onClick={(e) => {
                  e.preventDefault()
                  setTheme(isDark ? 'light' : 'dark')
                }}
              >
                {isDark ? (
                  <Sun className='mr-2 h-4 w-4' />
                ) : (
                  <Moon className='mr-2 h-4 w-4' />
                )}
                <span>{isDark ? 'Light Mode' : 'Dark Mode'}</span>
              </DropdownMenuItem>
            )}
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className='flex items-center py-2 text-red-600 dark:text-red-400 focus:text-red-600 dark:focus:text-red-400 focus:bg-red-50 dark:focus:bg-red-950/30 cursor-pointer'
            onClick={handleLogout}
          >
            <LogOut className='mr-2 h-4 w-4' />
            <span>Logout</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  )
}

export default Navbar
