'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils/cn'
import {
  Home,
  Users,
  Clock,
  FileText,
  Settings,
  Wifi,
  X,
  BarChart3,
  Download,
  Calendar,
  User
} from 'lucide-react'

interface SidebarProps {
  open: boolean
  setOpen: (open: boolean) => void
}

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: Home },
  { name: 'Attendance', href: '/dashboard/attendance', icon: Clock },
  { name: 'Employees', href: '/dashboard/employees', icon: Users },
  { name: 'Reports', href: '/dashboard/reports', icon: FileText },
  { name: 'Settings', href: '/dashboard/settings', icon: Settings },
]

const quickActions = [
  { name: 'Export Data', href: '/dashboard/reports/export', icon: Download },
  { name: 'Device Status', href: '/dashboard/settings/device', icon: Wifi },
  { name: 'Sync Now', href: '/dashboard/settings/sync', icon: BarChart3 },
]

export default function Sidebar({ open, setOpen }: SidebarProps) {
  const pathname = usePathname()

  return (
    <>
      {/* Mobile backdrop */}
      {open && (
        <div
          className="fixed inset-0 z-40 lg:hidden"
          onClick={() => setOpen(false)}
        >
          <div className="absolute inset-0 bg-gray-600 opacity-75" />
        </div>
      )}

      {/* Sidebar */}
      <div
        className={cn(
          'fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-gray-800 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0',
          open ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="flex items-center justify-between h-16 px-6 bg-gray-900 dark:bg-gray-800">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Clock className="h-8 w-8 text-blue-500" />
            </div>
            <div className="ml-3">
              <h1 className="text-lg font-semibold text-white">
                ZKTECO System
              </h1>
            </div>
          </div>
          <button
            onClick={() => setOpen(false)}
            className="lg:hidden text-gray-400 hover:text-white"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <nav className="mt-8 px-4">
          <div className="space-y-1">
            {navigation.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    'group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors',
                    isActive
                      ? 'bg-blue-100 dark:bg-blue-900 text-blue-900 dark:text-blue-100'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white'
                  )}
                  onClick={() => setOpen(false)}
                >
                  <item.icon
                    className={cn(
                      'mr-3 h-5 w-5 flex-shrink-0',
                      isActive
                        ? 'text-blue-500'
                        : 'text-gray-400 group-hover:text-gray-500'
                    )}
                  />
                  {item.name}
                </Link>
              )
            })}
          </div>

          <div className="mt-8">
            <h3 className="px-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Quick Actions
            </h3>
            <div className="mt-2 space-y-1">
              {quickActions.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="group flex items-center px-3 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white transition-colors"
                  onClick={() => setOpen(false)}
                >
                  <item.icon className="mr-3 h-4 w-4 flex-shrink-0 text-gray-400 group-hover:text-gray-500" />
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
        </nav>

        {/* Device Status */}
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="h-2 w-2 bg-green-400 rounded-full"></div>
                <span className="ml-2 text-xs text-gray-600 dark:text-gray-300">
                  Device Online
                </span>
              </div>
              <Wifi className="h-4 w-4 text-gray-400" />
            </div>
            <div className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              192.168.10.201:4370
            </div>
          </div>
        </div>
      </div>
    </>
  )
}