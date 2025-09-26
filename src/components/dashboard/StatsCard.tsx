import { ReactNode } from 'react'
import { cn } from '@/lib/utils/cn'

interface StatsCardProps {
  title: string
  value: string
  change?: string
  changeType?: 'positive' | 'negative' | 'neutral'
  icon: ReactNode
  color?: 'blue' | 'green' | 'red' | 'yellow' | 'purple'
}

const colorClasses = {
  blue: {
    bg: 'bg-blue-100 dark:bg-blue-900',
    icon: 'text-blue-600 dark:text-blue-400',
    border: 'border-blue-200 dark:border-blue-800'
  },
  green: {
    bg: 'bg-green-100 dark:bg-green-900',
    icon: 'text-green-600 dark:text-green-400',
    border: 'border-green-200 dark:border-green-800'
  },
  red: {
    bg: 'bg-red-100 dark:bg-red-900',
    icon: 'text-red-600 dark:text-red-400',
    border: 'border-red-200 dark:border-red-800'
  },
  yellow: {
    bg: 'bg-yellow-100 dark:bg-yellow-900',
    icon: 'text-yellow-600 dark:text-yellow-400',
    border: 'border-yellow-200 dark:border-yellow-800'
  },
  purple: {
    bg: 'bg-purple-100 dark:bg-purple-900',
    icon: 'text-purple-600 dark:text-purple-400',
    border: 'border-purple-200 dark:border-purple-800'
  }
}

const changeTypeClasses = {
  positive: 'text-green-600 dark:text-green-400',
  negative: 'text-red-600 dark:text-red-400',
  neutral: 'text-gray-500 dark:text-gray-400'
}

export default function StatsCard({
  title,
  value,
  change,
  changeType = 'neutral',
  icon,
  color = 'blue'
}: StatsCardProps) {
  const colors = colorClasses[color]

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow duration-200">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
            {title}
          </p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {value}
          </p>
          {change && (
            <p className={cn(
              'text-xs mt-2 font-medium',
              changeTypeClasses[changeType]
            )}>
              {change}
            </p>
          )}
        </div>
        
        <div className={cn(
          'p-3 rounded-full',
          colors.bg
        )}>
          <div className={colors.icon}>
            {icon}
          </div>
        </div>
      </div>
      
      {/* Progress bar for visual enhancement */}
      <div className="mt-4">
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1">
          <div 
            className={cn(
              'h-1 rounded-full transition-all duration-500',
              color === 'blue' && 'bg-blue-500',
              color === 'green' && 'bg-green-500',
              color === 'red' && 'bg-red-500',
              color === 'yellow' && 'bg-yellow-500',
              color === 'purple' && 'bg-purple-500'
            )}
            style={{ width: `${Math.random() * 50 + 50}%` }}
          />
        </div>
      </div>
    </div>
  )
}