'use client'

import { useState } from 'react'
import { 
  Menu, 
  Bell, 
  Search, 
  User, 
  Settings, 
  LogOut,
  Sun,
  Moon,
  Wifi,
  WifiOff
} from 'lucide-react'

interface HeaderProps {
  onMenuClick: () => void
}

export default function Header({ onMenuClick }: HeaderProps) {
  const [darkMode, setDarkMode] = useState(true)
  const [deviceStatus, setDeviceStatus] = useState<'online' | 'offline'>('online')
  const [showProfileMenu, setShowProfileMenu] = useState(false)

  const toggleDarkMode = () => {
    setDarkMode(!darkMode)
    // In a real app, you'd implement theme switching logic here
  }

  return (
    <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Left side */}
        <div className="flex items-center">
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <Menu className="h-6 w-6" />
          </button>

          <div className="ml-4 flex items-center">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search employees, attendance..."
                className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent w-80"
              />
            </div>
          </div>
        </div>

        {/* Right side */}
        <div className="flex items-center space-x-4">
          {/* Device Status */}
          <div className="flex items-center space-x-2">
            {deviceStatus === 'online' ? (
              <div className="flex items-center text-green-600 dark:text-green-400">
                <Wifi className="h-4 w-4" />
                <span className="ml-1 text-sm font-medium">Online</span>
              </div>
            ) : (
              <div className="flex items-center text-red-600 dark:text-red-400">
                <WifiOff className="h-4 w-4" />
                <span className="ml-1 text-sm font-medium">Offline</span>
              </div>
            )}
          </div>

          {/* Theme Toggle */}
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-lg text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </button>

          {/* Notifications */}
          <button className="p-2 rounded-lg text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 relative">
            <Bell className="h-5 w-5" />
            <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full"></span>
          </button>

          {/* Profile Menu */}
          <div className="relative">
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <div className="h-8 w-8 bg-blue-500 rounded-full flex items-center justify-center">
                <User className="h-5 w-5 text-white" />
              </div>
              <div className="hidden md:block text-left">
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  Admin User
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  System Administrator
                </p>
              </div>
            </button>

            {/* Profile Dropdown */}
            {showProfileMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-1 z-50">
                <button className="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
                  <User className="h-4 w-4 mr-3" />
                  Profile
                </button>
                <button className="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
                  <Settings className="h-4 w-4 mr-3" />
                  Settings
                </button>
                <hr className="my-1 border-gray-200 dark:border-gray-600" />
                <button className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900">
                  <LogOut className="h-4 w-4 mr-3" />
                  Sign Out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Sync Status Bar */}
      <div className="mt-4 flex items-center justify-between bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3">
        <div className="flex items-center">
          <div className="h-2 w-2 bg-blue-500 rounded-full animate-pulse mr-2"></div>
          <span className="text-sm text-blue-700 dark:text-blue-300">
            Last sync: 2 minutes ago
          </span>
        </div>
        <button className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200 font-medium">
          Sync Now
        </button>
      </div>
    </header>
  )
}